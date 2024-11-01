import { Code, ConnectError } from "@connectrpc/connect";
import { createCookie, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import z from "zod";
import { tokensServiceClient as tokens, usersServiceClient as users } from "~/clients/grpc.server";
import { commitSession, getSession } from "~/session.server";

invariant(typeof process.env.GOMMERCE_AUTH_REALM === "string", "environment variable GOMMERCE_AUTH_REALM is required.");
invariant(typeof process.env.REMIX_COOKIE_SECRET === "string", "environment variable REMIX_COOKIE_SECRET is required.");
invariant(
    typeof process.env.GOMMERCE_CLIENT_TOKEN === "string",
    "environment variable GOMMERCE_CLIENT_TOKEN is required.",
);

const authRealm = process.env.GOMMERCE_AUTH_REALM;
const cookieSecret = process.env.REMIX_COOKIE_SECRET;
const clientToken = process.env.GOMMERCE_CLIENT_TOKEN;

const __token__ = createCookie("__token__", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [cookieSecret],
    secure: process.env.NODE_ENV === "production",
});

export async function getToken(request: Request) {
    const cookie = (await __token__.parse(request.headers.get("Cookie"))) as string | null;
    return typeof cookie === "string" ? cookie : null;
}

export async function getIdentity(request: Request) {
    const token = await getToken(request);
    if (token) {
        const { user, scope } = await users.getIdentity({}, { headers: { Authorization: `Bearer ${token}` } });
        if (user) {
            return { user: user.toJson(), scope: scope };
        }
        console.error("unexpected error: user is not present in the response", {
            user,
            scope,
        });
        throw new Error("unexpected error: user is not present in the response");
    }
    return null;
}

export async function authorize(request: Request) {
    const token = await getToken(request);
    if (token) {
        try {
            const { user, scope } = await users.getIdentity({}, { headers: { Authorization: `Bearer ${token}` } });
            if (user) {
                return { user: user.toJson(), token, scope: scope };
            }
            console.error("unexpected error: user is not present in the response", {
                user,
                scope,
            });
            throw new Error("unexpected error: user is not present in the response");
        } catch (error) {
            if (!(error instanceof ConnectError) || error.code !== Code.Unauthenticated) {
                throw error;
            }
        }
    }
    return null;
}

export const LoginForm = z.object({
    username: z.string().min(5, "username must be at least 5 characters long"),
    password: z.string().min(5, "password must be at least 5 characters long"),
});

export type LoginFormType = z.infer<typeof LoginForm>;

export async function login(request: Request, redirectTo = "/") {
    const formData = await request.formData();
    const { username, password } = LoginForm.parse(Object.fromEntries(formData));
    const { accessToken, refreshToken, expiresIn } = await tokens.createToken(
        {
            realm: authRealm,
            provider: "FORM_PASSWORD",
            username,
            password,
        },
        {
            headers: {
                Authorization: `Basic ${clientToken}`,
            },
        },
    );
    const session = await getSession(request.headers.get("Cookie"));
    session.set("refresh_token", refreshToken);
    const headers = new Headers();
    headers.append("Set-Cookie", await __token__.serialize(accessToken, { maxAge: expiresIn }));
    headers.append("Set-Cookie", await commitSession(session));
    return redirect(redirectTo, { headers });
}

export async function logout(request: Request, redirectTo = "/") {
    const session = await getSession(request.headers.get("Cookie"));
    session.unset("refresh_token");
    const headers = new Headers();
    headers.append("Set-Cookie", await __token__.serialize("", { maxAge: undefined, expires: new Date(0) }));
    headers.append("Set-Cookie", await commitSession(session));
    return redirect(redirectTo, { headers });
}

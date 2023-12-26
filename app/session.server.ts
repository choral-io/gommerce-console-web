import invariant from "tiny-invariant";
import { createStateSessionStorage } from "~/clients/state.server";

invariant(process.env.REMIX_COOKIE_SECRET, "environment variable REMIX_COOKIE_SECRET is required.");

export const { getSession, commitSession, destroySession } = createStateSessionStorage({
    cookie: {
        name: "__state__",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
        sameSite: "lax",
        secrets: [process.env.REMIX_COOKIE_SECRET],
        secure: process.env.NODE_ENV === "production",
    },
});

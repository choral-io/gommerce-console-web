import invariant from "tiny-invariant";
import { createStateSessionStorage } from "~/clients/state.server";

invariant(process.env.REMIX_COOKIE_SECRET, "environment variable REMIX_COOKIE_SECRET is required.");

export const { getSession, commitSession, destroySession } = createStateSessionStorage({
    cookie: {
        name: "__state__",
        httpOnly: true,
        maxAge: parseInt(process.env.REMIX_COOKIE_MAXAGE ?? "604800"), // default to 7 days
        path: "/",
        sameSite: "lax",
        secrets: [process.env.REMIX_COOKIE_SECRET],
        secure: process.env.NODE_ENV === "production",
    },
});

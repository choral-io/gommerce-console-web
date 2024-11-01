import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Links, Meta, Scripts, ScrollRestoration, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import Outlet from "~/partials/layout";
import { authorize } from "~/secure.server";
import styles from "~/styles/global.css?url";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export async function loader({ request }: LoaderFunctionArgs) {
    const identity = await authorize(request);
    return {
        user: identity?.user,
        token: identity?.token,
        scope: identity?.scope,
    };
}

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}

export function ErrorBoundary() {
    const error = useRouteError();
    return isRouteErrorResponse(error) ? (
        <>
            <h1>
                {error.status} {error.statusText}
            </h1>
            <p>{error.data}</p>
        </>
    ) : error instanceof Error ? (
        <>
            <h1>Error</h1>
            <p>{error.message}</p>
            <p>The stack trace is:</p>
            <pre>{error.stack}</pre>
        </>
    ) : (
        <h1>Unknown Error</h1>
    );
}

import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { cssBundleHref } from "@remix-run/css-bundle";
import {
    Links,
    LiveReload,
    Meta,
    Scripts,
    ScrollRestoration,
    isRouteErrorResponse,
    useLoaderData,
    useRouteError,
} from "@remix-run/react";
import { authorize } from "~/secure.server";
import Layout from "~/partials/layout";
import globalStylesUrl from "~/styles/global.css";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: globalStylesUrl },
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export async function loader({ request }: LoaderFunctionArgs) {
    const identity = await authorize(request);
    return {
        user: identity?.user,
        scope: identity?.scope,
        env: { GOMMERCE_GRPC_ENDPOINT: process.env.GOMMERCE_GRPC_ENDPOINT },
    };
}

export default function App() {
    const { env } = useLoaderData<typeof loader>();
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                <Layout /> {/* <Layout /> is a wrapper for the <Outlet /> */}
                <ScrollRestoration />
                <script dangerouslySetInnerHTML={{ __html: `window.env = ${JSON.stringify(env)};` }} />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body className="prose max-w-none p-4">
                {isRouteErrorResponse(error) ? (
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
                )}
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}

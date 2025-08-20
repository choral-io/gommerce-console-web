import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import clsx from "clsx";
import { login, type LoginFormType } from "~/secure.server";
import { handleError } from "~/utils/forms";

export const meta: MetaFunction = () => {
    return [{ title: "Login" }];
};

export async function action({ request }: ActionFunctionArgs) {
    try {
        return await login(request);
    } catch (e) {
        return handleError<LoginFormType>(e);
    }
}

export default function Index() {
    const navigation = useNavigation();
    const submitting = navigation.state === "submitting";
    const actionData = useActionData<typeof action>();
    return (
        <>
            <div className="rounded-box border-base-content/10 bg-base-100 mx-auto mt-16 max-w-md border px-12 py-6 shadow-2xl">
                <Form method="post">
                    <p className="my-6 text-center text-2xl font-semibold uppercase">Gommerce</p>
                    <ul className="text-error list-inside list-disc">
                        {actionData?.formErrors.map((m: string, k: number) => (
                            <li key={k} title={m}>
                                {m}
                            </li>
                        ))}
                    </ul>
                    <fieldset className="fieldset">
                        <label className="fieldset-label" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            className={clsx("input w-full", {
                                "input-error": !!actionData?.fieldErrors.username,
                            })}
                            placeholder="Username"
                            autoComplete="username"
                        />
                        <ul className="text-error list-inside list-disc">
                            {actionData?.fieldErrors.username?.map((m: string, k: number) => (
                                <li key={k} title={m}>
                                    {m}
                                </li>
                            ))}
                        </ul>
                        <label className="fieldset-label" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className={clsx("input w-full", {
                                "input-error": !!actionData?.fieldErrors.password,
                            })}
                            placeholder="Password"
                        />
                        <ul className="text-error list-inside list-disc">
                            {actionData?.fieldErrors.password?.map((m: string, k: number) => (
                                <li key={k} title={m}>
                                    {m}
                                </li>
                            ))}
                        </ul>
                    </fieldset>
                    <button type="submit" className="btn btn-primary btn-block my-6 uppercase" disabled={submitting}>
                        {submitting ? "Logging in..." : "Login"}
                    </button>
                </Form>
            </div>
        </>
    );
}

export const handle = {
    layout: {
        useSidebar: false,
    },
    secure: {
        allowAnonymous: true,
    },
};

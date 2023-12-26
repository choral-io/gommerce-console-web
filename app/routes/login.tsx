import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { ConnectError } from "@connectrpc/connect";
import { login, type LoginFormType } from "~/secure.server";
import { ZodError } from "zod";
import clsx from "clsx";
import { parseError } from "~/utils/forms";

export const meta: MetaFunction = ({ matches }) => {
    return [{ title: "Login" }];
};

export async function action({ request }: ActionFunctionArgs) {
    try {
        return await login(request);
    } catch (e) {
        if (e instanceof ZodError || e instanceof ConnectError) {
            return parseError<LoginFormType>(e);
        }
        throw new Error("Unknown error: " + e);
    }
}

export default function Index() {
    const navigation = useNavigation();
    const submitting = navigation.state === "submitting";
    const actionData = useActionData<typeof action>();
    return (
        <>
            <div className="mx-auto mt-16 max-w-md rounded-box border border-base-content/10 bg-base-100 px-12 py-6 shadow-2xl">
                <Form method="post">
                    <p className="my-6 select-none text-center text-2xl font-semibold uppercase">Gommerce</p>
                    <ul className="list-inside list-disc text-error">
                        {actionData?.formErrors?.map((m: string, k: number) => (
                            <li key={k} title={m}>
                                {m}
                            </li>
                        ))}
                    </ul>
                    <label className="form-control">
                        <div className="label font-semibold">Username</div>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            className={clsx("input input-bordered", {
                                "input-error": !!actionData?.fieldErrors.username,
                            })}
                            placeholder="Username"
                        />
                    </label>
                    <ul className="list-inside list-disc text-error">
                        {actionData?.fieldErrors.username?.map((m: string, k: number) => (
                            <li key={k} title={m}>
                                {m}
                            </li>
                        ))}
                    </ul>
                    <label className="form-control">
                        <div className="label font-semibold">Password</div>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className={clsx("input input-bordered", {
                                "input-error": !!actionData?.fieldErrors.password,
                            })}
                            placeholder="Password"
                        />
                    </label>
                    <ul className="list-inside list-disc text-error">
                        {actionData?.fieldErrors.password?.map((m: string, k: number) => (
                            <li key={k} title={m}>
                                {m}
                            </li>
                        ))}
                    </ul>
                    <button type="submit" className="btn btn-primary btn-block my-6" disabled={submitting}>
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

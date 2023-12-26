import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "~/secure.server";

export async function loader() {
    redirect("/");
}

export async function action({ request }: ActionFunctionArgs) {
    return logout(request);
}

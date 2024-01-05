import type { MetaFunction } from "@remix-run/node";
import { useAuthorize } from "~/secure";

export const meta: MetaFunction = () => {
    return [{ title: "Gommerce" }, { name: "description", content: "An open source e-commerce system written in go." }];
};

export default function Index() {
    const { user } = useAuthorize();
    return <h1>Welcome to Gommerce, {user?.attributes["profile.display_name"] || "Guest"}</h1>;
}

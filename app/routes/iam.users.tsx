import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [{ title: "IAM Users" }];
};

export default function Index() {
    return <></>;
}

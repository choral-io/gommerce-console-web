import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = ({ matches }) => {
    return [{ title: "IAM Roles" }];
};

export default function Index() {
    return <></>;
}

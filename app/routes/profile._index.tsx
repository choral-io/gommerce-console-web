import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = ({ matches }) => {
    return [{ title: "Profile" }];
};

export default function Index() {
    return <></>;
}

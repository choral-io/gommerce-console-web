import { User } from "@proto/iam/v1beta/users_pb";
import type { loader } from "~/root";
import { useMatchData } from "./utils/hooks";

export type Identity = {
    user: User | null;
    scope: string[];
};

export function useAuthorize(): Identity {
    const routeData = useMatchData<typeof loader>("root");
    if (routeData && routeData.user && routeData.scope) {
        return {
            user: User.fromJson(routeData.user),
            scope: routeData.scope,
        };
    } else {
        return { user: null, scope: [] };
    }
}

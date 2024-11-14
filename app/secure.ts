import { fromJson } from "@bufbuild/protobuf";
import type { User } from "@gommerce/iam/v1beta/users_pb";
import { UserSchema } from "@gommerce/iam/v1beta/users_pb";
import type { loader } from "~/root";
import { useMatchData } from "~/utils/hooks";

export interface Identity {
    user: User | null;
    token: string | null;
    scope: string[];
}

export function useAuthorize(): Identity {
    const routeData = useMatchData<typeof loader>("root");
    if (routeData && routeData.user && routeData.scope) {
        return {
            user: fromJson(UserSchema, routeData.user),
            token: routeData.token ?? null,
            scope: routeData.scope,
        };
    } else {
        return { user: null, token: null, scope: [] };
    }
}

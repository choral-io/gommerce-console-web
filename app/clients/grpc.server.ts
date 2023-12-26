import invariant from "tiny-invariant";
import { createGrpcTransport } from "@connectrpc/connect-node";
import { createPromiseClient } from "@connectrpc/connect";
import { singleton } from "~/singleton.server";
import { SnowflakeService, PasswordService, DateTimeService } from "@proto/utils/v1/utils_connect";
import { UsersService } from "@proto/iam/v1beta/users_connect";
import { TokensService } from "@proto/iam/v1beta/tokens_connect";
import { StateStoreService } from "@proto/state/v1beta/store_connect";

invariant(process.env.GOMMERCE_GRPC_ENDPOINT, "environment variable GOMMERCE_GRPC_ENDPOINT is required.");

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            GOMMERCE_GRPC_ENDPOINT: string;
        }
    }
}

export const transport = singleton("grpc_transport", () => {
    return createGrpcTransport({
        baseUrl: process.env.GOMMERCE_GRPC_ENDPOINT,
        useBinaryFormat: true,
        httpVersion: "2",
        interceptors: [],
    });
});

// utils/v1
export const snowflakeServiceClient = createPromiseClient(SnowflakeService, transport);
export const passwordServiceClient = createPromiseClient(PasswordService, transport);
export const dateTimeServiceClient = createPromiseClient(DateTimeService, transport);

// iam/v1beta
export const usersServiceClient = createPromiseClient(UsersService, transport);
export const tokensServiceClient = createPromiseClient(TokensService, transport);

// state/v1beta
export const stateStoreServiceClient = createPromiseClient(StateStoreService, transport);

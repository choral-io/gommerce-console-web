import { Code, ConnectError } from "@connectrpc/connect";
import { BadRequest } from "@proto/rpc/error_details_pb";
import { ZodError, type typeToFlattenedError } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseError<F = any>(error: ZodError<F> | ConnectError): typeToFlattenedError<F> | null {
    if (error instanceof ZodError) {
        return error.flatten<string>();
    }
    if (error instanceof ConnectError) {
        if (error.code === Code.InvalidArgument) {
            // prettier-ignore
            const fieldErrors = error.findDetails(BadRequest).at(-1)?.fieldViolations.reduce((acc, cur) => {
                acc[cur.field] = [cur.description];
                return acc;
            },
                { "": [] } as Record<string, string[]>,
            ) ?? {};
            return { formErrors: fieldErrors[""], fieldErrors };
        } else {
            return { formErrors: [error.message], fieldErrors: {} };
        }
    }
    return null;
}

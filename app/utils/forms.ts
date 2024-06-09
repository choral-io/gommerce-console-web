import { ZodError } from "zod";
import { Code, ConnectError } from "@connectrpc/connect";
import { BadRequest } from "@proto/rpc/error_details_pb";

/** @type {import("zod").typeToFlattenedError<T, string>} */
interface validateError<T> {
    formErrors: string[];
    fieldErrors: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [P in T extends any ? keyof T : never]?: string[];
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseError<F = any>(error: ZodError<F> | ConnectError): validateError<F> | null {
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
                {} as Record<string, string[]>,
            ) ?? {};
            return { formErrors: [], fieldErrors };
        } else {
            return { formErrors: [error.message], fieldErrors: {} };
        }
    }
    return null;
}

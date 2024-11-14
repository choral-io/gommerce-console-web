import { Code, ConnectError } from "@connectrpc/connect";
import { BadRequestSchema } from "@google/rpc/error_details_pb";
import { ZodError, type typeToFlattenedError } from "zod";

export function handleError<T = unknown>(error: unknown): typeToFlattenedError<T> {
    if (error instanceof ZodError) {
        return (error as ZodError<T>).flatten<string>();
    }
    if (error instanceof ConnectError) {
        if (error.code === Code.InvalidArgument) {
            // prettier-ignore
            const fieldErrors = error.findDetails(BadRequestSchema).at(-1)?.fieldViolations.reduce((acc, cur) => {
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
    throw error;
}

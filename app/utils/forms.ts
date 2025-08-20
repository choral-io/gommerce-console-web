import { Code, ConnectError } from "@connectrpc/connect";
import { BadRequestSchema } from "@google/rpc/error_details_pb";
import { ZodError } from "zod";

export interface ValidateError<T> {
    formErrors: string[];
    fieldErrors: { [K in keyof T]?: string[] };
}

export function isValidateError<T = unknown>(value: unknown): value is ValidateError<T> {
    return value !== null && typeof value === "object" && "formErrors" in value && "fieldErrors" in value;
}

export function handleError<T extends object>(error: unknown): ValidateError<T> {
    if (error instanceof ZodError) {
        return error.flatten((issue) => issue.message);
    }
    if (error instanceof ConnectError) {
        if (error.code === Code.InvalidArgument) {
            const violations = error.findDetails(BadRequestSchema).at(-1)?.fieldViolations ?? [];
            const fieldErrors = violations.reduce<Record<string, string[]>>(
                (acc, cur) => {
                    if (cur.field in acc) {
                        acc[cur.field].push(cur.description);
                    } else {
                        acc[cur.field] = [cur.description];
                    }
                    return acc;
                },
                { "": [] },
            );
            return { formErrors: fieldErrors[""], fieldErrors: fieldErrors };
        } else {
            return { formErrors: [error.message], fieldErrors: {} };
        }
    }
    if (error instanceof Error) {
        throw error;
    } else {
        throw new Error("Form submission failed", { cause: error });
    }
}

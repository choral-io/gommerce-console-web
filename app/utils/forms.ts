import { ZodError } from "zod";
import { ConnectError } from "@connectrpc/connect";
import { BadRequest } from "@proto/rpc/error_details_pb";

/** @type {import("zod").typeToFlattenedError<T, string>} */
type validateError<T> = {
    formErrors: string[];
    fieldErrors: {
        [P in T extends any ? keyof T : never]?: string[];
    };
};

export function parseError<F = any>(error: ZodError<F> | ConnectError): validateError<F> | null {
    if (error instanceof ZodError) {
        return error.flatten<string>();
    }
    if (error instanceof ConnectError) {
        const result = { formErrors: [], fieldErrors: {} } as validateError<F>;
        const br = error.findDetails(BadRequest);
        if (br && br.length > 0) {
            return br[0].fieldViolations.reduce((acc, cur) => {
                const field = cur.field as F extends any ? keyof F : never;
                if (field) {
                    acc.fieldErrors[field] ??= [];
                    acc.fieldErrors[field]?.push(cur.description);
                } else {
                    acc.formErrors.push(cur.description);
                }
                return acc;
            }, result);
        }
    }
    return null;
}

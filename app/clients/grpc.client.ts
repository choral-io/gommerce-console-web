import invariant from "tiny-invariant";
import type { MessageType, Message } from "@bufbuild/protobuf";

invariant(window.env.GOMMERCE_GRPC_ENDPOINT, "environment variable GOMMERCE_GRPC_ENDPOINT is required.");

declare global {
    interface Window {
        env: {
            [key: string]: string | undefined;
            GOMMERCE_GRPC_ENDPOINT: string;
        };
    }
}

export async function fetchUnary<I extends Message<I>, O extends Message<O>>(
    req: Message<I>,
    mt: MessageType<O>,
    sn: string,
    mn: string,
    rs: AbortSignal | null = null,
): Promise<O> {
    const resp = await fetch(`${window.env.GOMMERCE_GRPC_ENDPOINT}/${sn}/${mn}`, {
        method: "POST",
        body: req.toJsonString(),
        headers: { "Content-Type": "application/json" },
        signal: rs,
    });
    return mt.fromJsonString(await resp.text());
}

export async function* fetchStream<I extends Message<I>, O extends Message<O>>(
    req: Message<I>,
    mt: MessageType<O>,
    sn: string,
    mn: string,
    rs: AbortSignal | null = null,
): AsyncGenerator<O> {
    const resp = await fetch(`${window.env.GOMMERCE_GRPC_ENDPOINT}/${sn}/${mn}`, {
        method: "POST",
        body: req.toJsonString(),
        headers: { "Content-Type": "application/json" },
        signal: rs,
    });
    const encoder = new TextDecoder("utf-8");
    const reader = resp.body?.getReader();
    while (reader) {
        try {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            yield mt.fromJsonString(encoder.decode(value));
        } catch (err) {
            if (err instanceof DOMException && err.name === "AbortError") {
                break;
            }
            throw err;
        }
    }
}
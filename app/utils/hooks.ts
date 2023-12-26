import { type UIMatch, useMatches } from "@remix-run/react";
import { useMemo, useEffect, useLayoutEffect } from "react";

export const useEnhancedEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function useUIMatch<D = unknown, H = unknown>(id: string | number): UIMatch<D, H> | undefined {
    const matches = useMatches();
    const uiMatch = useMemo(() => {
        if (typeof id === "number") {
            return matches[id < 0 ? matches.length + id : id] as UIMatch<D, H> | undefined;
        } else {
            return matches.find((m) => m.id === id);
        }
    }, [matches, id]);
    return uiMatch as UIMatch<D, H> | undefined;
}

export function useHandleData<H = unknown>(id: string | number) {
    return useUIMatch<unknown, H>(id)?.handle;
}

export function useMatchData<D = unknown>(id: string) {
    return useUIMatch<D, unknown>(id)?.data;
}

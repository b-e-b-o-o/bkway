import { useEffect, useRef } from "react";

export function rgbToHex(r: number, g: number, b: number) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('');
}

export function hexToRgb(hex: string) {
    return hex
        .match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
        ?.slice(1)
        .map(x => parseInt(x, 16)
    ) as [number, number, number] | undefined;
}

// https://stackoverflow.com/a/53180013
export function useUpdateEffect(effect: React.EffectCallback, deps?: React.DependencyList) {
    const isMountingRef = useRef(false);

    useEffect(() => {
        isMountingRef.current = true;
    }, []);

    useEffect(() => {
        if (!isMountingRef.current) {
            return effect();
        } else {
            isMountingRef.current = false;
        }
    }, deps);
}
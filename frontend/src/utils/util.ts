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

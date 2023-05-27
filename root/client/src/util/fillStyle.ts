export function getLinearGradient(context: CanvasRenderingContext2D, color1: string, color2: string, width: number, height: number) {
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
}

export function createPattern(context: CanvasRenderingContext2D, image: HTMLImageElement) {
    const pattern = context.createPattern(image, 'repeat')
    return pattern;
}
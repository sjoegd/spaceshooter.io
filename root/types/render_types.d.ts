import { Vector, IBodyRenderOptions } from 'matter-js';

export interface GameStateRender {
    bodyRenders: BodyRender[],
    origin?: Vector
}

export interface BodyRender {
    vertices: Vector[],
    render: IBodyRenderOptions,
    position: Vector,
    angle: number
}

export interface SpriteRender {
    texture: string,
    xScale: number,
    yScale: number
    xOffset: number,
    yOffset: number
}

export interface PlayerStateRender {
    health?: number,
    shield?: number,
    ammo?: number
    score?: number
}
import { IBodyRenderOptionsSprite } from 'matter-js';

export interface StateRender {
    bodyRenders: BodyRender[],
    origin?: Vector
}

export interface BodyRender {
    vertices: Vector[],
    render: IBodyRenderOptions,
    position: Vector,
    angle: number
}

// matter-js types are bad, they didn't include these two which are necesarry
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
}
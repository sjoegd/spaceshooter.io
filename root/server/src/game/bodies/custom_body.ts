import { Body, IBodyRenderOptions, IBodyRenderOptionsSprite, Vector } from "matter-js";
import { BodyManager } from "../managers/body_manager";

export interface BodyRender {
    vertices: Vector[],
    render: IBodyRenderOptions,
    sprite?: SpriteRender,
    position: Vector,
    angle: number
}

export interface SpriteRender extends IBodyRenderOptionsSprite {
    xOffset: number,
    yOffset: number
}

export type BodyType = 'entity' | 'bullet' | 'obstacle'| 'powerup' 

export interface CustomBody<Type extends BodyType> extends Body {
    bodyType: Type
}

export function createCustomBody<Type extends BodyType>(body: Body, type: Type) {
    const customBody = <CustomBody<Type>> body
    customBody.bodyType = type
    return customBody;
}

export interface CustomBodyManager {
    manager: BodyManager
    isType: (body: CustomBody<BodyType>) => body is CustomBody<BodyType>
    manage: (body: CustomBody<BodyType>) => void
    remove: (body: CustomBody<BodyType>) => void
}




import { Vector } from "matter-js";
import { EntityProperties } from "../../entity";
import { SpriteRender } from "../../../../../../../types/render_types";
import { StandardSpacejetProperties } from "./standard-spacejet-properties";
import { BulletTypeBase } from '../../../bullet/type/bullet-type';
import { AlienSpacejetProperties } from "./alien-spacejet-properties";

export type SpacejetPropertiesBase = 'standard' | 'alien'

export interface SpacejetProperties extends EntityProperties {
    scale: number
    hitbox: Vector[][]
    baseTexture: string
    boostTexture: string
    sprite: SpriteRender

    boostMultiply: number
    boostDuration: number
    boostCooldown: number

    fireRate: number // per BASE_TICK_RATE
    reloadDuration: number 
    bulletTypeBase: BulletTypeBase

    baseAmmo: number
    maxAmmo: number
}

const baseToSpacejetProperties = {
    'standard': StandardSpacejetProperties,
    'alien': AlienSpacejetProperties
}

export function createSpacejetProperties(base: SpacejetPropertiesBase): SpacejetProperties {
    const properties = new baseToSpacejetProperties[base]()
    return properties;
}
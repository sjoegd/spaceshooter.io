import { Vector } from 'matter-js';

import { SpriteRender } from '../../../../../../../types/render_types';
import { BulletTypeBase } from '../../../bullet/type/bullet-type';
import { EntityProperties } from '../../entity';
import { AlienSpacejetProperties } from './alien-spacejet-properties';
import { SpecialAlienSpacejetProperties } from './special-spacejet-properties';
import { StandardSpacejetProperties } from './standard-spacejet-properties';

export type SpacejetPropertiesBase = 'standard' | 'alien' | 'special-alien'

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
    'alien': AlienSpacejetProperties,
    'special-alien': SpecialAlienSpacejetProperties
}

export function createSpacejetProperties(base: SpacejetPropertiesBase): SpacejetProperties {
    const properties = new baseToSpacejetProperties[base]()
    return properties;
}

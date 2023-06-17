import { Vector } from 'matter-js';

import { SpriteRender } from '../../../../../../types/render_types';
import { StandardBulletType } from './standard-bullet-type';

export type BulletTypeBase = 'standard'

export interface BulletType {
    scale: number
    hitbox: Vector[][]
    sprite: SpriteRender

    damage: number
    baseSpeed: number
    minSpeed: number
    frictionAir: number
}

const baseToBulletType = {
    'standard': StandardBulletType
}

export function createBulletType(base: BulletTypeBase): BulletType {
    const bulletType = new baseToBulletType[base]()
    return bulletType;
}
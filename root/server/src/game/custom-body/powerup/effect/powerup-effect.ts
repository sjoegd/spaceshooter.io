import { Vector } from 'matter-js';

import { SpriteRender } from '../../../../../../types/render_types';
import { Entity } from '../../entity/entity';
import { HealEffect } from './heal-effect';
import { ShieldEffect } from './shield-effect';
import { SpeedEffect } from './speed-effect';

export type PowerupEffectBase = 'heal' | 'shield' | 'speed'

export interface PowerupEffect {
    hitbox: Vector[][]
    sprite: SpriteRender
    spawnRate: number
    duration: number
    applyEffect: (entity: Entity) => void
    removeEffect: (entity: Entity) => void
}

const baseToPowerupEffect = {
    heal: HealEffect,
    shield: ShieldEffect,
    speed: SpeedEffect
}

export function createPowerupEffect(base: PowerupEffectBase) {
    const effect = new baseToPowerupEffect[base]()
    return effect;
}
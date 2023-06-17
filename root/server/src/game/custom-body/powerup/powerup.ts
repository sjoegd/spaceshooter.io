import { Bodies, Vector } from 'matter-js';

import { SpriteRender } from '../../../../../types/render_types';
import { PowerupManager } from '../../manager/body-manager/powerup/powerup-manager';
import { createCustomBody, CustomBody } from '../custom-body';
import { Entity } from '../entity/entity';
import { createPowerupEffect, PowerupEffect, PowerupEffectBase } from './effect/powerup-effect';

export interface Powerup extends CustomBody {
    bodyType: 'powerup'
    manager: PowerupManager
    effect: PowerupEffect
}

export function isPowerup(body: CustomBody): body is Powerup {
    return body.bodyType == 'powerup'
}

export interface PowerupOptions {
    effectBase: PowerupEffectBase
}

export function createPowerup(x: number, y: number, manager: PowerupManager, options: PowerupOptions): Powerup {

    const { effectBase } = options;

    const effect = createPowerupEffect(effectBase)

    const body = Bodies.fromVertices(x, y, effect.hitbox, {
        isSensor: true,
        torque: 0,
        inertia: Infinity,
        density: 0.01,
        render: {
            sprite: effect.sprite
        }
    })

    const powerup = <Powerup> createCustomBody(body, 'powerup', manager, 1)
    powerup.effect = effect;

    return powerup
}
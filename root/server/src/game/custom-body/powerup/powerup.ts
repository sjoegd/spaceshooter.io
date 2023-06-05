import { Bodies, Vector } from "matter-js";
import { PowerupManager } from "../../manager/body-manager/powerup/powerup-manager";
import { CustomBody, createCustomBody } from "../custom-body";
import { SpriteRender } from '../../../../../types/render_types';
import { Entity } from "../entity/entity";

export interface Powerup extends CustomBody {
    bodyType: 'powerup'
    manager: PowerupManager
    effect: PowerupEffect
}

export interface PowerupEffect {
    hitbox: Vector[][]
    sprite: SpriteRender
    spawnRate: number
    duration: number
    applyEffect: (entity: Entity) => void
    removeEffect: (entity: Entity) => void
}

export function isPowerup(body: CustomBody): body is Powerup {
    return body.bodyType == 'powerup'
}

export interface PowerupOptions {
    manager: PowerupManager
    effect: PowerupEffect
}

export function createPowerup(x: number, y: number, options: PowerupOptions): Powerup {

    const { manager, effect } = options;

    const body = Bodies.fromVertices(x, y, effect.hitbox, {
        torque: 0,
        inertia: Infinity,
        density: 0.01,
        render: {
            sprite: effect.sprite
        }
    })

    const powerup = <Powerup> createCustomBody(body, 'powerup', manager)
    powerup.effect = effect;

    return powerup
}
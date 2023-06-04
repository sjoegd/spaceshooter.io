import { Bodies, Vector } from "matter-js";
import { PowerupManager } from "../../manager/body_manager/powerup/powerup_manager";
import { CustomBody, createCustomBody } from "../body";
import { Entity } from "../entity/entity";
import { SpriteRender } from "../../../../../types/render_types";

export interface Powerup extends CustomBody<'powerup'> {
    effect: PowerupEffect
}

export interface PowerupEffect {
    durationTicks: number
    durationTime: number
    size: number
    spawnRate: number
    hitbox: Vector[][]
    sprite: SpriteRender
    applyEffect: (entity: Entity) => void
    removeEffect: (entity: Entity) => void
}

export function isPowerup(body: CustomBody<String>): body is Powerup {
    return body.bodyType == 'powerup'
}

export function createPowerup(x: number, y: number, effect: PowerupEffect, manager: PowerupManager): Powerup {
    
    const body = Bodies.fromVertices(x, y, effect.hitbox, {
        torque: 0,
        inertia: Infinity,
        density: 0.05,
        render: {
            sprite: effect.sprite
        }
    })

    const powerup = <Powerup> createCustomBody(body, 'powerup', manager)
    powerup.effect = effect;

    return powerup;
}
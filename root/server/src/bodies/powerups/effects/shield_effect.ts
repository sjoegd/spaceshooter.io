import { Vector } from "matter-js";
import { SpriteRender } from "../../../game_engine";
import { Spacejet } from "../../spacejet";
import { POWERUP_SIZE, createEffect } from "../powerup";

export function createShieldEffect() {
    const shield = 50;
    const duration = 0;
    const spawnRate = 0.025;

    const hitbox: Vector[][] = [[
        {x: 0, y: 0},
        {x: POWERUP_SIZE, y: 0},
        {x: POWERUP_SIZE, y: POWERUP_SIZE},
        {x: 0, y: POWERUP_SIZE}
    ]]

    const sprite: SpriteRender = {
         texture: 'effect/shield.png',
         xScale: POWERUP_SIZE/75,
         yScale: POWERUP_SIZE/75,
         xOffset: 0,
         yOffset: 0
    }

    const applyEffect = (spacejet: Spacejet) => {
        spacejet.shield = Math.min(spacejet.MAX_SHIELD, spacejet.shield + shield)
    }

    const removeEffect = () => null

    const effect = createEffect(duration, spawnRate, applyEffect, removeEffect, hitbox, sprite)
    return effect;
}
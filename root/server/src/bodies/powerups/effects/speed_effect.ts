import { Vector } from "matter-js";
import { SpriteRender } from "../../../game_engine";
import { Spacejet } from "../../spacejet";
import { POWERUP_SIZE, createEffect } from "../powerup";

export function createSpeedEffect() {
    const speedMultiplier = 1.25;
    const duration = 5000;
    const spawnRate = 0.05;

    const hitbox: Vector[][] = [[
        {x: 0, y: 0},
        {x: POWERUP_SIZE, y: 0},
        {x: POWERUP_SIZE, y: POWERUP_SIZE},
        {x: 0, y: POWERUP_SIZE}
    ]]

    const sprite: SpriteRender = {
        texture: 'effect/speed.png',
        xScale: POWERUP_SIZE/75,
        yScale: POWERUP_SIZE/75,
        xOffset: 0,
        yOffset: 0
    }

    const applyEffect = (spacejet: Spacejet) => {
        spacejet.MAX_SPEED *= speedMultiplier
        spacejet.MOVEMENT_INCREMENT *= speedMultiplier
    }

    const removeEffect = (spacejet: Spacejet) => {
        spacejet.MAX_SPEED *= 1/speedMultiplier
        spacejet.MOVEMENT_INCREMENT *= 1/speedMultiplier
    }

    const effect = createEffect(duration, spawnRate, applyEffect, removeEffect, hitbox, sprite)
    return effect;
}
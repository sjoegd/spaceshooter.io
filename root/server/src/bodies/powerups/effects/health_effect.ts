import { Vector } from "matter-js";
import { SpriteRender } from "../../../game_engine";
import { Spacejet } from "../../spacejet";
import { POWERUP_SIZE, createEffect } from "../powerup";

export function createHealthEffect() {
    const health = 50;
    const duration = 0;    
    const spawnRate = 0.05;

    const hitbox: Vector[][] = [[
        {x: 0, y: 0},
        {x: POWERUP_SIZE, y: 0},
        {x: POWERUP_SIZE, y: POWERUP_SIZE},
        {x: 0, y: POWERUP_SIZE}
    ]]

    const sprite: SpriteRender = {
         texture: 'effect/heal.png',
         xScale: POWERUP_SIZE/75,
         yScale: POWERUP_SIZE/75,
         xOffset: 0,
         yOffset: 0
    }

    const applyEffect = (spacejet: Spacejet) => {
        const currentHealth = spacejet.health;
        if(currentHealth <= 0) return;
        const newHealth = Math.min(spacejet.BASE_HEALTH, currentHealth + health)
        spacejet.health = newHealth;
    }

    const removeEffect = () => null

    const effect = createEffect(duration, spawnRate, applyEffect, removeEffect, hitbox, sprite);
    return effect;
}
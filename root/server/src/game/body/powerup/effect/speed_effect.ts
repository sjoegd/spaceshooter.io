import { Vector } from "matter-js";
import { SpriteRender } from "../../../../../../types/render_types";
import { Entity } from "../../entity/entity";
import { PowerupEffect } from "../powerup";
import { BASE_TICK_RATE } from "../../../server_game_engine";
import { PowerupManager } from "../../../manager/body_manager/powerup/powerup_manager";


export class SpeedEffect implements PowerupEffect {
    speedMultiplier: number = 1.25;
    durationTicks: number = 5 * BASE_TICK_RATE
    durationTime: number;
    size: number = 50;
    spawnRate: number = 0.05;

    hitbox: Vector[][] = [[
        {x: 0, y: 0},
        {x: this.size, y: 0},
        {x: this.size, y: this.size},
        {x: 0, y: this.size}
    ]];

    sprite: SpriteRender = {
        texture: 'effect/speed.png',
        xScale: this.size/75,
        yScale: this.size/75,
        xOffset: 0,
        yOffset: 0
    };

    applyEffect(entity: Entity) {
        const settings = entity.entitySettings
        settings.speedIncrement *= this.speedMultiplier
        settings.maxSpeed *= this.speedMultiplier
    }

    removeEffect(entity: Entity) {
        const settings = entity.entitySettings
        settings.speedIncrement /= this.speedMultiplier
        settings.maxSpeed /= this.speedMultiplier
    }

    constructor(powerupManager: PowerupManager) {
        this.durationTime = powerupManager.bodyManager.gameManager.calculateTimeFromTicks(this.durationTicks)
    }
}
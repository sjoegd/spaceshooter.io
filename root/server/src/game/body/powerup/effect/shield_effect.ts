import { Vector } from "matter-js";
import { SpriteRender } from "../../../../../../types/render_types";
import { Entity } from "../../entity/entity";
import { PowerupEffect } from "../powerup";
import { PowerupManager } from "../../../manager/body_manager/powerup/powerup_manager";


export class ShieldEffect implements PowerupEffect {
    shield: number = 50;
    durationTicks: number = 0;
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
        texture: 'effect/shield.png',
        xScale: this.size/75,
        yScale: this.size/75,
        xOffset: 0,
        yOffset: 0
    };

    applyEffect(entity: Entity) {
        const { maxShield } = entity.entitySettings
        entity.shield = Math.min(maxShield, entity.shield + this.shield)
    }
    removeEffect(entity: Entity) {}

    constructor(powerupManager: PowerupManager) {
        this.durationTime = powerupManager.bodyManager.gameManager.calculateTimeFromTicks(this.durationTicks)
    }

}
import { Vector } from "matter-js";
import { SpriteRender } from "../../../../../../types/render_types";
import { Entity } from "../../entity/entity";
import { PowerupEffect } from "../powerup";
import { PowerupManager } from "../../../manager/body_manager/powerup/powerup_manager";

export class HealthEffect implements PowerupEffect {

    heal: number = 50;
    durationTicks: number = 0;
    durationTime: number;
    spawnRate: number = 0.05;
    size: number = 50;

    hitbox: Vector[][] = [[
        {x: 0, y: 0},
        {x: this.size, y: 0},
        {x: this.size, y: this.size},
        {x: 0, y: this.size}
    ]]

    sprite: SpriteRender = {
        texture: 'effect/heal.png',
        xScale: this.size/75,
        yScale: this.size/75,
        xOffset: 0,
        yOffset: 0
    };
    
    applyEffect(entity: Entity) {
        const { maxHP } = entity.entitySettings
        const hp = entity.hp
        const newHP = Math.min(maxHP, hp + this.heal)
        if(hp <= 0) return;
        entity.hp = newHP
    }

    removeEffect(entity: Entity) {}

    constructor(powerupManager: PowerupManager) {
        this.durationTime = powerupManager.bodyManager.gameManager.calculateTimeFromTicks(this.durationTicks)
    }
}
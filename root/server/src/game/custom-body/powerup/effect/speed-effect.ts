import { Vector } from 'matter-js';

import { SpriteRender } from '../../../../../../types/render_types';
import { BASE_TICK_RATE } from '../../../server-game-engine';
import { Entity } from '../../entity/entity';
import { PowerupEffect } from './powerup-effect';

export class SpeedEffect implements PowerupEffect {
    speedMultiplier: number = 1.25;
    size: number = 50;

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

    spawnRate: number = 0.025;
    duration: number = 5 * BASE_TICK_RATE;

    applyEffect(entity: Entity) {
        const properties = entity.entityProperties
        properties.speedIncrease *= this.speedMultiplier
        properties.maxSpeed *= this.speedMultiplier
        properties.dampingForce *= this.speedMultiplier
    }

    removeEffect(entity: Entity) {
        const properties = entity.entityProperties
        properties.speedIncrease /= this.speedMultiplier
        properties.maxSpeed /= this.speedMultiplier
        properties.dampingForce /= this.speedMultiplier
    }
}
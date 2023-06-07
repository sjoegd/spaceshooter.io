import { Vector } from 'matter-js';
import { SpriteRender } from '../../../../../../types/render_types';
import { Entity } from '../../entity/entity';
import { PowerupEffect } from './powerup-effect';

export class HealEffect implements PowerupEffect {
    
    heal: number = 50;
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

    spawnRate: number = 0.05;
    duration: number = 0;

    applyEffect(entity: Entity) {
        const { maxHP } = entity.entityProperties;
        
        const hp = entity.hp;
        if(hp <= 0) return;

        const newHP = Math.min(maxHP, hp + this.heal)
        entity.hp = newHP
    };

    removeEffect(entity: Entity) {};  
}
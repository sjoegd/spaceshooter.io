import inBetween from '../../../../util/in-between';
import { isBullet } from '../../../custom-body/bullet/bullet';
import { CustomBody } from '../../../custom-body/custom-body';
import { Entity, isEntity } from '../../../custom-body/entity/entity';
import { PowerupEffectBase } from '../../../custom-body/powerup/effect/powerup-effect';
import { isPowerup, Powerup } from '../../../custom-body/powerup/powerup';
import { BASE_TICK_RATE } from '../../../server-game-engine';
import { BodyManager, CustomBodyManager } from '../body-manager';

export class PowerupManager implements CustomBodyManager<Powerup> {
    
    bodyManager: BodyManager;

    effects: PowerupEffectBase[] = [
        'heal',
        'shield',
        'speed'
    ]

    constructor(bodyManager: BodyManager) {
        this.bodyManager = bodyManager;
    }

    manageBody(body: CustomBody) {
        if(!this.isBodyType(body)) return;
        this.managePowerup(body)
    }

    managePowerup(_powerup: Powerup) {
        // ... 
    }
    
    onCollision(source: CustomBody, target: CustomBody) {
        if(!this.isBodyType(source)) return;
        
        if(isEntity(target)) {
            this.onEntityCollision(source, target)
            return;
        }

        if(isBullet(target)) {
            this.onEntityCollision(source, target.owner)
            return;
        }
    }

    onEntityCollision(source: Powerup, target: Entity) {
        this.bodyManager.removeCustomBody(source)
        this.applyPowerup(source, target)
        target.controller!.onEntityPowerupTaken()
    }

    applyPowerup(powerup: Powerup, entity: Entity) {
        const effect = powerup.effect
        effect.applyEffect(entity)
        setTimeout(() => {
            effect.removeEffect(entity)
        }, (1000/this.bodyManager.gameManager.gameEngine.tickRate) * effect.duration)
    }

    getRandomEffect() {
        const i = Math.round(inBetween(0, this.effects.length - 1))
        return this.effects[i]
    }
    
    isBodyType (body: CustomBody): body is Powerup {
        return isPowerup(body)
    }
}
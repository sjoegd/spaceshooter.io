import { CustomBody } from "../../../custom-body/custom-body";
import { Powerup, isPowerup } from "../../../custom-body/powerup/powerup";
import { BodyManager, CustomBodyManager } from "../body-manager";
import { PowerupEffectBase } from '../../../custom-body/powerup/effect/powerup-effect';
import inBetween from '../../../../util/in_between';
import { Entity, isEntity } from '../../../custom-body/entity/entity';
import { BASE_TICK_RATE } from '../../../server-game-engine';

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

    managePowerup(powerup: Powerup) {
        // ... 
    }

    applyPowerup(powerup: Powerup, entity: Entity) {
        const effect = powerup.effect
        effect.applyEffect(entity)
        setTimeout(() => {
            effect.removeEffect(entity)
        }, (1000/BASE_TICK_RATE) * effect.duration)
    }
    
    getRandomEffect() {
        const i = Math.round(inBetween(0, this.effects.length - 1))
        return this.effects[i]
    }

    onCollision(source: CustomBody, target: CustomBody) {
        if(!this.isBodyType(source)) return;
        
        if(isEntity(target)) {
            this.applyPowerup(source, target)
            // send takePowerup to controller?
        }
    }
    
    isBodyType (body: CustomBody): body is Powerup {
        return isPowerup(body)
    }
}
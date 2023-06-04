import { BodyManager, CustomBodyManager } from "../body_manager";
import { CustomBody } from "../../../body/body";
import { Powerup, PowerupEffect, isPowerup } from "../../../body/powerup/powerup";
import { HealthEffect } from "../../../body/powerup/effect/health_effect";
import { SpeedEffect } from "../../../body/powerup/effect/speed_effect";
import { ShieldEffect } from "../../../body/powerup/effect/shield_effect";
import inBetween from "../../../../util/in_between";
import { Entity } from "../../../body/entity/entity";

export class PowerupManager implements CustomBodyManager<'powerup'> {

    bodyManager: BodyManager;
    
    effects: PowerupEffect[] 

    constructor(bodyManager: BodyManager) {
        this.bodyManager = bodyManager;
        this.effects = [
            new HealthEffect(this),
            new SpeedEffect(this),
            new ShieldEffect(this)
        ]
    }

    manageBody(body: CustomBody<String>) {
        if(!this.isBodyType(body)) return;
        // no special management needed currently
    }

    isBodyType(body: CustomBody<String>): body is Powerup {
        return isPowerup(body)
    }

    applyPowerup(powerup: Powerup, entity: Entity) {
        const effect = powerup.effect;

        effect.applyEffect(entity)

        setTimeout(() => {
            effect.removeEffect(entity)
        }, effect.durationTime)
    }

    getRandomEffect(): PowerupEffect {
        const index = Math.round(inBetween(0, this.effects.length-1))
        return this.effects[index]
    }
}
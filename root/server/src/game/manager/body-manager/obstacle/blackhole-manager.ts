import { Body, Vector } from 'matter-js';

import { isBullet } from '../../../custom-body/bullet/bullet';
import { CustomBody } from '../../../custom-body/custom-body';
import { Entity, isEntity } from '../../../custom-body/entity/entity';
import { Asteroid, isAsteroid } from '../../../custom-body/obstacle/asteroid';
import { Blackhole, isBlackhole } from '../../../custom-body/obstacle/blackhole';
import { BodyManager, CustomBodyManager } from '../body-manager';
import { ObstacleManager } from './obstacle-manager';

export class BlackholeManager extends ObstacleManager implements CustomBodyManager<Blackhole> {

    constructor(bodyManager: BodyManager) {
        super(bodyManager)
    }

    manageBody(body: CustomBody) {
        super.manageBody(body)
        if(!this.isBodyType(body)) return;
        this.manageBlackhole(body)
    }

    manageBlackhole(blackhole: Blackhole) {

        const exceeded = this.manageLifeTimeExceedance(blackhole)
        if(exceeded) return;

        this.managePullForce(blackhole)
    }

    manageLifeTimeExceedance(blackhole: Blackhole): boolean {
        const lifeTimeExceeded = blackhole.birth + blackhole.lifeTime < this.bodyManager.gameManager.getCurrentTick()
        if(lifeTimeExceeded) {
            this.bodyManager.removeCustomBody(blackhole)
        }

        return lifeTimeExceeded
    }

    managePullForce(blackhole: Blackhole) {
        const forceRadius = blackhole.baseForceRadius * blackhole.forceRadius 

        for(const body of this.bodyManager.customBodies) {
            if(body.id == blackhole.id) continue;

            const distanceVector = Vector.sub(blackhole.position, body.position)
            const distance = Vector.magnitude(distanceVector)
            
            if(distance > forceRadius) continue;
            
            // possibly some special case for bullets
            const bodyMass = isBullet(body) ? body.mass * 0.5e2 : body.mass

            const forceMagnitude = (blackhole.forceStrength *  blackhole.baseForceStrength) * (blackhole.mass / bodyMass)
            const force = Vector.mult(distanceVector, forceMagnitude)

            Body.applyForce(body, body.position, force)
        }
    }

    onCollision(source: CustomBody, target: CustomBody) {
        super.onCollision(source, target)
        if(!this.isBodyType(source)) return;

        if(isAsteroid(target)) {
            this.onAsteroidCollision(source, target)
            return;
        }

        if(isEntity(target)) {
            this.onEntityCollision(source, target)
            return;
        }

        // else just remove
        this.bodyManager.removeCustomBody(target)
    }

    onAsteroidCollision(_source: Blackhole, target: Asteroid) {
        const damage = target.hp;
        target.manager.dealDamage(target, damage)
    }

    onEntityCollision(_source: Blackhole, target: Entity) {
        // deal hp+shield damage
        const damage = target.hp + target.shield
        target.manager.dealDamage(target, damage)
    }

    isBodyType(body: CustomBody): body is Blackhole {
        return isBlackhole(body)
    }
}

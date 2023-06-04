import { Body, Vector } from "matter-js";
import { CustomBody, CustomBodyType } from '../../../body/body';
import { Blackhole, isBlackhole } from "../../../body/obstacle/blackhole";
import { Obstacle } from "../../../body/obstacle/obstacle";
import { BodyManager } from "../body_manager";
import { CustomObstacleManager, ObstacleManager } from "./obstacle_manager";
import { Entity } from "../../../body/entity/entity";
import { Asteroid } from "../../../body/obstacle/asteroid";
import { isBullet } from "../../../body/bullet/bullet";


export class BlackholeManager implements CustomObstacleManager<Blackhole> {

    bodyManager: BodyManager;
    obstacleManager: ObstacleManager;

    constructor(obstacleManager: ObstacleManager) {
        this.obstacleManager = obstacleManager;
        this.bodyManager = obstacleManager.bodyManager;
    }

    manageObstacle(blackhole: Blackhole) {

        // remove if lifeTime exceeded
        if(blackhole.creationTime + blackhole.lifeTime < performance.now()) {
            this.bodyManager.removeBody(blackhole)
            return;
        }

        // apply force to bodies in range
        const size = blackhole.size * blackhole.baseSize
        const forceRadius = size * blackhole.forceRadius * blackhole.baseForceRadius;

        for(const body of this.bodyManager.bodies) {
            const dVec = Vector.sub(blackhole.position, body.position)
            const distance = Math.sqrt(Vector.magnitudeSquared(dVec))

            if(distance > forceRadius) continue;

            // ensure good force for bullets
            const bodyMass = isBullet(body) ? body.mass * (1/body.density) * 100 : body.mass

            const forceMagnitude = (blackhole.forceStrength * blackhole.baseForceStrength) * (blackhole.mass/bodyMass)
            Body.applyForce(body, body.position, Vector.mult(dVec, forceMagnitude))
        }
    }

    manageBody(body: CustomBody<String>) {
        if(!this.isBodyType(body)) return;
        this.obstacleManager.manageBody(body)
        if(!this.isObstacleType(body)) return;
        this.manageObstacle(body)
    }

    onEntityCollision(_source: Blackhole, target: Entity) {
        const damage = target.shield + target.hp
        this.bodyManager.entityManager.dealDamage(target, damage);
    }

    onAsteroidCollision(_source: Blackhole, target: Asteroid) {
        const damage = Infinity
        this.bodyManager.obstacleManager.asteroidManager.dealDamage(target, damage)
    }

    onCollision(_source: Blackhole, target: CustomBody<CustomBodyType>) {
        this.bodyManager.removeBody(target)
    }

    isObstacleType(obstacle: Obstacle): obstacle is Blackhole {
        return isBlackhole(obstacle)
    }

    isBodyType(body: CustomBody<String>): body is Obstacle {
        return this.obstacleManager.isBodyType(body)
    }
}
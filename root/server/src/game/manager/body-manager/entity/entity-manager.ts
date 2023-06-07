import { CustomBody } from "../../../custom-body/custom-body";
import { Entity, isEntity } from "../../../custom-body/entity/entity";
import { BodyManager, CustomBodyManager } from "../body-manager";
import { SpacejetManager } from "./spacejet-manager";
import { Vector, Body } from 'matter-js';
import { isAsteroid } from '../../../custom-body/obstacle/asteroid';

export class EntityManager implements CustomBodyManager<Entity> {
    
    bodyManager: BodyManager;

    constructor(bodyManager: BodyManager) {
        this.bodyManager = bodyManager;
    }

    manageBody(body: CustomBody) {
        if(!this.isBodyType(body)) return;
        this.manageEntity(body)
    }

    manageEntity(entity: Entity) {
        this.manageEntity(entity)
    }

    manageMovement(entity: Entity) {
        const { maxSpeed, speedIncrease, angleIncrease, dampingForce } = entity.entityProperties
        const { forward, backward, left, right } = entity.entityState

        const angle = entity.angle;
        const velocity = entity.velocity;

        // damp if speed over max speed

        const speed = entity.speed;
        if(speed > maxSpeed) {
            const force = Vector.mult(Vector.neg(velocity), dampingForce)
            Body.applyForce(entity, entity.position, force)
        }

        // change velocity based on state

        if(forward && !backward) {
            Body.setVelocity(entity, {
                x: velocity.x + Math.cos(angle) * speedIncrease,
                y: velocity.y + Math.sin(angle) * speedIncrease
            })
        }

        if(backward && !forward) {
            Body.setVelocity(entity, {
                x: velocity.x - Math.cos(angle) * (speedIncrease/2),
                y: velocity.y - Math.sin(angle) * (speedIncrease/2)
            })
        }

        if(left && !right) {
            Body.setAngle(entity, angle - angleIncrease)
        }

        if(right && !left) {
            Body.setAngle(entity, angle + angleIncrease)
        }
    }

    onCollision(source: CustomBody, target: CustomBody) {
        if(!this.isBodyType(source)) return;

        if(isAsteroid(target)) {
            // deal crash damage
        }

        if(isEntity(target)) {
            // deal crash damage
        }
    }

    isBodyType (body: CustomBody): body is Entity {
        return isEntity(body)
    }
}

export interface EntityManagers {
    
    spacejetManager: SpacejetManager

}
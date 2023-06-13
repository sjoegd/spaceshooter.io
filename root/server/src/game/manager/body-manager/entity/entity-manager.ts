import { CustomBody } from "../../../custom-body/custom-body";
import { Entity, isEntity } from "../../../custom-body/entity/entity";
import { BodyManager, CustomBodyManager } from "../body-manager";
import { SpacejetManager } from "./spacejet-manager";
import { Vector, Body } from 'matter-js';
import { Asteroid, isAsteroid } from '../../../custom-body/obstacle/asteroid';

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
        this.manageMovement(entity)
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
            this.onAsteroidCollision(source ,target)
            return;
        }

        if(isEntity(target)) {
            this.onEntityCollision(source ,target)
            return;
        }
    }

    onAsteroidCollision(source: Entity, target: Asteroid) {
        // deal crash damage
        const damage = this.bodyManager.calculateCrashDamage(source, target)
        target.manager.dealDamage(target, damage)
    }

    onEntityCollision(source: Entity, target: Entity) {
        // deal crash damage
        const damage = this.bodyManager.calculateCrashDamage(source, target)
        target.manager.dealDamage(target, damage)
        source.controller!.onEntityDamageDealt(damage);
    }

    dealDamage(target: Entity, damage: number) {

        target.controller!.onEntityDamageTaken(damage)

        // handle shield
        if(target.shield > 0) {
            const left = target.shield - damage;

            if(left >= 0) {
                target.shield = left
                damage = 0;
            } else {
                target.shield = 0;
                damage = -left;
            }
        }

        // deal leftover damage to hp
        target.hp -= damage;

        // handle death
        if(target.hp <= 0) {
            target.controller!.onEntityDeath()
            this.bodyManager.removeCustomBody(target)
            return true;
        }

        return false
    }

    isBodyType (body: CustomBody): body is Entity {
        return isEntity(body)
    }
}

export interface EntityManagers {
    
    spacejetManager: SpacejetManager

}
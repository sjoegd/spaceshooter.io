import { Body, Vector } from "matter-js";
import { CustomBody } from "../../../body/body";
import { Entity, createEntity, isEntity } from "../../../body/entity/entity";
import { BodyManager, CustomBodyManager } from '../body_manager';
import { SpacejetManager } from "./spacejet_manager";
import { Asteroid } from "../../../body/obstacle/asteroid";
import { Powerup } from "../../../body/powerup/powerup";

export class EntityManager implements CustomBodyManager<'entity'> {

    bodyManager: BodyManager;

    spacejetManager: SpacejetManager;

    constructor(bodyManager: BodyManager) {
        this.bodyManager = bodyManager;
        this.spacejetManager = new SpacejetManager(this)
    }

    manageBody(body: CustomBody<String>) {
        if(!this.isBodyType(body)) return;
        this.handleMovement(body)
    }

    handleMovement(entity: Entity) {
        const { maxSpeed, speedIncrement, angleIncrement, dampingForce } = entity.entitySettings
        const { forward, backward, left, right } = entity.entityState

        const angle = entity.angle;
        const velocity = entity.velocity;

        // damp

        const speed = entity.speed;
        if(speed > maxSpeed) {
            const force = Vector.mult(Vector.neg(velocity), dampingForce)
            Body.applyForce(entity, entity.position, force)
        }

        // update velocity/angle

        if(forward && !backward) {
            Body.setVelocity(entity, {
                x: velocity.x + Math.cos(angle) * speedIncrement,
                y: velocity.y + Math.sin(angle) * speedIncrement
            })
        }

        if(backward && !forward) {
            Body.setVelocity(entity, {
                x: velocity.x - Math.cos(angle) * (speedIncrement/2),
                y: velocity.y - Math.sin(angle) * (speedIncrement/2)
            })
        }

        if(left && !right) {
            Body.setAngle(entity, angle - angleIncrement)
        }

        if(right && !left) {
            Body.setAngle(entity, angle + angleIncrement)
        }
    }

    onAsteroidCollision(source: Entity, target: Asteroid) {
        // deal damage based on speed difference and mass
        const damage = this.bodyManager.calculateCrashDamage(source, target)
        this.bodyManager.obstacleManager.asteroidManager.dealDamage(target, damage)
    }

    onEntityCollision(source: Entity, target: Entity) {
        // deal damage based on speed difference and mass
        const damage = this.bodyManager.calculateCrashDamage(source, target)
        this.dealDamage(target, damage)
    }

    onPowerupCollision(source: Entity, target: Powerup) {
        this.bodyManager.powerupManager.applyPowerup(target, source)
        this.bodyManager.removeBody(target)

        source.controller?.onPowerupTaken()
    }

    // returns whether it killed
    dealDamage(entity: Entity, damage: number): boolean {
        entity.controller!.onDamageTaken(damage)

        // first apply to shield
        if(entity.shield > 0) {
            const leftover = entity.shield - damage;

            if(leftover > 0) {
                entity.shield = leftover
                damage = 0;
            } else {
                entity.shield = 0;
                damage = -leftover
            }
        }

        // apply rest to hp
        entity.hp -= damage;

        if(entity.hp <= 0) {
            this.bodyManager.removeBody(entity)
            entity.controller!.onEntityDeath()
            return true;
        }

        return false
    }

    isBodyType(body: CustomBody<String>): body is Entity {
        return isEntity(body)
    }
}

export interface CustomEntityManager<CustomEntity extends Entity> extends CustomBodyManager<'entity'> {
    entityManager: EntityManager
    manageEntity(entity: CustomEntity): void
    isEntityType(entity: Entity): entity is CustomEntity
}

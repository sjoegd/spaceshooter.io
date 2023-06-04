import { CustomBody } from "../../../body/body";
import { Entity } from "../../../body/entity/entity";
import { Spacejet, isSpacejet } from "../../../body/entity/spacejet/spacejet";
import { BodyManager } from "../body_manager";
import { CustomEntityManager, EntityManager } from "./entity_manager";

export class SpacejetManager implements CustomEntityManager<Spacejet> {
    
    entityManager: EntityManager;
    bodyManager: BodyManager;

    constructor(entityManager: EntityManager) {
        this.entityManager = entityManager;
        this.bodyManager = entityManager.bodyManager;
    }

    manageEntity(spacejet: Spacejet) {
        this.handleBoost(spacejet)
        this.handleShooting(spacejet)
    }

    handleBoost(spacejet: Spacejet) {

        const settings = spacejet.entitySettings
        const state = spacejet.entityState;
        const { baseTexture, boostTexture, boostCooldownTime: boostCooldown, boostDurationTime: boostDuration, boostMultiply } = settings
        const { boost, isBoosting, boostStart, lastBoostEnd} = state

        startBoost: if(boost && !isBoosting) {
            const startBoost = performance.now() - lastBoostEnd > boostCooldown
            if(!startBoost) break startBoost;

            state.isBoosting = true;
            state.boostStart = performance.now()
            settings.speedIncrement *= boostMultiply
            settings.maxSpeed *= boostMultiply
            if(!spacejet.render.sprite) return;
            spacejet.render.sprite.texture = boostTexture
        }

        endBoost: if(isBoosting) {
            const endBoost = performance.now() - boostStart > boostDuration
            if(!endBoost) break endBoost;

            state.isBoosting = false;
            state.lastBoostEnd = performance.now()
            settings.speedIncrement /= boostMultiply
            settings.maxSpeed /= boostMultiply
            if(!spacejet.render.sprite) return;
            spacejet.render.sprite.texture = baseTexture
        }
    }

    handleShooting(spacejet: Spacejet) {
        
        const settings = spacejet.entitySettings
        const state = spacejet.entityState;
        const { scale, maxAmmo, bulletType, fireRateTime: fireRateTime, reloadTime } = settings
        const { shoot, lastTimeShot, isReloading } = state

        const allowedToFire = performance.now() - (fireRateTime) > lastTimeShot
        if(!shoot || !allowedToFire || isReloading || spacejet.ammo == 0) return;

        const velocity = spacejet.velocity;
        const angle = spacejet.angle;
        const position = {
            x: spacejet.position.x + Math.cos(angle) * (375 * scale),
            y: spacejet.position.y + Math.sin(angle) * (375 * scale)
        }

        this.bodyManager.factory.createBullet(position.x, position.y, {
            angle,
            bulletType,
            velocity,
            owner: spacejet
        })
        
        state.lastTimeShot = performance.now()
        spacejet.ammo--;

        if(spacejet.ammo == 0) {
            state.isReloading = true;
            setTimeout(() => {
                state.isReloading = false;
                spacejet.ammo = maxAmmo;
            }, reloadTime)
        }
    }
    
    isEntityType(entity: Entity): entity is Spacejet {
        return isSpacejet(entity)
    }

    manageBody(body: CustomBody<String>) {
        if(!this.isBodyType(body)) return;
        this.entityManager.manageBody(body)
        if(!this.isEntityType(body)) return;
        this.manageEntity(body)
    }

    isBodyType(body: CustomBody<String>): body is Entity {
        return this.entityManager.isBodyType(body)
    }
}
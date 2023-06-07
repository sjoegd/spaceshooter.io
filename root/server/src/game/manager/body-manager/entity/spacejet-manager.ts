import { CustomBody } from "../../../custom-body/custom-body";
import { Entity } from "../../../custom-body/entity/entity";
import { Spacejet, isSpacejet } from "../../../custom-body/entity/spacejet/spacejet";
import { BodyManager, CustomBodyManager } from "../body-manager";
import { EntityManager } from "./entity-manager";
import { BASE_TICK_RATE } from '../../../server-game-engine';

export class SpacejetManager extends EntityManager implements CustomBodyManager<Spacejet> {

    constructor(bodyManager: BodyManager) {
        super(bodyManager)
    }

    manageBody(body: CustomBody) {
        super.manageBody(body)
        if(!this.isBodyType(body)) return;
        this.manageSpacejet(body)
    }

    manageSpacejet(spacejet: Spacejet) {
        this.manageBoost(spacejet)
        this.manageShooting(spacejet)
    }

    manageBoost(spacejet: Spacejet) {

        const properties = spacejet.entityProperties
        const state = spacejet.entityState

        const { boostCooldown, boostDuration, boostMultiply, boostTexture, baseTexture } = properties
        const { boost, boostStart, lastBoostEnd, isBoosting } = state

        startBoost: if(boost && !isBoosting) {
            const startBoost = this.bodyManager.gameManager.getCurrentTick() - lastBoostEnd > boostCooldown
            if(!startBoost) break startBoost;

            state.isBoosting = true;
            state.boostStart = this.bodyManager.gameManager.getCurrentTick()

            properties.speedIncrease *= boostMultiply
            properties.maxSpeed *= boostMultiply

            if(!spacejet.render.sprite) break startBoost;
            spacejet.render.sprite.texture = boostTexture
        }

        endBoost: if(isBoosting) {
            const endBoost = this.bodyManager.gameManager.getCurrentTick() - boostStart > boostDuration
            if(!endBoost && boost) break endBoost;

            state.isBoosting = false;
            state.lastBoostEnd = this.bodyManager.gameManager.getCurrentTick()

            properties.speedIncrease /= boostMultiply
            properties.maxSpeed /= boostMultiply

            if(!spacejet.render.sprite) break endBoost;
            spacejet.render.sprite.texture = baseTexture
        }
    }   

    manageShooting(spacejet: Spacejet) {

        const properties = spacejet.entityProperties
        const state = spacejet.entityState

        const { scale, fireRate, bulletTypeBase, maxAmmo, reloadDuration } = properties
        const { shoot, lastTimeShot, isReloading } = state

        const allowedToFire = this.bodyManager.gameManager.getCurrentTick() - (BASE_TICK_RATE/fireRate) > lastTimeShot
        if(!shoot || !allowedToFire || isReloading || spacejet.ammo == 0) return;

        const position = spacejet.position;
        const velocity = spacejet.velocity;
        const angle = spacejet.angle;

        const bulletPosition = {
            x: position.x + Math.cos(angle) * (375 * scale),
            y: position.y + Math.sin(angle) * (375 * scale)
        }

        this.bodyManager.factory.createBullet(bulletPosition.x, bulletPosition.y, {
            bulletTypeBase,
            owner: spacejet,
            angle,
            velocity
        })

        state.lastTimeShot = this.bodyManager.gameManager.getCurrentTick()
        spacejet.ammo--;

        if(spacejet.ammo <= 0) {
            state.isReloading = true;
            setTimeout(() => {
                state.isReloading = false;
                spacejet.ammo = maxAmmo;
            }, reloadDuration)
        }
    }

    onCollision(source: CustomBody, target: CustomBody): void {
        super.onCollision(source, target);
        if(!this.isBodyType(source)) return;
        // ...
    }

    isBodyType(body: CustomBody): body is Spacejet {
        return isSpacejet(body)
    }
}
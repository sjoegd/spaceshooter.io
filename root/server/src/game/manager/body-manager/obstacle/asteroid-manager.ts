import { CustomBody } from "../../../custom-body/custom-body";
import { Asteroid, isAsteroid } from "../../../custom-body/obstacle/asteroid";
import { BodyManager, CustomBodyManager } from "../body-manager";
import { ObstacleManager } from "./obstacle-manager";
import { Entity, isEntity } from '../../../custom-body/entity/entity';

export class AsteroidManager extends ObstacleManager implements CustomBodyManager<Asteroid> {

    constructor(bodyManager: BodyManager) {
        super(bodyManager)
    }

    manageBody(body: CustomBody) {
        super.manageBody(body)
        if(!this.isBodyType(body)) return;
        this.manageAsteroid(body)
    }

    manageAsteroid(_asteroid: Asteroid) {
        // ...
    }

    onCollision(source: CustomBody, target: CustomBody) {
        super.onCollision(source, target)
        if(!this.isBodyType(source)) return;
        
        if(isEntity(target)) {
            this.onEntityCollision(source, target)
            return;
        }
    }

    onEntityCollision(source: Asteroid, target: Entity) {
        // deal crash damage
        const damage = this.bodyManager.calculateCrashDamage(source ,target)
        target.manager.dealDamage(target, damage)
    } 

    dealDamage(target: Asteroid, damage: number): boolean {
        target.hp -= damage;

        if(target.hp <= 0) {
            this.bodyManager.removeCustomBody(target)
            return true
        }

        return false;
    }

    isBodyType (body: CustomBody): body is Asteroid {
        return isAsteroid(body)
    }

}

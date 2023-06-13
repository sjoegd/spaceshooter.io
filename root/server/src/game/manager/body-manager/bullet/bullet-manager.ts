import { Bullet } from "../../../custom-body/bullet/bullet";
import { CustomBody } from "../../../custom-body/custom-body";
import { BodyManager, CustomBodyManager } from "../body-manager";
import { Asteroid, isAsteroid } from '../../../custom-body/obstacle/asteroid';
import { Entity, isEntity } from '../../../custom-body/entity/entity';
import { isSpacejet } from "../../../custom-body/entity/spacejet/spacejet";

export class BulletManager implements CustomBodyManager<Bullet> {
    
    bodyManager: BodyManager;

    constructor(bodyManager: BodyManager) {
        this.bodyManager = bodyManager;
    }

    manageBody(body: CustomBody) {
        if(!this.isBodyType(body)) return;
        this.manageBullet(body)
    }

    manageBullet(bullet: Bullet) {
        const speed = bullet.speed

        // Remove if speed below min speed
        if(speed < bullet.bulletType.minSpeed) {
            this.bodyManager.removeCustomBody(bullet)
        }
    }

    onCollision(source: CustomBody, target: CustomBody) {
        if(!this.isBodyType(source)) return;

        if(isAsteroid(target)) {
            this.onAsteroidCollision(source, target)
        }

        if(isEntity(target)) {
            this.onEntityCollision(source, target)
        }

        this.bodyManager.removeCustomBody(source)
    }

    onAsteroidCollision(source: Bullet, target: Asteroid) {
        const damage = source.bulletType.damage;
        const killed = target.manager.dealDamage(target, damage)

        if(killed) {
            source.owner.controller!.onEntityAsteroidDestroyed(target.mass)
        }
    }

    onEntityCollision(source: Bullet, target: Entity) {
        const damage = source.bulletType.damage;
        const killed = target.manager.dealDamage(target, damage)
        source.owner.controller!.onEntityDamageDealt(damage);

        if(killed && isSpacejet(target)) {
            source.owner.enemyKills++;
            source.owner.controller!.onEntityEnemyKill()
        }
    }

    isBodyType (body: CustomBody): body is Bullet {
        return body.bodyType == 'bullet'
    }
}
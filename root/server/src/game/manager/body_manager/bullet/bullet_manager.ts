import { CustomBody } from "../../../body/body";
import { Bullet, isBullet } from "../../../body/bullet/bullet";
import { Entity } from "../../../body/entity/entity";
import { isSpacejet } from "../../../body/entity/spacejet/spacejet";
import { Asteroid } from "../../../body/obstacle/asteroid";
import { BodyManager, CustomBodyManager } from "../body_manager";

export class BulletManager implements CustomBodyManager<'bullet'> {

    bodyManager: BodyManager;

    constructor(bodyManager: BodyManager) {
        this.bodyManager = bodyManager;
    }

    manageBody(body: CustomBody<String>) {
        if(!this.isBodyType(body)) return;

        const speed = body.speed

        if(speed < body.bulletType.minSpeed) {
            this.bodyManager.removeBody(body)
        }
    }

    onAsteroidCollision(source: Bullet, target: Asteroid) {
        const damage = source.bulletType.damage;
        const killed = this.bodyManager.obstacleManager.asteroidManager.dealDamage(target, damage)

        if(killed) {
            source.owner.controller!.onAsteroidDestroyed(target.mass)
            console.log(`Spacejet: ${source.owner.id} killed an asteroid`)
        }
    }

    onEntityCollision(source: Bullet, target: Entity) {
        const damage = source.bulletType.damage;
        const killed = this.bodyManager.entityManager.dealDamage(target, damage)

        if(killed) {
            if(isSpacejet(target)) { 
                source.owner.enemyKills++ 
                source.owner.controller!.onEnemyKill()
            }
            console.log(`Spacejet: ${source.owner.id} killed: ${target.id}`)
        }
    }

    onCollision(source: Bullet) {
        this.bodyManager.removeBody(source)
    }

    isBodyType(body: CustomBody<String>): body is Bullet {
        return isBullet(body)
    }
}
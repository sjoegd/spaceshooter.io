import { Bullet } from "../../../custom-body/bullet/bullet";
import { CustomBody } from "../../../custom-body/custom-body";
import { BodyManager, CustomBodyManager } from "../body-manager";
import { isAsteroid } from '../../../custom-body/obstacle/asteroid';
import { isEntity } from '../../../custom-body/entity/entity';

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
            // deal damage
        }

        if(isEntity(target)) {
            // deal damage
        }

        this.bodyManager.removeCustomBody(source)
    }

    isBodyType (body: CustomBody): body is Bullet {
        return body.bodyType == 'bullet'
    }
}
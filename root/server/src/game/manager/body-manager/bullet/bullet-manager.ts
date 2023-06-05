import { Bullet } from "../../../custom-body/bullet/bullet";
import { CustomBody } from "../../../custom-body/custom-body";
import { BodyManager, CustomBodyManager } from "../body-manager";

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

    }

    isBodyType (body: CustomBody): body is Bullet {
        return body.bodyType == 'bullet'
    }
}
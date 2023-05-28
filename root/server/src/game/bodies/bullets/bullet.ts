import { BodyManager } from "../../managers/body_manager";
import { CustomBody, CustomBodyManager, BodyType } from '../custom_body';

export interface Bullet extends CustomBody<'bullet'> {
    bulletType: BulletType
}

export interface BulletType {
    damage: number
    baseSpeed: number
    minSpeed: number
    airFriction: number
}

export function createBullet() {
    
}

export class BulletManager implements CustomBodyManager {
    
    manager: BodyManager

    constructor(manager: BodyManager) {
        this.manager = manager;
    }

    isType(body: CustomBody<BodyType>): body is Bullet {
        return body.bodyType == 'bullet'
    }

    manage(body: CustomBody<BodyType>) {
        const bullet = <Bullet> body
    }

    remove(body: CustomBody<BodyType>) {
        this.manager.removeBody(body)
    }
}
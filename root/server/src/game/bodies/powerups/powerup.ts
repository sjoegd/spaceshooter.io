import { BodyManager } from "../../managers/body_manager";
import { CustomBody, CustomBodyManager, BodyType } from "../custom_body";

export interface Powerup extends CustomBody<'powerup'> {
    effect: PowerupEffect
}

export interface PowerupEffect {

}

export function createPowerup() {

}

export class PowerupManager implements CustomBodyManager {
    
    manager: BodyManager

    constructor(manager: BodyManager) {
        this.manager = manager;
    }

    isType(body: CustomBody<BodyType>): body is Powerup {
        return body.bodyType == 'powerup'
    }

    manage(body: CustomBody<BodyType>) {
        const powerup = <Powerup> body
    }

    remove(body: CustomBody<BodyType>) {
        this.manager.removeBody(body)
    }
}


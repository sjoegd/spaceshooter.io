import { CustomBody } from "../../../custom-body/custom-body";
import { Powerup, isPowerup } from "../../../custom-body/powerup/powerup";
import { BodyManager, CustomBodyManager } from "../body-manager";

export class PowerupManager implements CustomBodyManager<Powerup> {
    
    bodyManager: BodyManager;

    constructor(bodyManager: BodyManager) {
        this.bodyManager = bodyManager;
    }

    manageBody(body: CustomBody) {
        if(!this.isBodyType(body)) return;
        this.managePowerup(body)
    }

    managePowerup(powerup: Powerup) {

    }

    isBodyType (body: CustomBody): body is Powerup {
        return isPowerup(body)
    }
}
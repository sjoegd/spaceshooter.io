import { CustomBody } from "../../../custom-body/custom-body";
import { Asteroid, isAsteroid } from "../../../custom-body/obstacle/asteroid";
import { BodyManager, CustomBodyManager } from "../body-manager";
import { ObstacleManager } from "./obstacle-manager";

export class AsteroidManager extends ObstacleManager implements CustomBodyManager<Asteroid> {

    constructor(bodyManager: BodyManager) {
        super(bodyManager)
    }

    manageBody(body: CustomBody) {
        super.manageBody(body)
        if(!this.isBodyType(body)) return;
        this.manageAsteroid(body)
    }

    manageAsteroid(asteroid: Asteroid) {
    }

    isBodyType (body: CustomBody): body is Asteroid {
        return isAsteroid(body)
    }

}

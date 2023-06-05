import { CustomBody } from "../../../custom-body/custom-body";
import { Obstacle, isObstacle } from "../../../custom-body/obstacle/obstacle";
import { BodyManager, CustomBodyManager } from "../body-manager";
import { AsteroidManager } from "./asteroid-manager";
import { BlackholeManager } from "./blackhole-manager";

export class ObstacleManager implements CustomBodyManager<Obstacle> {
    
    bodyManager: BodyManager;

    constructor(bodyManager: BodyManager) {
        this.bodyManager = bodyManager;
    }

    manageBody(body: CustomBody) {
        if(!this.isBodyType(body)) return;
        this.manageObstacle(body)
    }

    manageObstacle(obstacle: Obstacle) {

    }

    isBodyType (body: CustomBody): body is Obstacle {
        return isObstacle(body)
    }
}

export interface ObstacleManagers {

    asteroidManager: AsteroidManager
    blackholeManager: BlackholeManager

}
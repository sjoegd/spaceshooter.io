import { CustomBody } from "../../../body/body";
import { Entity } from "../../../body/entity/entity";
import { Asteroid, isAsteroid } from "../../../body/obstacle/asteroid";
import { Obstacle } from "../../../body/obstacle/obstacle";
import { BodyManager } from "../body_manager";
import { CustomObstacleManager, ObstacleManager } from "./obstacle_manager";


export class AsteroidManager implements CustomObstacleManager<Asteroid> {
    
    bodyManager: BodyManager;
    obstacleManager: ObstacleManager;

    constructor(obstacleManager: ObstacleManager) {
        this.obstacleManager = obstacleManager;
        this.bodyManager = obstacleManager.bodyManager;
    }

    manageObstacle(asteroid: Asteroid) {
        // currently no special management needed
    }

    manageBody(body: CustomBody<String>) {
        if(!this.isBodyType(body)) return;
        this.obstacleManager.manageBody(body)
        if(!this.isObstacleType(body)) return;
        this.manageObstacle(body)
    }

    onEntityCollision(source: Asteroid, target: Entity) {
        // deal damage based on speed difference and mass
        const damage = this.bodyManager.calculateCrashDamage(source, target)
        this.bodyManager.entityManager.dealDamage(target, damage)
    }

    // returns whether it killed
    dealDamage(asteroid: Asteroid, damage: number): boolean {
        asteroid.hp -= damage;

        if(asteroid.hp <= 0) {
            this.bodyManager.removeBody(asteroid)
            return true;
        }

        return false;
    }

    isObstacleType(obstacle: Obstacle): obstacle is Asteroid {
        return isAsteroid(obstacle)
    }

    isBodyType(body: CustomBody<String>): body is Obstacle {
        return this.obstacleManager.isBodyType(body)
    }
}
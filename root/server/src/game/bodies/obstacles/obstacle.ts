import { BodyManager } from "../../managers/body_manager";
import { CustomBody, CustomBodyManager, BodyType } from "../custom_body";
import { AsteroidManager } from "./asteroid";

export type ObstacleType = 'asteroid' 

export interface Obstacle<Type extends ObstacleType> extends CustomBody<'obstacle'> {
    obstacleType: Type
}

export function createObstacle() {
    
}

export class ObstacleManager implements CustomBodyManager {
    
    manager: BodyManager

    managers: CustomObstacleManager[]
    asteroidManager: AsteroidManager

    constructor(manager: BodyManager) {
        this.manager = manager;
        this.asteroidManager = new AsteroidManager(this)
        this.managers = [this.asteroidManager]
    }

    isType(body: CustomBody<BodyType>): body is Obstacle<ObstacleType> {
        return body.bodyType == 'obstacle'
    }

    manage(body: CustomBody<BodyType>) {
        const obstacle = <Obstacle<ObstacleType>> body
        for(const manager of this.managers) {
            if(!manager.isType(obstacle)) continue;
            manager.manage(obstacle)
        }
    }

    remove(body: CustomBody<BodyType>) {
        this.manager.removeBody(body)
    }
}

export interface CustomObstacleManager {
    manager: ObstacleManager
    isType: (obstacle: Obstacle<ObstacleType>) => obstacle is Obstacle<ObstacleType>
    manage: (obstacle: Obstacle<ObstacleType>) => void
    createRandom: (x: number, y: number) => Obstacle<ObstacleType>
}
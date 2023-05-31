import { Body } from "matter-js";
import { BodyManager } from "../../managers/body_manager";
import { CustomBody, CustomBodyManager } from "../custom_body";
import { Asteroid, AsteroidManager } from "./asteroid";

export type CustomObstacles = Asteroid 
export type CustomObstacleManagers = AsteroidManager 
export interface Obstacle<Type extends String> extends CustomBody<'obstacle'> {
    obstacleType: Type
}

export function createObstacle<Type extends String>(body: Body, type: Type): Obstacle<Type> {
    const obstacle = <Obstacle<Type>> body;
    obstacle.obstacleType = type;
    return obstacle
}

export class ObstacleManager implements CustomBodyManager<Obstacle<String>> {
    
    bodyManager: BodyManager

    managers: CustomObstacleManagers[]
    asteroidManager: AsteroidManager

    constructor(manager: BodyManager) {
        this.bodyManager = manager;
        this.asteroidManager = new AsteroidManager(this)
        this.managers = [this.asteroidManager]
    }

    createObstacles() {
        
    }

    createRandomObstacle() {

    }

    manage() {
        for(const manager of this.managers) {
            manager.manage()
        }
    }

    add(body: CustomBody<String>) {
        if(!this.isType(body)) return;
        for(const manager of this.managers) {
            manager.add(body)
        }
    }

    remove(body: CustomBody<String>) {
        if(!this.isType(body)) return;
        for(const manager of this.managers) {
            manager.remove(body)
        }
    }

    addToWorld(body: CustomBody<String>) {
        this.bodyManager.addBodyToWorld(body)
    }

    removeFromWorld(body: CustomBody<String>) {
        this.bodyManager.removeBodyFromWorld(body)
    }

    isType(body: CustomBody<String>): body is Obstacle<String> {
        return body.bodyType == 'obstacle'
    }
}

export interface CustomObstacleManager<CustomObstacle extends Obstacle<String>> {
    obstacleManager: ObstacleManager
    obstacles: CustomObstacle[]
    isType: (obstacle: Obstacle<String>) => obstacle is CustomObstacle
    manage: () => void
    remove: (obstacle: Obstacle<String>) => void
    add: (obstacle: Obstacle<String>) => void
    createRandom: (x: number, y: number) => void
}
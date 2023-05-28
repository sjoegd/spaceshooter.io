import { Bodies, Vector } from "matter-js";
import { CustomObstacleManager, Obstacle, ObstacleManager, ObstacleType } from "./obstacle";
import inBetween from "../../../util/in_between";

export interface Asteroid extends Obstacle<'asteroid'> {

}

export function createAsteroid(x: number, y: number, size: number, direction: Vector, spin: number): Asteroid {
    const body = Bodies.circle(1, 1, 1)
    return <Asteroid> body
}

export class AsteroidManager implements CustomObstacleManager {

    manager: ObstacleManager

    constructor(manager: ObstacleManager) {
        this.manager = manager;
    }

    isType(obstacle: Obstacle<ObstacleType>): obstacle is Asteroid {
        return obstacle.obstacleType == 'asteroid'
    }

    manage(obstacle: Obstacle<ObstacleType>): void {
        const asteroid = <Asteroid> obstacle;
    }

    createRandom(x: number, y: number): Asteroid {
        return createAsteroid(x, y, this.getRandomSize(), this.getRandomDirection(), this.getRandomSpin())
    }

    getRandomSize(): number {
        return inBetween(0.5, 2.5)
    }

    getRandomDirection(): Vector {
        return {
            x: inBetween(-3, 3),
            y: inBetween(-3, 3)
        }
    }

    getRandomSpin(): number {
        return inBetween(0.0025, 0.025)
    }

}
import { Bodies, Vector } from "matter-js";
import { CustomObstacleManager, Obstacle, ObstacleManager, createObstacle } from "./obstacle";
import inBetween from "../../../util/in_between";
import { SpriteRender } from "../../../../../types/render_types";

export interface Asteroid extends Obstacle<'asteroid'> {
    BASE_SIZE: number
    BASE_DENSITY: number
    BASE_SPEED: number
    SPEED_INCREMENT: number

    size: number
    spin: number
}

export function createAsteroid(x: number, y: number, size: number, direction: Vector, spin: number): Asteroid {
    const BASE_SIZE = 50;
    const BASE_DENSITY = 0.05;
    const SCALE = 1/4;

    const sprite: SpriteRender = {
        texture: 'body/asteroid.jpg',
        xScale: SCALE * size,
        yScale: SCALE * size,
        xOffset: 0,
        yOffset: 0
    }
    
    const body = Bodies.circle(x, y, BASE_SIZE * size, {
        density: BASE_DENSITY,
        frictionAir: 0,
        friction: 0,
        frictionStatic: 0,
        render: {
            sprite
        }
    })

    const asteroid = <Asteroid> createObstacle(body, 'asteroid')
    
    asteroid.spin = spin;
    asteroid.BASE_SPEED = Vector.magnitude(direction)

    return <Asteroid> body
}

export class AsteroidManager implements CustomObstacleManager<Asteroid> {

    obstacleManager: ObstacleManager
    spawnRate = 0.05;

    obstacles: Asteroid[] = []

    constructor(manager: ObstacleManager) {
        this.obstacleManager = manager;
    }

    manage() {

    }

    add(obstacle: Obstacle<String>) {
        if(!this.isType(obstacle)) return;
        this.obstacles.push(obstacle)
    }

    remove(obstacle: Obstacle<String>) {
        if(!this.isType(obstacle)) return;
        this.obstacles = this.obstacles.filter(o => o.id !== obstacle.id)
    }

    createRandom(x: number, y: number): void {
        const asteroid = createAsteroid(x, y, this.getRandomSize(), this.getRandomDirection(), this.getRandomSpin())
        this.add(asteroid)
        this.obstacleManager.addToWorld(asteroid)
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

    isType(obstacle: Obstacle<String>): obstacle is Asteroid {
        return obstacle.obstacleType == 'asteroid'
    }

}
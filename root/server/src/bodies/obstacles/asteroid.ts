import { Obstacle, ObstacleManager } from "./obstacle";
import { Bodies, Body, Vector } from "matter-js";
import between from "../../util/between";
import { Spacejet } from "../spacejet";

export interface Asteroid extends Obstacle {
    isAsteroid: boolean

    BASE_SIZE: number
    BASE_DENSITY: number
    BASE_SPEED: number
    SPEED_INCREMENT: number

    size: number
    direction: Vector
    spin: number
}

export function createAsteroid(x: number, y: number, sizeScale: number, direction: Vector, spin: number): Asteroid {
    const BASE_SIZE = 50;
    const BASE_DENSITY = 0.05
    const SCALE = 1/4;
    const obstacle = <Obstacle> Bodies.circle(x, y, BASE_SIZE * sizeScale, {
        density: BASE_DENSITY,
        frictionAir: 0,
        friction: 0,
        frictionStatic: 0,
        render: {
            sprite: {
                texture: 'body/asteroid.jpg',
                xScale: SCALE * sizeScale,
                yScale: SCALE * sizeScale
            }
        }
    })

    obstacle.isObstacle = true;
    obstacle.massToHealthRatio = 0.1
    obstacle.health = obstacle.mass * obstacle.massToHealthRatio
    obstacle.baseDamage = 2.5;

    const asteroid = <Asteroid> obstacle;

    asteroid.isAsteroid = true;
    asteroid.BASE_SIZE = BASE_SIZE;
    asteroid.BASE_DENSITY = BASE_DENSITY
    asteroid.BASE_SPEED = Vector.magnitude(direction)
    asteroid.SPEED_INCREMENT = 0.05
    asteroid.size = sizeScale;
    asteroid.direction = direction;
    asteroid.spin = spin;

    Body.setVelocity(asteroid, direction)

    return asteroid;
}

export class AsteroidManager {

    obstacleManager: ObstacleManager

    constructor(obstacleManager: ObstacleManager) {
        this.obstacleManager = obstacleManager;
    }

    manageAsteroid(asteroid: Asteroid) {
        // make it spin
        Body.setAngularVelocity(asteroid, asteroid.spin)

        // slightly increase speed if to slow
        const currentSpeed = Vector.magnitude(asteroid.velocity)
        if(currentSpeed < asteroid.BASE_SPEED) {
            const scale = ((asteroid.BASE_SPEED - currentSpeed) / currentSpeed) * asteroid.SPEED_INCREMENT
            Body.applyForce(asteroid, asteroid.position, Vector.mult(asteroid.velocity, scale))
        }
    }

    createRandomAsteroid(x: number, y: number) {
        const size = this.getAsteroidSize()
        const direction = this.getAsteroidDirection()
        const spin = this.getAsteroidSpin()
        return createAsteroid(x, y, size, direction, spin)
    }

    getAsteroidSize(): number {
        return between(0.5, 2.5)
    }

    getAsteroidDirection(): Vector {
        return {
            x: between(-3, 3),
            y: between(-3, 3)
        }
    }

    getAsteroidSpin(): number {
        return between(0.0025, 0.025);
    }

    handleDamage(asteroid: Asteroid, damage: number, owner?: Spacejet) {
        asteroid.health -= damage;
        if(asteroid.health > 0) return;
        this.obstacleManager.removeObstacle(asteroid);
        // give owner points? idk
    }
}
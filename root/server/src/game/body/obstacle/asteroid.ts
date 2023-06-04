import { Bodies, Body, Vector } from "matter-js";
import { Obstacle, createObstacle, isObstacle } from "./obstacle";
import { SpriteRender } from "../../../../../types/render_types";
import { CustomBody, createCustomBody } from "../body";
import { AsteroidManager } from "../../manager/body_manager/obstacle/asteroid_manager";

export interface Asteroid extends Obstacle {
    obstacleType: 'asteroid'
    hp: number
}

export interface AsteroidOptions {
    size: number,
    direction: Vector,
    spin: number
}

export function isAsteroid(body: CustomBody<String>): body is Asteroid {
    if(!isObstacle(body)) return false;
    return body.obstacleType == 'asteroid'
}

export function createAsteroid(x: number, y: number, manager: AsteroidManager, options: AsteroidOptions): Asteroid {

    const { size, direction, spin } = options;

    const baseSize = 50;
    const baseDensity = 0.01;
    const scale = 1/4;
    
    const sprite: SpriteRender = {
        texture: 'body/asteroid.png',
        xScale: scale * size,
        yScale: scale * size,
        xOffset: 0,
        yOffset: 0
    }

    const body = Bodies.circle(x, y, baseSize * size, {
        density: baseDensity,
        frictionAir: 0,
        frictionStatic: 0,
        friction: 1,
        restitution: 0,
        render: {
            sprite
        }
    })

    const customBody = createCustomBody(body, 'obstacle', manager)

    const asteroid = <Asteroid> createObstacle(customBody, {
        type: 'asteroid',
        size,
        baseVelocity: direction,
        baseDensity,
        baseSize,
        baseSpeed: Vector.magnitude(direction),
        baseSpin: spin
    })
    
    asteroid.hp = asteroid.mass / 5

    return asteroid;
}
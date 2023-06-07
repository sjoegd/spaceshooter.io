import { AsteroidManager } from '../../manager/body-manager/obstacle/asteroid-manager';
import { Obstacle, isObstacle, createObstacle } from './obstacle';
import { CustomBody, createCustomBody } from '../custom-body';
import { Vector, Bodies } from 'matter-js';
import { SpriteRender } from '../../../../../types/render_types';

export interface Asteroid extends Obstacle {
    obstacleType: 'asteroid'
    manager: AsteroidManager
    hp: number
}

export function isAsteroid(body: CustomBody): body is Asteroid {
    if(!isObstacle(body)) return false
    return body.obstacleType == 'asteroid'
}

export interface AsteroidOptions {
    size: number,
    direction: Vector,
    baseSpin: number
}

export function createAsteroid(x: number, y: number, manager: AsteroidManager, options: AsteroidOptions): Asteroid {
    
    const { size, direction, baseSpin } = options;

    const baseSize = 50;
    const scale = 1/4;

    const sprite: SpriteRender = {
        texture: 'body/asteroid.png',
        xScale: scale * size,
        yScale: scale * size,
        xOffset: 0,
        yOffset: 0
    }

    const body = Bodies.circle(x, y, baseSize * size, {
        density: 0.01,
        frictionAir: 0,
        frictionStatic: 0,
        friction: 0,
        restitution: 0,
        render: {
            sprite
        }
    })

    const customBody = createCustomBody(body, 'obstacle', manager)
    const asteroid = <Asteroid> createObstacle(customBody, {
        obstacleType: 'asteroid',
        baseSize,
        baseVelocity: direction,
        baseSpin,
        speedIncrease: 0.05,
        spinIncrease: 0.01
    })

    asteroid.hp = asteroid.mass;

    return asteroid;
}
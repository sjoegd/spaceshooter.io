import { Body, Vector } from "matter-js";
import { CustomBody } from "../body";

export type ObstacleType = 'asteroid' | 'blackhole'

export interface Obstacle extends CustomBody<'obstacle'> {
    obstacleType: ObstacleType
    
    baseVelocity: Vector
    baseDensity: number
    baseSize: number
    baseSpeed: number
    baseSpin: number
    speedIncrement: 0.05
    spinIncrement: 0.01
    size: number
}

export interface ObstacleOptions {
    type: ObstacleType
    size: number
    baseVelocity: Vector
    baseDensity: number
    baseSize: number
    baseSpeed: number
    baseSpin: number
}

export function isObstacle(body: CustomBody<String>): body is Obstacle {
    return body.bodyType == 'obstacle'
}

export function createObstacle(body: CustomBody<'obstacle'>, options: ObstacleOptions): Obstacle {
    const {type, size, baseVelocity, baseDensity, baseSize, baseSpeed, baseSpin} = options

    const obstacle = <Obstacle> body
    obstacle.obstacleType = type;
    obstacle.size = size;
    obstacle.baseVelocity = baseVelocity;
    obstacle.baseDensity = baseDensity
    obstacle.baseSize = baseSize
    obstacle.baseSpeed = baseSpeed
    obstacle.baseSpin = baseSpin * 0.01
    obstacle.speedIncrement = 0.05;
    obstacle.spinIncrement = 0.01;

    Body.setVelocity(obstacle, baseVelocity)

    return obstacle
}
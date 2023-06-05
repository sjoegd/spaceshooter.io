import { Body, Vector } from "matter-js";
import { ObstacleManager } from "../../manager/body-manager/obstacle/obstacle-manager";
import { CustomBody } from "../custom-body";

export interface Obstacle extends CustomBody {
    bodyType: 'obstacle'
    obstacleType: string
    manager: ObstacleManager

    baseSpeed: number
    baseSpin: number
    speedIncrease: number
    spinIncrease: number
}

export function isObstacle(body: CustomBody): body is Obstacle {
    return body.bodyType == 'obstacle'
}

export interface ObstacleOptions {
    obstacleType: string
    baseVelocity: Vector
    baseSpin: number
    speedIncrease: number
    spinIncrease: number
}

export function createObstacle(body: CustomBody, options: ObstacleOptions) {

    const { obstacleType, baseVelocity, baseSpin, speedIncrease, spinIncrease } = options

    const obstacle = <Obstacle> body;
    obstacle.obstacleType = obstacleType;
    obstacle.baseSpeed = Vector.magnitude(baseVelocity)
    obstacle.baseSpin = baseSpin;
    obstacle.speedIncrease = speedIncrease;
    obstacle.spinIncrease = spinIncrease;

    Body.setVelocity(obstacle, baseVelocity)
    Body.setAngularVelocity(obstacle, baseSpin)

    return obstacle;
}
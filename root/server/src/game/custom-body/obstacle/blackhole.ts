import { Obstacle, createObstacle, isObstacle } from "./obstacle";
import { BlackholeManager } from "../../manager/body-manager/obstacle/blackhole-manager";
import { CustomBody, createCustomBody } from "../custom-body";
import { SpriteRender } from "../../../../../types/render_types";
import { Bodies } from "matter-js";

export interface Blackhole extends Obstacle {
    obstacleType: 'blackhole'
    manager: BlackholeManager

    size: number

    baseForceRadius: number,
    baseForceStrength: number;
    forceRadius: number
    forceStrength: number

    birth: number
    lifeTime: number
}

export function isBlackhole(body: CustomBody): body is Blackhole {
    if(!isObstacle(body)) return false;
    return body.obstacleType == 'blackhole'
}

export interface BlackholeOptions {
    size: number,
    baseSpin: number
    forceRadius: number
    forceStrength: number
    lifeTime: number
}

export function createBlackhole(x: number, y: number, manager: BlackholeManager, options: BlackholeOptions) {

    const { size, baseSpin, forceRadius, forceStrength, lifeTime } = options;

    const scale = 1/4
    const baseSize = scale * 50

    const sprite: SpriteRender = {
        texture: 'body/blackhole.png',
        xScale: scale * size,
        yScale: scale * size,
        xOffset: 0,
        yOffset: 0
    }

    const body = Bodies.circle(x, y, baseSize * size, {
        isSensor: true,
        density: 0.01,
        render: {
            sprite
        }
    })

    const customBody = createCustomBody(body, 'obstacle', manager, 0)
    const blackhole = <Blackhole> createObstacle(customBody, {
        obstacleType: 'blackhole',
        baseSize,
        baseSpin,
        baseVelocity: {x: 0, y: 0},
        speedIncrease: 0,
        spinIncrease: 0.01
    })
    
    blackhole.size = size;
    blackhole.baseForceRadius = 1/scale;
    blackhole.baseForceStrength = 1;
    blackhole.forceRadius = forceRadius;
    blackhole.forceStrength = forceStrength;
    blackhole.birth = manager.bodyManager.gameManager.getCurrentTick()
    blackhole.lifeTime = lifeTime;
    
    return blackhole
}
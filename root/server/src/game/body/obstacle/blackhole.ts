import { Bodies } from "matter-js";
import { SpriteRender } from "../../../../../types/render_types";
import { Obstacle, createObstacle, isObstacle } from "./obstacle";
import { CustomBody, createCustomBody } from "../body";
import { BlackholeManager } from "../../manager/body_manager/obstacle/blackhole_manager";
import { BASE_TICK_RATE } from "../../server_game_engine";


export interface Blackhole extends Obstacle {
    obstacleType: 'blackhole'


    baseForceRadius: 4,
    baseForceStrength: 0.0005
    creationTime: number
    lifeTime: number
    forceRadius: number
    forceStrength: number
}

export interface BlackholeOptions {
    size: number,
    spin: number,

    lifeTime: number 
    forceRadius: number,
    forceStrength: number
}

export function isBlackhole(body: CustomBody<String>): body is Blackhole {
    if(!isObstacle(body)) return false;

    return body.obstacleType == 'blackhole'
}

export function createBlackhole(x: number, y: number, manager: BlackholeManager, options: BlackholeOptions) {

    const { size, spin, lifeTime, forceRadius, forceStrength } = options

    const baseSize = 12.5; // smaller then actual size, to represent the removal hole
    const baseDensity = 0.01;
    const scale = 1/4;

    const sprite: SpriteRender = {
        texture: 'body/blackhole.png',
        xScale: scale * size,
        yScale: scale * size,
        xOffset: 0,
        yOffset: 0
    }

    const body = Bodies.circle(x, y, baseSize * size, {
        isSensor: true,
        density: baseDensity,
        render: {
            sprite
        }
    })

    const customBody = createCustomBody(body, 'obstacle', manager, 0)
    const blackhole = <Blackhole> createObstacle(customBody, {
        type: 'blackhole',
        size,
        baseVelocity: {x: 0, y: 0},
        baseDensity,
        baseSize,
        baseSpeed: 0,
        baseSpin: spin * 4,
    })

    
    blackhole.creationTime = performance.now()
    blackhole.lifeTime = manager.bodyManager.gameManager.calculateTimeFromTicks(lifeTime * BASE_TICK_RATE);
    blackhole.baseForceRadius = 4;
    blackhole.baseForceStrength = 0.0005;
    blackhole.forceRadius = forceRadius;
    blackhole.forceStrength = forceStrength;
    
    return blackhole;
}
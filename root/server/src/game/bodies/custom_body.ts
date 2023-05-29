import { Body } from "matter-js";
import { BodyManager } from "../managers/custom_body_manager";
import { Powerup, PowerupManager } from "./powerups/powerup";
import { Obstacle, ObstacleManager } from "./obstacles/obstacle";
import { Entity, EntityManager } from "./entities/entity";
import { Bullet, BulletManager } from "./bullets/bullet";

export type CustomBodies = Powerup | Obstacle<String> | Entity<String> | Bullet
export type CustomBodyManagers = PowerupManager | ObstacleManager | EntityManager | BulletManager

export interface CustomBody<Type extends String> extends Body {
    bodyType: Type
}

export function createCustomBody<Type extends String>(body: Body, type: Type) {
    const customBody = <CustomBody<Type>> body
    customBody.bodyType = type
    return customBody;
}

export interface CustomBodyManager<Body extends CustomBody<String>> {
    bodyManager: BodyManager
    isType: (body: CustomBody<String>) => body is Body
    manage: () => void
    remove: (body: CustomBody<String>) => void
    add: (body: CustomBody<String>) => void
    addToWorld: (body: CustomBody<String>) => void
    removeFromWorld: (body: CustomBody<String>) => void
}




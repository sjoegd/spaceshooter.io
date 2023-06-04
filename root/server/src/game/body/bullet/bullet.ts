import { Bodies, Body, Vector } from "matter-js";
import { SpriteRender } from "../../../../../types/render_types";
import { CustomBody, createCustomBody } from "../body";
import { Spacejet } from "../entity/spacejet/spacejet";
import { BulletManager } from "../../manager/body_manager/bullet/bullet_manager";

export interface Bullet extends CustomBody<'bullet'> {
    bulletType: BulletType
    owner: Spacejet
}

export interface BulletType {
    scale: number
    hitbox: Vector[][]
    sprite: SpriteRender

    damage: number
    baseSpeed: number
    minSpeed: number
}

export interface BulletOptions {
    angle: number
    bulletType: BulletType,
    velocity: Vector,
    owner: Spacejet
}

export function isBullet(body: CustomBody<String>): body is Bullet {
    return body.bodyType == 'bullet'
}

export function createBullet(x: number, y: number, options: BulletOptions, manager: BulletManager): Bullet {

    const { angle, bulletType, velocity, owner } = options
    
    const body = Bodies.fromVertices(x, y, bulletType.hitbox, {
        angle,
        restitution: 0,
        torque: 0,
        inertia: Infinity,
        density: 0.0001,
        frictionAir: 0.05,
        friction: 1,
        render: {
            sprite: bulletType.sprite
        }
    })

    const bullet = <Bullet> createCustomBody(body, 'bullet', manager)
    bullet.bulletType = bulletType;
    bullet.owner = owner;

    Body.setVelocity(bullet, {
        x: Math.cos(angle) * bulletType.baseSpeed + velocity.x,
        y: Math.sin(angle) * bulletType.baseSpeed + velocity.y
    })

    return bullet;
}
import { BulletManager } from "../../manager/body-manager/bullet/bullet-manager";
import { CustomBody, createCustomBody } from '../custom-body';
import { Spacejet } from "../entity/spacejet/spacejet";
import { BulletType, BulletTypeBase, createBulletType } from './type/bullet-type';
import { Vector, Bodies, Body } from 'matter-js';

export interface Bullet extends CustomBody {
    bodyType: 'bullet'
    manager: BulletManager

    bulletType: BulletType
    owner: Spacejet
}

export function isBullet(body: CustomBody): body is Bullet {
    return body.bodyType == 'bullet'
}

export interface BulletOptions {
    bulletTypeBase: BulletTypeBase
    owner: Spacejet
    angle: number
    velocity: Vector
}

export function createBullet(x: number, y: number, manager: BulletManager, options: BulletOptions): Bullet {

    const { bulletTypeBase, owner, angle, velocity } = options
    const bulletType: BulletType = createBulletType(bulletTypeBase)
    
    const body = Bodies.fromVertices(x, y, bulletType.hitbox, {
        restitution: 0,
        torque: 0,
        inertia: Infinity,
        density: 0.01,
        frictionAir: bulletType.frictionAir,
        friction: 1,
        render: {
            sprite: bulletType.sprite
        }
    });

    const bullet = <Bullet> createCustomBody(body, 'bullet', manager)
    bullet.bulletType = bulletType
    bullet.owner = owner;

    Body.setAngle(bullet, angle)
    Body.setVelocity(bullet, {
        x: Math.cos(angle) * bulletType.baseSpeed + velocity.x,
        y: Math.sin(angle) * bulletType.baseSpeed + velocity.y
    })

    return bullet;
}
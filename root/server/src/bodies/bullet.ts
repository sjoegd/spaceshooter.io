import { Body, Bodies, Vector } from "matter-js";
import { Spacejet } from "./spacejet";
import { SpriteRender } from "../game_engine";
import BodyManager from "../managers/body_manager";

export interface Bullet extends Body {
    isBullet: boolean

    SCALE: number
    DAMAGE: number
    BASE_SPEED: number
    MIN_SPEED: number
    owner: Spacejet
}

export function createBullet(x: number, y: number, angle: number, owner: Spacejet): Bullet {
    const SCALE = 1/40

    const sprite: SpriteRender = {
        texture: 'body/laser_bullet.png',
        xScale: SCALE,
        yScale: SCALE,
        xOffset: 0,
        yOffset: 0
    }

    const bullet = <Bullet> Bodies.rectangle(x, y, 950 * SCALE, 342 * SCALE, {
        angle,
        restitution: 0,
        torque: 0,
        inertia: Infinity,
        density: 0.000000001,
        frictionAir: 0.05,
        render: {
            sprite
        }
    })

    bullet.isBullet = true;
    bullet.SCALE = SCALE;
    bullet.DAMAGE = 10;
    bullet.BASE_SPEED = 35;
    bullet.MIN_SPEED = 12.5;
    bullet.owner = owner;

    return bullet
}

export class BulletManager {

    bodyManager: BodyManager

    constructor(bodyManager: BodyManager) {
        this.bodyManager = bodyManager
    }

    manageBullet(bullet: Bullet) {
        this.handleRemove(bullet)
    }

    handleRemove(bullet: Bullet) {
        const speed = Vector.magnitude(bullet.velocity)

        if(speed < bullet.MIN_SPEED) {
            this.bodyManager.removeBullet(bullet)
        }
    }

}
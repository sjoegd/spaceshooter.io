import { Bodies, Vector } from "matter-js";
import { BodyManager } from "../../managers/body_manager";
import { CustomBody, CustomBodyManager, createCustomBody } from '../custom_body';
import { Spacejet } from "../entities/spacejet/spacejet";
import { SpriteRender } from "../../../../../types/render_types";

export interface Bullet extends CustomBody<'bullet'> {
    bulletType: BulletType

    SCALE: number
    OWNER: Spacejet
}

export interface BulletType {
    damage: number
    baseSpeed: number
    minSpeed: number
    airFriction: number
}

export function createBullet(x: number, y: number, angle: number, type: BulletType, owner: Spacejet) {
    const SCALE = 1/40;

    const sprite: SpriteRender = {
        texture: 'body/laser_bullet.png',
        xScale: SCALE,
        yScale: SCALE,
        xOffset: 0,
        yOffset: 0
    }

    const body = Bodies.rectangle(x, y, 950 * SCALE, 342 * SCALE, {
        angle,
        restitution: 0,
        torque: 0,
        inertia: Infinity,
        density: 0.000000001,
        frictionAir: type.airFriction,
        render: {
            sprite
        }
    })

    const bullet = <Bullet> createCustomBody(body, 'bullet')
    bullet.bulletType = type;
    bullet.SCALE = SCALE;
    bullet.OWNER = owner;

    return bullet;
}

export class BulletManager implements CustomBodyManager<Bullet> {
    
    bodyManager: BodyManager

    bullets: Bullet[] = []

    constructor(manager: BodyManager) {
        this.bodyManager = manager;
    }

    manage() {
        for(const bullet of this.bullets) {
            this.manageBullet(bullet)
        }
    }

    manageBullet(bullet: Bullet) {
        this.handleRemove(bullet)
    }

    add(body: CustomBody<String>) {
        if(!this.isType(body)) return;
        this.bullets.push(body)
    }

    remove(body: CustomBody<String>) {
        if(!this.isType(body)) return;
        this.bullets = this.bullets.filter(b => b.id !== body.id)
    }

    addToWorld(body: CustomBody<String>) {
        this.bodyManager.addBodyToWorld(body)
    }

    removeFromWorld(body: CustomBody<String>) {
        this.bodyManager.removeBodyFromWorld(body)
    }

    isType(body: CustomBody<String>): body is Bullet {
        return body.bodyType == 'bullet'
    }

    handleRemove(bullet: Bullet) {
        const speed = Vector.magnitude(bullet.velocity)
        if(speed < bullet.bulletType.minSpeed) {
            this.remove(bullet)
            this.removeFromWorld(bullet)
        }
    }
}

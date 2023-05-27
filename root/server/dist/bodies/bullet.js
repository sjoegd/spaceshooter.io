"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulletManager = exports.createBullet = void 0;
const matter_js_1 = require("matter-js");
function createBullet(x, y, angle, owner) {
    const SCALE = 1 / 40;
    const sprite = {
        texture: 'laser_bullet.png',
        xScale: SCALE,
        yScale: SCALE,
        xOffset: 0,
        yOffset: 0
    };
    const bullet = matter_js_1.Bodies.rectangle(x, y, 950 * SCALE, 342 * SCALE, {
        angle,
        restitution: 0,
        torque: 0,
        inertia: Infinity,
        density: 0.0001,
        frictionAir: 0.025,
        render: {
            sprite
        }
    });
    bullet.isBullet = true;
    bullet.SCALE = SCALE;
    bullet.DAMAGE = 10;
    bullet.BASE_SPEED = 25;
    bullet.MIN_SPEED = 12.5;
    bullet.owner = owner;
    return bullet;
}
exports.createBullet = createBullet;
class BulletManager {
    constructor(bodyManager) {
        this.bodyManager = bodyManager;
    }
    manageBullet(bullet) {
        this.handleRemove(bullet);
    }
    handleRemove(bullet) {
        const speed = matter_js_1.Vector.magnitude(bullet.velocity);
        if (speed < bullet.MIN_SPEED) {
            this.bodyManager.removeBullet(bullet);
        }
    }
}
exports.BulletManager = BulletManager;

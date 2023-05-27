"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matter_js_1 = require("matter-js");
class CollisionManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.bodyManager = gameEngine.bodyManager;
        this.setup();
    }
    setup() {
        matter_js_1.Events.on(this.gameEngine.engine, 'collisionStart', (ev) => this.manageCollision(ev));
    }
    manageCollision(ev) {
        for (const pair of ev.pairs) {
            let { bodyA, bodyB } = pair;
            if (bodyA.isBullet) {
                this.manageBulletCollision(bodyA, bodyB);
            }
            if (bodyB.isBullet) {
                this.manageBulletCollision(bodyB, bodyA);
            }
        }
    }
    manageBulletCollision(bullet, body) {
        // spacejet handle
        if (body.isSpacejet) {
            this.bodyManager.onBulletHitsSpacejet(bullet, body);
        }
        this.bodyManager.removeBullet(bullet);
    }
}
exports.default = CollisionManager;

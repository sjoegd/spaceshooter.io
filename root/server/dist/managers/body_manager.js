"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matter_js_1 = require("matter-js");
const spacejet_1 = require("../bodies/spacejet");
const bullet_1 = require("../bodies/bullet");
class BodyManager {
    constructor(gameEngine) {
        this.spacejets = [];
        this.bullets = [];
        this.gameEngine = gameEngine;
        this.world = gameEngine.engine.world;
        this.spacejetManager = new spacejet_1.SpacejetManager(this);
        this.bulletManager = new bullet_1.BulletManager(this);
        this.setup();
    }
    setup() {
        matter_js_1.Events.on(this.gameEngine.engine, 'beforeUpdate', () => {
            this.manageBodies();
        });
    }
    manageBodies() {
        this.manageSpacejets();
        this.manageBullets();
    }
    manageSpacejets() {
        for (const spacejet of this.spacejets) {
            this.spacejetManager.manageSpacejet(spacejet);
        }
    }
    manageBullets() {
        for (const bullet of this.bullets) {
            this.bulletManager.manageBullet(bullet);
        }
    }
    addSpacejet(spacejet) {
        this.spacejets.push(spacejet);
        matter_js_1.World.add(this.world, spacejet);
    }
    removeSpacejet(spacejet) {
        this.spacejets = this.spacejets.filter(s => s.id !== spacejet.id);
        matter_js_1.World.remove(this.world, spacejet);
    }
    addBullet(bullet) {
        this.bullets.push(bullet);
        matter_js_1.World.add(this.world, bullet);
    }
    removeBullet(bullet) {
        this.bullets = this.bullets.filter(b => b.id !== bullet.id);
        matter_js_1.World.remove(this.world, bullet);
    }
    onBulletHitsSpacejet(bullet, spacejet) {
        if (bullet.owner.id == spacejet.id)
            return;
        spacejet.health -= bullet.DAMAGE;
        if (spacejet.health <= 0) {
            bullet.owner.kills++;
            this.removeSpacejet(spacejet);
        }
    }
}
exports.default = BodyManager;

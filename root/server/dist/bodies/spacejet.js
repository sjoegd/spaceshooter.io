"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpacejetManager = exports.SpacejetState = exports.createSpacejet = void 0;
const matter_js_1 = require("matter-js");
const bullet_1 = require("./bullet");
function createSpacejet(x, y) {
    const SCALE = 1 / 5;
    const HITBOX = [[
            { x: 603 * SCALE, y: (712 / 2) * SCALE },
            { x: 0, y: 0 },
            { x: 0, y: 712 * SCALE },
        ]];
    const sprite = {
        texture: 'spacejet.png',
        xScale: SCALE,
        yScale: SCALE,
        xOffset: -50 * SCALE,
        yOffset: 0
    };
    const spacejet = matter_js_1.Bodies.fromVertices(x, y, HITBOX, {
        torque: 0,
        inertia: Infinity,
        render: {
            sprite
        }
    });
    spacejet.isSpacejet = true;
    spacejet.state = new SpacejetState(spacejet);
    spacejet.SCALE = SCALE;
    spacejet.HITBOX = HITBOX;
    spacejet.MAX_SPEED = 10;
    spacejet.DAMPING_FORCE = 0.001;
    spacejet.MOVEMENT_INCREMENT = 0.25;
    spacejet.ANGLE_INCREMENT = Math.PI / 64;
    spacejet.BOOST_MULTIPLY = 2.5;
    spacejet.FIRERATE = 10;
    spacejet.BOOST_DURATION = 500;
    spacejet.BOOST_COOLDOWN = 2500;
    spacejet.BASE_HEALTH = 100;
    spacejet.BASE_AMMO = 10;
    spacejet.RELOAD_TIME = 1000;
    spacejet.health = spacejet.BASE_HEALTH;
    spacejet.ammo = spacejet.BASE_AMMO;
    spacejet.kills = 0;
    return spacejet;
}
exports.createSpacejet = createSpacejet;
class SpacejetState {
    constructor(spacejet) {
        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;
        this.shooting = false;
        this.lastTimeShot = -Infinity;
        this.boost = false;
        this.isBoosting = false;
        this.boostStart = 0;
        this.lastBoost = -Infinity;
        this.isReloading = false;
        this.reloadingStart = 0;
        this.spacejet = spacejet;
    }
}
exports.SpacejetState = SpacejetState;
class SpacejetManager {
    constructor(bodyManager) {
        this.bodyManager = bodyManager;
    }
    manageSpacejet(spacejet) {
        const state = spacejet.state;
        this.handleBoost(spacejet, state);
        this.handleMovement(spacejet, state);
        this.handleShooting(spacejet, state);
    }
    handleBoost(spacejet, state) {
        // check if boost should start
        if (state.boost && !state.isBoosting) {
            const canBoost = performance.now() - state.lastBoost > spacejet.BOOST_COOLDOWN;
            if (canBoost) {
                state.isBoosting = true;
                state.boostStart = performance.now();
                // update sprite
                const sprite = spacejet.render.sprite;
                if (!sprite)
                    return;
                sprite.texture = 'spacejet_boost.png';
                return;
            }
        }
        if (state.isBoosting) {
            const shouldEnd = performance.now() - state.boostStart > spacejet.BOOST_DURATION;
            if (shouldEnd || !state.boost) {
                state.isBoosting = false;
                state.lastBoost = performance.now();
                // update sprite
                const sprite = spacejet.render.sprite;
                if (!sprite)
                    return;
                sprite.texture = 'spacejet.png';
                return;
            }
        }
    }
    handleMovement(spacejet, state) {
        const angle = spacejet.angle;
        let velocity = spacejet.velocity;
        const multiply = (state.isBoosting ? spacejet.BOOST_MULTIPLY : 1);
        const movementIncrement = spacejet.MOVEMENT_INCREMENT * multiply;
        // damp if over speed cap
        const currentSpeed = matter_js_1.Vector.magnitude(velocity);
        const maxSpeed = spacejet.MAX_SPEED * multiply;
        if (currentSpeed > maxSpeed) {
            const force = matter_js_1.Vector.mult(matter_js_1.Vector.neg(velocity), spacejet.DAMPING_FORCE);
            matter_js_1.Body.applyForce(spacejet, spacejet.position, force);
        }
        // update movement
        velocity = spacejet.velocity;
        if (state.forward) {
            matter_js_1.Body.setVelocity(spacejet, {
                x: velocity.x + Math.cos(angle) * movementIncrement,
                y: velocity.y + Math.sin(angle) * movementIncrement
            });
        }
        if (state.backward) {
            matter_js_1.Body.setVelocity(spacejet, {
                x: velocity.x - Math.cos(angle) * (movementIncrement / 2),
                y: velocity.y - Math.sin(angle) * (movementIncrement / 2)
            });
        }
        if (state.left) {
            matter_js_1.Body.setAngle(spacejet, angle - spacejet.ANGLE_INCREMENT);
        }
        if (state.right) {
            matter_js_1.Body.setAngle(spacejet, angle + spacejet.ANGLE_INCREMENT);
        }
    }
    handleShooting(spacejet, state) {
        const allowedToFire = performance.now() - (1000 / spacejet.FIRERATE) > state.lastTimeShot;
        if (!state.shooting || !allowedToFire)
            return;
        // reload check
        if (state.isReloading) {
            if (performance.now() - spacejet.RELOAD_TIME <= state.reloadingStart)
                return;
            state.isReloading = false;
            spacejet.ammo = spacejet.BASE_AMMO;
        }
        // empty ammo -> start relaod
        if (spacejet.ammo == 0) {
            state.isReloading = true;
            state.reloadingStart = performance.now();
            return;
        }
        // fire
        const velocity = spacejet.velocity;
        const angle = spacejet.angle;
        const x = spacejet.position.x + Math.cos(angle) * (450 * spacejet.SCALE);
        const y = spacejet.position.y + Math.sin(angle) * (450 * spacejet.SCALE);
        const bullet = (0, bullet_1.createBullet)(x, y, angle, spacejet);
        matter_js_1.Body.setVelocity(bullet, {
            x: Math.cos(angle) * bullet.BASE_SPEED + velocity.x,
            y: Math.sin(angle) * bullet.BASE_SPEED + velocity.y
        });
        this.bodyManager.addBullet(bullet);
        state.lastTimeShot = performance.now();
        spacejet.ammo--;
    }
}
exports.SpacejetManager = SpacejetManager;

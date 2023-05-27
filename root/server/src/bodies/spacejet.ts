import { Body, Bodies, Vector } from "matter-js";
import { SpriteRender } from "../game_engine"
import { Bullet, createBullet } from "./bullet";
import BodyManager from '../managers/body_manager';

export interface Spacejet extends Body {
    isSpacejet: boolean
    state: SpacejetState
    
    SCALE: number
    HITBOX: Vector[][]
    MAX_SPEED: number
    DAMPING_FORCE: number
    MOVEMENT_INCREMENT: number
    ANGLE_INCREMENT: number
    FIRERATE: number
    BOOST_MULTIPLY: number
    BOOST_DURATION: number
    BOOST_COOLDOWN: number
    BASE_HEALTH: number
    BASE_AMMO: number
    RELOAD_TIME: number
    MAX_SHIELD: number

    shield: number
    health: number
    ammo: number
    kills: number
}

export function createSpacejet(x: number, y: number): Spacejet {
    const SCALE = 1/5;
    
    const HITBOX: Vector[][] = [[
        {x: 20 * SCALE, y: 356 * SCALE},
        {x: 20 * SCALE, y: 306 * SCALE},
        {x: 105 * SCALE, y: 0 * SCALE},
        {x: 165 * SCALE, y: 8 * SCALE},
        {x: 375 * SCALE, y: 255* SCALE},
        {x: 505 * SCALE, y: 255* SCALE},
        {x: 700 * SCALE, y: 356* SCALE },
        {x: 505 * SCALE, y: (712-255) * SCALE},
        {x: 375 * SCALE, y: (712-255) * SCALE},
        {x: 165 * SCALE, y: (712-8) * SCALE},
        {x: 105 * SCALE, y: 712 * SCALE},
        {x: 20 * SCALE, y: (712-306) * SCALE},        
    ]]

    // const HITBOX: Vector[][] = [[
    //     {x: 0, y: 0},
    //     {x: 0, y: 712 * SCALE},
    //     {x: 703 * SCALE, y: 306 * SCALE}
    // ]]

    const sprite: SpriteRender = {
        texture: 'body/spacejet.png',
        xScale: SCALE,
        yScale: SCALE,
        xOffset: -50 * SCALE,
        yOffset: 0
    }

    const spacejet = <Spacejet> Bodies.fromVertices(x, y, HITBOX, {
        torque: 0,
        inertia: Infinity,
        density: 0.005,
        render: {
            sprite
        }
    })

    spacejet.isSpacejet = true;
    spacejet.state = new SpacejetState(spacejet)
    spacejet.SCALE = SCALE;
    spacejet.HITBOX = HITBOX;
    spacejet.MAX_SPEED = 10;
    spacejet.DAMPING_FORCE = 0.005;
    spacejet.MOVEMENT_INCREMENT = 0.25;
    spacejet.ANGLE_INCREMENT = Math.PI/48;
    spacejet.BOOST_MULTIPLY = 2;
    spacejet.FIRERATE = 10;
    spacejet.BOOST_DURATION = 500
    spacejet.BOOST_COOLDOWN = 2500
    spacejet.BASE_HEALTH = 100;
    spacejet.BASE_AMMO = 10;
    spacejet.RELOAD_TIME = 1000;
    spacejet.MAX_SHIELD = 50;

    spacejet.shield = 0;
    spacejet.health = spacejet.BASE_HEALTH
    spacejet.ammo = spacejet.BASE_AMMO
    spacejet.kills = 0;

    return spacejet
}

export class SpacejetState {

    spacejet: Spacejet;

    forward: boolean = false;
    backward: boolean = false;
    left: boolean = false;
    right: boolean = false;

    shooting: boolean = false;
    lastTimeShot: number = -Infinity;

    boost: boolean = false;
    isBoosting: boolean = false;
    boostStart: number = 0;
    lastBoost: number = -Infinity;

    isReloading: boolean = false;

    constructor(spacejet: Spacejet) {
        this.spacejet = spacejet;
    }

}

export class SpacejetManager {

    bodyManager: BodyManager

    constructor(bodyManager: BodyManager) {
        this.bodyManager = bodyManager;
    }

    manageSpacejet(spacejet: Spacejet) {
        const state = spacejet.state;
        this.handleBoost(spacejet, state)
        this.handleMovement(spacejet, state)
        this.handleShooting(spacejet, state)
    }

    handleBoost(spacejet: Spacejet, state: SpacejetState) {
        // check if boost should start
        if(state.boost && !state.isBoosting) {
            const canBoost = performance.now() - state.lastBoost > spacejet.BOOST_COOLDOWN
            if(canBoost) {
                state.isBoosting = true;
                state.boostStart = performance.now()

                // update sprite
                const sprite = spacejet.render.sprite
                if(!sprite) return;
                sprite.texture = 'body/spacejet_boost.png'
                return;
            }
        }

        if(state.isBoosting) {
            const shouldEnd = performance.now() - state.boostStart > spacejet.BOOST_DURATION
            if(shouldEnd || !state.boost) {
                state.isBoosting = false;
                state.lastBoost = performance.now()

                // update sprite
                const sprite = spacejet.render.sprite
                if(!sprite) return;
                sprite.texture = 'body/spacejet.png'
                return;
            }
        }
    }

    handleMovement(spacejet: Spacejet, state: SpacejetState) {

        const angle = spacejet.angle;
        let velocity = spacejet.velocity;
        const multiply = (state.isBoosting ? spacejet.BOOST_MULTIPLY : 1)
        const movementIncrement = spacejet.MOVEMENT_INCREMENT * multiply

        // damp if over speed cap
        const currentSpeed = Vector.magnitude(velocity)
        const maxSpeed = spacejet.MAX_SPEED * multiply

        if(currentSpeed > maxSpeed) {
            const force = Vector.mult(Vector.neg(velocity), spacejet.DAMPING_FORCE)
            Body.applyForce(spacejet, spacejet.position, force)
        }
        
        // update movement
        velocity = spacejet.velocity;

        if(state.forward) {
            Body.setVelocity(spacejet, {
                x: velocity.x + Math.cos(angle) * movementIncrement,
                y: velocity.y + Math.sin(angle) * movementIncrement
            })
        }

        if(state.backward) {
            Body.setVelocity(spacejet, {
                x: velocity.x - Math.cos(angle) * (movementIncrement/2),
                y: velocity.y - Math.sin(angle) * (movementIncrement/2)
            })
        }

        if(state.left) {
            Body.setAngle(spacejet, angle - spacejet.ANGLE_INCREMENT)
        }

        if(state.right) {
            Body.setAngle(spacejet, angle + spacejet.ANGLE_INCREMENT)
        }

    }

    handleShooting(spacejet: Spacejet, state: SpacejetState) {
        const allowedToFire = performance.now() - (1000/spacejet.FIRERATE) > state.lastTimeShot
        if(!state.shooting || !allowedToFire || state.isReloading || spacejet.ammo == 0) return;

        // fire
        const velocity = spacejet.velocity;
        const angle = spacejet.angle;
        const x = spacejet.position.x + Math.cos(angle) * (375 * spacejet.SCALE)
        const y = spacejet.position.y + Math.sin(angle) * (375 * spacejet.SCALE)

        const bullet = createBullet(x, y, angle, spacejet)
        Body.setVelocity(bullet, {
            x: Math.cos(angle) * bullet.BASE_SPEED + velocity.x,
            y: Math.sin(angle) * bullet.BASE_SPEED + velocity.y
        })
        this.bodyManager.addBullet(bullet)

        state.lastTimeShot = performance.now()
        spacejet.ammo--;

        // empty ammo -> start relaod
        if(spacejet.ammo == 0) {
            state.isReloading = true;
            setTimeout(() => {
                state.isReloading = false;
                spacejet.ammo = spacejet.BASE_AMMO;
            }, spacejet.RELOAD_TIME)
        }
    }

    handleDamage(spacejet: Spacejet, damage: number, owner?: Spacejet) {   
        // TODO: test
        if(spacejet.shield > 0) {
            spacejet.shield -= damage;
            damage = spacejet.shield < 0 ? -spacejet.shield : 0
            if(spacejet.shield < 0) spacejet.shield = 0;
        }

        spacejet.health -= damage;
        if(spacejet.health > 0) return;
        this.bodyManager.removeSpacejet(spacejet)
        if(!owner) return;
        owner.kills++;
    }

}





import { Bodies, Vector } from "matter-js";
import { CustomEntityManager, Entity, EntityManager, EntityType, createEntity } from "./entity";
import { SpriteRender } from "../custom_body";
import { BulletType } from "../bullets/bullet";


export interface Spacejet extends Entity<'spacejet'> {
    state: SpacejetState
    shield: number
    health: number
    ammo: number
    kills: number

    SCALE: number
    HITBOX: Vector[][]

    MAX_SPEED: number
    SPEED_INCREMENT: number
    ANGLE_INCREMENT: number
    DAMPING_FORCE: number

    BOOST_MULTIPLY: number
    BOOST_DURATION: number
    BOOST_COOLDOWN: number

    FIRERATE: number
    RELOAD_TIME: number
    BULLET_TYPE: BulletType

    BASE_SHIELD: number
    BASE_HEALTH: number
    BASE_AMMO: number
    MAX_SHIELD: number
    MAX_HEALTH: number
    MAX_AMMO: number
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

    const sprite: SpriteRender = {
        texture: 'body/spacejet.png',
        xScale: SCALE,
        yScale: SCALE,
        xOffset: -50 * SCALE,
        yOffset: 0
    }

    const body = Bodies.fromVertices(x, y, HITBOX, {
        torque: 0,
        inertia: Infinity,
        density: 0.005,
        render: {
            sprite
        }
    })

    const spacejet = <Spacejet> createEntity('spacejet', body) 
    
    spacejet.SCALE = SCALE;
    spacejet.HITBOX = HITBOX;

    spacejet.MAX_SPEED = 10;
    spacejet.SPEED_INCREMENT = 0.25;
    spacejet.ANGLE_INCREMENT = Math.PI/48
    spacejet.DAMPING_FORCE = 0.005;

    spacejet.BOOST_COOLDOWN = 2500
    spacejet.BOOST_MULTIPLY = 2
    spacejet.BOOST_DURATION = 500

    spacejet.FIRERATE = 10;
    spacejet.RELOAD_TIME = 1000;
    // spacejet.BULLET_TYPE = ...

    spacejet.BASE_SHIELD = 0;
    spacejet.BASE_HEALTH = 100;
    spacejet.BASE_AMMO = 10;
    spacejet.MAX_SHIELD = 50;
    spacejet.MAX_HEALTH = 100;
    spacejet.MAX_AMMO = 10;

    spacejet.state = new SpacejetState(spacejet)
    spacejet.shield = spacejet.BASE_SHIELD;
    spacejet.health = spacejet.BASE_HEALTH;
    spacejet.ammo = spacejet.BASE_AMMO;
    spacejet.kills = 0;

    return spacejet;
}

export class SpacejetState {

    spacejet: Spacejet

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

export class SpacejetManager implements CustomEntityManager {
    
    manager: EntityManager

    constructor(manager: EntityManager) {
        this.manager = manager;
    }

    isType(entity: Entity<EntityType>): entity is Spacejet {
        return entity.entityType == 'spacejet'
    }

    manage(entity: Entity<EntityType>): void {
        const spacejet = <Spacejet> entity;
        const state = spacejet.state;
        this.handleBoost(spacejet, state);
        this.handleMovement(spacejet, state);
        this.handleShooting(spacejet, state);
    }

    handleBoost(spacejet: Spacejet, state: SpacejetState) {

    }

    handleMovement(spacejet: Spacejet, state: SpacejetState) {

    }

    handleShooting(spacejet: Spacejet, state: SpacejetState) {

    }

    handleDamage(entity: Entity<EntityType>) {

        this.manager.remove(entity)
    }
}
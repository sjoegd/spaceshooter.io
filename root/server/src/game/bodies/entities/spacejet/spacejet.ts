import { Bodies, Body, Vector } from "matter-js";
import { CustomEntityManager, Entity, EntityManager, createEntity } from "../entity";
import { BulletType, createBullet } from "../../bullets/bullet";
import { Spaceshooter } from "../../../creatures/spaceshooters/spaceshooter";
import { SpriteRender } from "../../../../../../types/render_types";

export interface Spacejet extends Entity<'spacejet'> {
    owner: Spaceshooter
    state: SpacejetState
    spacejetType: SpacejetType
    shield: number
    health: number
    ammo: number
    kills: number
}

export interface SpacejetType {
    SCALE: number
    HITBOX: Vector[][]
    BASE_TEXTURE: string
    BOOST_TEXTURE: string
    SPRITE: SpriteRender

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

export function createSpacejet(x: number, y: number, type: SpacejetType, owner: Spaceshooter): Spacejet {

    const body = Bodies.fromVertices(x, y, type.HITBOX, {
        torque: 0,
        inertia: Infinity,
        density: 0.005,
        render: {
            sprite: type.SPRITE
        }
    })

    const spacejet = <Spacejet> createEntity(body, 'spacejet') 

    spacejet.owner = owner;
    spacejet.state = new SpacejetState(spacejet)
    spacejet.spacejetType = type;
    spacejet.shield = type.BASE_SHIELD;
    spacejet.health = type.BASE_HEALTH;
    spacejet.ammo = type.BASE_AMMO;
    spacejet.kills = 0;

    return spacejet;
}

export class SpacejetManager implements CustomEntityManager<Spacejet> {
    
    entityManager: EntityManager

    entities: Spacejet[] = []

    constructor(manager: EntityManager) {
        this.entityManager = manager;
    }

    manage() {
        for(const spacejet of this.entities) {
            this.manageSpacejet(spacejet)
        }
    }

    manageSpacejet(spacejet: Spacejet) {
        const state = spacejet.state;
        this.handleBoost(spacejet, state)
        this.handleMovement(spacejet, state)
        this.handleShooting(spacejet, state)
    }

    add(entity: Entity<String>) {
        if(!this.isType(entity)) return;
        this.entities.push(entity)
    }

    remove(entity: Entity<String>) {
        if(!this.isType(entity)) return;
        this.entities = this.entities.filter(e => e.id != entity.id)
    }

    handleBoost(spacejet: Spacejet, state: SpacejetState) {
        // check if correct
        if(state.boost && !state.isBoosting) {
            const canBoost = performance.now() - state.lastBoost > spacejet.spacejetType.BOOST_COOLDOWN
            if(canBoost) {
                state.isBoosting = true;
                state.boostStart = performance.now()

                // update sprite
                const sprite = spacejet.render.sprite
                if(!sprite) return;
                sprite.texture = spacejet.spacejetType.BOOST_TEXTURE
                return;
            }
        }

        if(state.isBoosting) {
            const shouldEnd = performance.now() - state.boostStart > spacejet.spacejetType.BOOST_DURATION
            if(shouldEnd || !state.boost) {
                state.isBoosting = false;
                state.lastBoost = performance.now()

                // update sprite
                const sprite = spacejet.render.sprite
                if(!sprite) return;
                sprite.texture = spacejet.spacejetType.BASE_TEXTURE
                return;
            }
        }
    }

    handleMovement(spacejet: Spacejet, state: SpacejetState) {
        // check if correct
        const angle = spacejet.angle;
        let velocity = spacejet.velocity;
        const multiply = (state.isBoosting ? spacejet.spacejetType.BOOST_MULTIPLY : 1)
        const speedIncrement = spacejet.spacejetType.SPEED_INCREMENT * multiply

        // damp if over speed cap
        const currentSpeed = Vector.magnitude(velocity)
        const maxSpeed = spacejet.spacejetType.MAX_SPEED * multiply

        if(currentSpeed > maxSpeed) {
            const force = Vector.mult(Vector.neg(velocity), spacejet.spacejetType.DAMPING_FORCE)
            Body.applyForce(spacejet, spacejet.position, force)
        }
        
        // update movement
        velocity = spacejet.velocity;

        if(state.forward) {
            Body.setVelocity(spacejet, {
                x: velocity.x + Math.cos(angle) * speedIncrement,
                y: velocity.y + Math.sin(angle) * speedIncrement
            })
        }

        if(state.backward) {
            Body.setVelocity(spacejet, {
                x: velocity.x - Math.cos(angle) * (speedIncrement/2),
                y: velocity.y - Math.sin(angle) * (speedIncrement/2)
            })
        }

        if(state.left) {
            Body.setAngle(spacejet, angle - spacejet.spacejetType.ANGLE_INCREMENT)
        }

        if(state.right) {
            Body.setAngle(spacejet, angle + spacejet.spacejetType.ANGLE_INCREMENT)
        }
    }

    handleShooting(spacejet: Spacejet, state: SpacejetState) {
        // check if correct
        const allowedToFire = performance.now() - (1000/spacejet.spacejetType.FIRERATE) > state.lastTimeShot
        if(!state.shooting || !allowedToFire || state.isReloading || spacejet.ammo == 0) return;

        // fire
        const velocity = spacejet.velocity;
        const angle = spacejet.angle;
        const x = spacejet.position.x + Math.cos(angle) * (375 * spacejet.spacejetType.SCALE)
        const y = spacejet.position.y + Math.sin(angle) * (375 * spacejet.spacejetType.SCALE)

        const bullet = createBullet(x, y, angle, spacejet.spacejetType.BULLET_TYPE, spacejet)
        Body.setVelocity(bullet, {
            x: Math.cos(angle) * bullet.bulletType.baseSpeed + velocity.x,
            y: Math.sin(angle) * bullet.bulletType.baseSpeed + velocity.y
        })
        this.entityManager.bodyManager.addBody(bullet)

        state.lastTimeShot = performance.now()
        spacejet.ammo--;
        spacejet.owner.onEntityStateUpdate({update: 'ammo', value: spacejet.ammo})

        // empty ammo -> start relaod
        if(spacejet.ammo == 0) {
            state.isReloading = true;
            setTimeout(() => {
                state.isReloading = false;
                spacejet.ammo = spacejet.spacejetType.BASE_AMMO;
                spacejet.owner.onEntityStateUpdate({update: 'ammo', value: spacejet.ammo})
            }, spacejet.spacejetType.RELOAD_TIME)
        }
    }

    isType(entity: Entity<String>): entity is Spacejet {
        return entity.entityType == 'spacejet'
    }
}
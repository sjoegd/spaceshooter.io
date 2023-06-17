import { Body, Vector, World } from 'matter-js';

import { CustomBody } from '../../custom-body/custom-body';
import { BodyFactory } from '../../factory/body-factory';
import { BodySpawner } from '../../spawner/body-spawner';
import { GameManager } from '../game-manager';
import { BulletManager } from './bullet/bullet-manager';
import { EntityManagers } from './entity/entity-manager';
import { SpacejetManager } from './entity/spacejet-manager';
import { AsteroidManager } from './obstacle/asteroid-manager';
import { BlackholeManager } from './obstacle/blackhole-manager';
import { ObstacleManagers } from './obstacle/obstacle-manager';
import { PowerupManager } from './powerup/powerup-manager';

export class BodyManager {

    gameManager: GameManager

    bulletManager: BulletManager
    powerupManager: PowerupManager
    entityManagers: EntityManagers
    obstacleManagers: ObstacleManagers

    factory: BodyFactory
    spawner: BodySpawner

    customBodies: CustomBody[] = []
    
    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;

        this.bulletManager = new BulletManager(this)
        this.powerupManager = new PowerupManager(this)
        this.entityManagers = {
            spacejetManager: new SpacejetManager(this)
        }
        this.obstacleManagers = {
            asteroidManager: new AsteroidManager(this),
            blackholeManager: new BlackholeManager(this)
        }

        this.factory = new BodyFactory(this)
        this.spawner = new BodySpawner(this)
    }

    manageBodies() {
        this.spawner.manageSpawning()
        for(const body of this.customBodies) {
            body.manage()
        }
    }

    addCustomBody(body: CustomBody) {
        this.customBodies.push(body)
        this.spawner.onSpawn(body)
        World.addBody(this.gameManager.physicsEngine.world, body);
    }

    removeCustomBody(body: CustomBody) {
        this.customBodies = this.customBodies.filter(b => b.id !== body.id)
        this.spawner.onDespawn(body)
        World.remove(this.gameManager.physicsEngine.world, body, true)
    }

    sortBody(a: Body, b: Body) {
        const a_c = <CustomBody> a;
        const b_c = <CustomBody> b;
        a_c.z_index = a_c.z_index ?? -1;
        b_c.z_index = b_c.z_index ?? -1;
        return a_c.z_index - b_c.z_index
    }

    calculateCrashDamage(source: CustomBody, target: CustomBody) {
        const velocityDifference = Vector.sub(target.velocity, source.velocity)
        const speedDifference = Vector.magnitude(velocityDifference)
        const damage = (source.mass / target.mass) * speedDifference
        return damage;
    }
}

export interface CustomBodyManager<BodyType extends CustomBody> {
    bodyManager: BodyManager
    manageBody: (body: CustomBody) => void
    isBodyType: (body: CustomBody) => body is BodyType
    onCollision: (source: CustomBody, target: CustomBody) => void
}
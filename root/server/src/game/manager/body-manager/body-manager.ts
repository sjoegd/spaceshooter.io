import { CustomBody } from '../../custom-body/custom-body';
import { GameManager } from '../game-manager';
import { BulletManager } from './bullet/bullet-manager';
import { EntityManager, EntityManagers } from './entity/entity-manager';
import { PowerupManager } from './powerup/powerup-manager';
import { ObstacleManagers } from './obstacle/obstacle-manager';
import { AsteroidManager } from './obstacle/asteroid-manager';
import { BlackholeManager } from './obstacle/blackhole-manager';
import { SpacejetManager } from './entity/spacejet-manager';
import { BodyFactory } from '../../factory/body-factory';

export class BodyManager {

    gameManager: GameManager

    bulletManager: BulletManager
    powerupManager: PowerupManager
    entityManagers: EntityManagers
    obstacleManagers: ObstacleManagers

    factory: BodyFactory

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
    }

    manageBodies() {
        for(const body of this.customBodies) {
            body.manage()
        }
    }

    addCustomBody(body: CustomBody) {
        this.customBodies.push(body)
    }

    removeCustomBody(body: CustomBody) {
        this.customBodies = this.customBodies.filter(b => b.id !== body.id)
    }
}

export interface CustomBodyManager<BodyType extends CustomBody> {
    bodyManager: BodyManager
    manageBody: (body: CustomBody) => void
    isBodyType: (body: CustomBody) => body is BodyType
    onCollision: (source: CustomBody, target: CustomBody) => void
}
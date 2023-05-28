import { GameManager } from "./game_manager";
import { PowerupManager } from '../bodies/powerups/powerup';
import { ObstacleManager } from "../bodies/obstacles/obstacle";
import { EntityManager } from "../bodies/entities/entity";
import { BulletManager } from "../bodies/bullets/bullet";
import { CustomBody, CustomBodyManager, BodyType } from "../bodies/custom_body";

export class BodyManager {
    
    manager: GameManager;

    managers: CustomBodyManager[]
    powerupManager: PowerupManager
    obstacleManager: ObstacleManager
    entityManager: EntityManager
    bulletManager: BulletManager

    bodies: CustomBody<BodyType>[] = []

    constructor(manager: GameManager) {
        this.manager = manager;
        this.powerupManager = new PowerupManager(this)
        this.obstacleManager = new ObstacleManager(this)
        this.entityManager = new EntityManager(this)
        this.bulletManager = new BulletManager(this)
        this.managers = [this.powerupManager, this.obstacleManager, this.entityManager, this.bulletManager]
    }

    setup() {
        this.createBodies()
    }

    createBodies() {

    }

    manageBodies() {
        for(const body of this.bodies) {
            for(const manager of this.managers) {
                if(!manager.isType(body)) continue;
                manager.manage(body)
            }
        }
    }

    addBody(body: CustomBody<BodyType>) {
        this.bodies.push(body)
    }

    removeBody(body: CustomBody<BodyType>) {
        this.bodies = this.bodies.filter(b => b.id !== body.id)
    }
}
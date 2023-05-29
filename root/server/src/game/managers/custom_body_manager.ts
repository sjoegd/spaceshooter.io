import { GameManager } from "./game_manager";
import { PowerupManager } from '../bodies/powerups/powerup';
import { ObstacleManager } from "../bodies/obstacles/obstacle";
import { EntityManager } from "../bodies/entities/entity";
import { BulletManager } from "../bodies/bullets/bullet";
import { CustomBody, CustomBodyManagers } from "../bodies/custom_body";
import { Vector, World } from "matter-js";

export class BodyManager {
    
    gameManager: GameManager;

    managers: CustomBodyManagers[]
    powerupManager: PowerupManager
    obstacleManager: ObstacleManager
    entityManager: EntityManager
    bulletManager: BulletManager

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;
        this.powerupManager = new PowerupManager(this)
        this.obstacleManager = new ObstacleManager(this)
        this.entityManager = new EntityManager(this)
        this.bulletManager = new BulletManager(this)
        this.managers = [this.powerupManager, this.obstacleManager, this.entityManager, this.bulletManager]
        this.createBodies()
    }

    createBodies() {
        // create obstacles and powerups
        this.obstacleManager.createObstacles()
        this.powerupManager.createPowerups()
    }

    manageBodies() {
        for(const manager of this.managers) {
            manager.manage()
        }
    }

    addBody(body: CustomBody<String>) {
        for(const manager of this.managers) {
            manager.add(body)
        }

        this.addBodyToWorld(body)
    }

    removeBody(body: CustomBody<String>) {
        for(const manager of this.managers) {
            manager.remove(body)
        }

        this.removeBodyFromWorld(body)
    }

    addBodyToWorld(body: CustomBody<String>) {
        World.add(this.gameManager.world, body)
    }

    removeBodyFromWorld(body: CustomBody<String>) {
        World.remove(this.gameManager.world, body)
    }

    createRandomPosition(): Vector {
        return this.gameManager.createRandomPosition()
    }
}
import { GameManager } from "../game_manager";
import { CustomBody, CustomBodyType } from '../../body/body';
import { PowerupManager } from "./powerup/powerup_manager";
import { ObstacleManager } from './obstacle/obstacle_manager';
import { EntityManager } from './entity/entity_manager';
import { BulletManager } from "./bullet/bullet_manager";
import { BodyFactory } from "../../factory/body_factory";
import { Vector, World } from "matter-js";
import { BodySpawner } from "../../spawner/body_spawner";

export class BodyManager {

    gameManager: GameManager

    powerupManager: PowerupManager
    obstacleManager: ObstacleManager 
    entityManager: EntityManager
    bulletManager: BulletManager

    factory: BodyFactory 
    spawner: BodySpawner

    bodies: CustomBody<CustomBodyType>[] = []

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;

        this.powerupManager = new PowerupManager(this)
        this.obstacleManager = new ObstacleManager(this)
        this.entityManager = new EntityManager(this)
        this.bulletManager = new BulletManager(this)
        
        this.factory = new BodyFactory(this)
        this.spawner = new BodySpawner(this)
    }

    manageBodies() {
        this.spawner.manageSpawning()
        for(const body of this.bodies) {
            body.manage()
        }
    }

    addBody(body: CustomBody<CustomBodyType>) {
        this.bodies.push(body)
        World.add(this.gameManager.engine.world, body)
    }

    removeBody(body: CustomBody<CustomBodyType>) {
        this.bodies = this.bodies.filter(b => b.id !== body.id)
        World.remove(this.gameManager.engine.world, body)
        this.spawner.onRemoveBody(body)
    }

    calculateCrashDamage(source: {mass: number, velocity: Vector}, target: {mass: number, velocity: Vector}) {
        const velocityDiff = Vector.sub(target.velocity, source.velocity)
        const speedDiff = Math.pow(Vector.magnitude(velocityDiff), 1.5)
        const damage = (Math.sqrt(source.mass) / target.mass) * speedDiff
        return damage;
    }
}

export interface CustomBodyManager<BodyType extends String> {
    bodyManager: BodyManager
    manageBody: (body: CustomBody<String>) => void
    isBodyType: (body: CustomBody<String>) => body is CustomBody<BodyType>
}
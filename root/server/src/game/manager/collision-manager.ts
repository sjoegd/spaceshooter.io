import { Body, Events } from 'matter-js';

import { CustomBody, isCustomBody } from '../custom-body/custom-body';
import { CustomBodyManager } from './body-manager/body-manager';
import { GameManager } from './game-manager';

export class CollisionManager {
    
    gameManager: GameManager

    collisionListeners: CustomBodyManager<CustomBody>[] = []

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;
        this.setupCollisionListeners()
        this.setupCollisionManagement()
    }

    setupCollisionListeners() {
        const bodyManager = this.gameManager.bodyManager;
        this.collisionListeners.push(
            bodyManager.powerupManager,
            bodyManager.bulletManager,
            bodyManager.entityManagers.spacejetManager,
            bodyManager.obstacleManagers.asteroidManager,
            bodyManager.obstacleManagers.blackholeManager
        )
    }

    setupCollisionManagement() {
        Events.on(this.gameManager.physicsEngine, 'collisionStart', (ev) => {

            for(let { bodyA, bodyB } of ev.pairs) {
                
                bodyA = bodyA == bodyA.parent ? bodyA : bodyA.parent
                bodyB = bodyB == bodyB.parent ? bodyB : bodyB.parent

                this.manageCollision(bodyA, bodyB)
                this.manageCollision(bodyB, bodyA)

            } 

        })
    }

    manageCollision(source: Body, target: Body) {

        if(!isCustomBody(source) || !isCustomBody(target)) return;

        for(const listener of this.collisionListeners) {
            listener.onCollision(source, target)
        }

    }

}
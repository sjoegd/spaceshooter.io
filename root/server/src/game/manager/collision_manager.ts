import { Body, Events } from 'matter-js';
import { GameManager } from './game_manager';
import { isBullet } from '../body/bullet/bullet';
import { isCustomBody } from '../body/body';
import { isEntity } from '../body/entity/entity';
import { isObstacle } from '../body/obstacle/obstacle';
import { isPowerup } from '../body/powerup/powerup';
import { isAsteroid } from '../body/obstacle/asteroid';
import { isBlackhole } from '../body/obstacle/blackhole';
import { isSpacejet } from '../body/entity/spacejet/spacejet';


export class CollisionManager {

    gameManager: GameManager

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;
        this.setupCollisionDetection()
    }

    setupCollisionDetection() {
        Events.on(this.gameManager.engine, 'collisionStart', (ev) => {
            const pairs = ev.pairs;
            for(let {bodyA, bodyB} of pairs) {

                // ensure correct body reference if body is part of composite
                bodyA = bodyA.parent == bodyA ? bodyA : bodyA.parent
                bodyB = bodyB.parent == bodyB ? bodyB : bodyB.parent

                this.handleCollision(bodyA, bodyB)
                this.handleCollision(bodyB, bodyA)
            }
        })
    }

    handleCollision(source: Body, target: Body) {

        /**
         * Important collisions:
         * Bullet -> Asteroid | Entity 
         * Bullet -> All 
         * Entity -> Asteroid | Entity | Powerup
         * Asteroid -> Entity 
         * Blackhole -> Asteroid | Entity
         * Blackhole -> All 
         */
        
        if(!isCustomBody(source) || !isCustomBody(target)) return;

        // source: Bullet
        if(isBullet(source)) {
            
            if(isAsteroid(target)) {
                this.gameManager.bodyManager.bulletManager.onAsteroidCollision(source, target)
            }

            if(isEntity(target)) {
                this.gameManager.bodyManager.bulletManager.onEntityCollision(source, target)
            }

            this.gameManager.bodyManager.bulletManager.onCollision(source)
        }

        // source: Entity
        if(isEntity(source)) {

            if(isAsteroid(target)) {
                this.gameManager.bodyManager.entityManager.onAsteroidCollision(source, target)
            }

            if(isEntity(target)) {
                this.gameManager.bodyManager.entityManager.onEntityCollision(source, target)
            }

            if(isPowerup(target)) {
                this.gameManager.bodyManager.entityManager.onPowerupCollision(source, target)
            }
        }

        // source: Asteroid
        if(isAsteroid(source)) {

            if(isEntity(target)) {
                this.gameManager.bodyManager.obstacleManager.asteroidManager.onEntityCollision(source, target)
            }
        }

        // source: Blackhole
        isBlackhole: if(isBlackhole(source)) {

            if(isAsteroid(target)) {
                this.gameManager.bodyManager.obstacleManager.blackholeManager.onAsteroidCollision(source, target)
                break isBlackhole;
            }


            if(isEntity(target)) {
                this.gameManager.bodyManager.obstacleManager.blackholeManager.onEntityCollision(source, target)
                break isBlackhole;
            }

            this.gameManager.bodyManager.obstacleManager.blackholeManager.onCollision(source, target)
        }
    }

}
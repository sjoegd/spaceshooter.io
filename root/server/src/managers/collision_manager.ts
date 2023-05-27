import { Body, Events, Vector } from "matter-js";
import GameEngine from "../game_engine";
import BodyManager from "./body_manager";
import { Bullet } from "../bodies/bullet";
import { Spacejet } from "../bodies/spacejet";
import { Obstacle } from "../bodies/obstacles/obstacle";
import { Powerup } from "../bodies/powerups/powerup";


export default class CollisionManager {

    gameEngine: GameEngine
    bodyManager: BodyManager

    constructor(gameEngine: GameEngine) {
        this.gameEngine = gameEngine;
        this.bodyManager = gameEngine.bodyManager;
    
        this.setup()
    }

    setup() {
        Events.on(this.gameEngine.engine, 'collisionStart', (ev) => this.manageCollision(ev))
    }

    manageCollision(ev: Matter.IEventCollision<Matter.Engine>) {
        for(const pair of ev.pairs) {
            let {bodyA, bodyB, contacts} = pair;

            const collisionPoints = contacts.map(c => c.vertex);
            const averageCollision = collisionPoints.reduce<{x: number, y: number}>(({x, y}, vertex) => ({x: x + vertex.x, y: y + vertex.y}), {x: 0, y: 0})
            averageCollision.x = averageCollision.x / collisionPoints.length;
            averageCollision.y = averageCollision.y / collisionPoints.length;

            // get the typing
            const bodyATypes = {
                isBullet: (<Bullet> bodyA).isBullet,
                isSpacejet: (<Spacejet> bodyA).isSpacejet,
            }

            const bodyBTypes = {
                isBullet: (<Bullet> bodyB).isBullet,
                isSpacejet: (<Spacejet> bodyB).isSpacejet,
            }

            // Bullet

            if(bodyATypes.isBullet) {
                this.manageBulletCollision(<Bullet> bodyA, bodyB)
            }

            if(bodyBTypes.isBullet) {
                this.manageBulletCollision(<Bullet> bodyB, bodyA)
            }

            // Spacejet

            if(bodyATypes.isSpacejet) {
                this.manageSpacejetCollision(<Spacejet> bodyA, bodyB)
            }

            if(bodyBTypes.isSpacejet) {
                this.manageSpacejetCollision(<Spacejet> bodyB, bodyA)
            }

        }
    }

    manageBulletCollision(bullet: Bullet, body: Body) {
        // for if bullet hits spacejet or obstacle
        if((<Spacejet> body).isSpacejet) {
            this.bodyManager.onBulletHitsSpacejet(bullet, <Spacejet> body)
        }

        if((<Obstacle> body).isObstacle) {
            this.bodyManager.onBulletHitsObstacle(bullet, <Obstacle> body)
        }

        this.bodyManager.removeBullet(bullet);
    }

    manageSpacejetCollision(spacejet: Spacejet, body: Body) {
        // for if spacejet hits powerup or obstacle
        if((<Powerup> body).isPowerup) {
            this.bodyManager.onSpacejetHitsPowerup(spacejet, <Powerup> body)
        }
        
        if((<Obstacle> body).isObstacle) {
            this.bodyManager.onSpacejetHitsObstacle(spacejet, <Obstacle> body)
        }
    }

}
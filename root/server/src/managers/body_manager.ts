import { Body, Events, Vector, World } from "matter-js";
import GameEngine from "../game_engine";
import { Spacejet, SpacejetManager } from "../bodies/spacejet";
import { Bullet, BulletManager } from "../bodies/bullet";
import { Obstacle, ObstacleManager } from "../bodies/obstacles/obstacle";
import { Powerup, PowerupManager } from "../bodies/powerups/powerup";

export default class BodyManager {

    gameEngine: GameEngine
    world: World

    spacejetManager: SpacejetManager
    bulletManager: BulletManager 
    obstacleManager: ObstacleManager
    powerupManager: PowerupManager

    spacejets: Spacejet[] = []
    bullets: Bullet[] = []

    constructor(gameEngine: GameEngine) {
        this.gameEngine = gameEngine;
        this.world = gameEngine.engine.world;
        this.spacejetManager = new SpacejetManager(this);
        this.bulletManager = new BulletManager(this);
        this.obstacleManager = new ObstacleManager(this, 50);
        this.powerupManager = new PowerupManager(this, 5);
        this.setup()
    }

    setup() {
        Events.on(this.gameEngine.engine, 'beforeUpdate', () => {
            this.manageBodies()
        });
    }

    setupWorld() {
        this.obstacleManager.createObstacles()
        this.powerupManager.createPowerups()
    }

    manageBodies() {
        this.manageSpacejets()
        this.manageBullets()
        this.obstacleManager.manageObstacles()
        this.powerupManager.managePowerups()
    }

    manageSpacejets() {
        for(const spacejet of this.spacejets) {
            this.spacejetManager.manageSpacejet(spacejet)
        }
    }

    manageBullets() {
        for(const bullet of this.bullets) {
            this.bulletManager.manageBullet(bullet)
        }
    }

    addSpacejet(spacejet: Spacejet) {
        this.spacejets.push(spacejet)
        World.add(this.world, spacejet)
    }

    removeSpacejet(spacejet: Spacejet) {
        this.spacejets = this.spacejets.filter(s => s.id !== spacejet.id)
        World.remove(this.world, spacejet)
    }

    addBullet(bullet: Bullet) {
        this.bullets.push(bullet)
        World.add(this.world, bullet)
    }

    removeBullet(bullet: Bullet) {
        this.bullets = this.bullets.filter(b => b.id !== bullet.id)
        World.remove(this.world, bullet)
    }

    onBulletHitsSpacejet(bullet: Bullet, spacejet: Spacejet) {
        if(bullet.owner.id == spacejet.id) return;
        this.spacejetManager.handleDamage(spacejet, bullet.DAMAGE, bullet.owner)
    }

    onBulletHitsObstacle(bullet: Bullet, obstacle: Obstacle) {
        this.obstacleManager.handleDamage(obstacle, bullet.DAMAGE, bullet.owner)
    }

    onSpacejetHitsPowerup(spacejet: Spacejet, powerup: Powerup) {
        this.powerupManager.onSpacejetHitsPowerup(spacejet, powerup)
    }

    onSpacejetHitsObstacle(spacejet: Spacejet, obstacle: Obstacle) {
        const velocityDiff = Vector.sub(spacejet.velocity, obstacle.velocity)
        let speedDiff = Vector.magnitude(velocityDiff)
        speedDiff = speedDiff * Math.sqrt(speedDiff)
        const damage = (Math.sqrt(obstacle.mass) / spacejet.mass) * obstacle.baseDamage * speedDiff
        this.spacejetManager.handleDamage(spacejet, damage)
    }

}
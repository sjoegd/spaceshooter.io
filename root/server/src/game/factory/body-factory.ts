import { BodyManager } from '../manager/body-manager/body-manager';
import { createBullet, BulletOptions } from '../custom-body/bullet/bullet';
import { SpacejetOptions, createSpacejet } from '../custom-body/entity/spacejet/spacejet';
import { createAsteroid, AsteroidOptions } from '../custom-body/obstacle/asteroid';
import { createBlackhole, BlackholeOptions } from '../custom-body/obstacle/blackhole';
import { createPowerup, PowerupOptions } from '../custom-body/powerup/powerup';

export class BodyFactory {

    bodyManager: BodyManager

    constructor(bodyManager: BodyManager) {
        this.bodyManager = bodyManager;
    }

    createBullet(x: number, y: number, options: BulletOptions) {
        const bullet = createBullet(x, y, this.bodyManager.bulletManager, options)
        this.bodyManager.addCustomBody(bullet)
        return bullet;
    }

    createSpacejet(x: number, y: number, options: SpacejetOptions) {
        const spacejet = createSpacejet(x, y, this.bodyManager.entityManagers.spacejetManager, options)
        this.bodyManager.addCustomBody(spacejet)
        return spacejet;
    }

    createAsteroid(x: number, y: number, options: AsteroidOptions) {
        const asteroid = createAsteroid(x, y, this.bodyManager.obstacleManagers.asteroidManager, options)
        this.bodyManager.addCustomBody(asteroid)
        return asteroid
    }

    createBlackhole(x: number, y: number, options: BlackholeOptions) {
        const blackhole = createBlackhole(x, y, this.bodyManager.obstacleManagers.blackholeManager, options)
        this.bodyManager.addCustomBody(blackhole)
        return blackhole
    }
    
    createPowerup(x: number, y: number, options: PowerupOptions) {
        const powerup = createPowerup(x, y, this.bodyManager.powerupManager, options)
        this.bodyManager.addCustomBody(powerup)
        return powerup
    }

}
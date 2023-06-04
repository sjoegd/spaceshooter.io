import { BodyManager } from "../manager/body_manager/body_manager";
import { Powerup, PowerupEffect, createPowerup } from "../body/powerup/powerup";
import { BulletOptions, createBullet } from '../body/bullet/bullet';
import { createSpacejet } from '../body/entity/spacejet/spacejet';
import { AsteroidOptions, createAsteroid } from '../body/obstacle/asteroid';
import { BlackholeOptions, createBlackhole } from "../body/obstacle/blackhole";
import { SpacejetSettingsType, createSpacejetSettings } from "../body/entity/spacejet/settings/spacejet_settings";

export class BodyFactory {

    bodyManager: BodyManager

    constructor(bodyManager: BodyManager) {
        this.bodyManager = bodyManager;
    }

    createPowerup(x: number, y: number, effect: PowerupEffect): Powerup {
        const powerup = createPowerup(x, y, effect, this.bodyManager.powerupManager)
        this.bodyManager.addBody(powerup)
        return powerup;
    }

    createBullet(x: number, y: number, options: BulletOptions) {
        const bullet = createBullet(x, y, options, this.bodyManager.bulletManager)
        this.bodyManager.addBody(bullet)
        return bullet;
    }

    createSpacejet(x: number, y: number, settingsType: SpacejetSettingsType) {
        const spacejetManager = this.bodyManager.entityManager.spacejetManager
        const spacejet = createSpacejet(x, y, createSpacejetSettings(settingsType, spacejetManager), spacejetManager)
        this.bodyManager.addBody(spacejet)

        return spacejet;
    }

    createAsteroid(x: number, y: number, options: AsteroidOptions) {
        const asteroid = createAsteroid(x, y, this.bodyManager.obstacleManager.asteroidManager, options)
        this.bodyManager.addBody(asteroid)
        return asteroid
    }

    createBlackhole(x: number, y: number, options: BlackholeOptions) {
        const blackhole = createBlackhole(x, y, this.bodyManager.obstacleManager.blackholeManager, options)
        this.bodyManager.addBody(blackhole)
        return blackhole
    }

}
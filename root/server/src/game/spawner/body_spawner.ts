import { Body, Events } from "matter-js";
import { PowerupEffect, isPowerup } from "../body/powerup/powerup";
import { BodyManager } from "../manager/body_manager/body_manager";
import { CustomBody, CustomBodyType } from "../body/body";
import { isBlackhole } from "../body/obstacle/blackhole";
import { isAsteroid } from "../body/obstacle/asteroid";
import inBetween from "../../util/in_between";

// TODO:
// Generalize
export class BodySpawner {
    
    bodyManager: BodyManager 

    powerups: number = 0;
    maxPowerups: number = 5;

    asteroidSpawnrate: number = 0.05;
    asteroids: number = 0;
    maxAsteroids: number = 25;

    blackholeSpawnrate: number = 0.01;
    blackholes: number = 0;
    maxBlackholes: number = 3;

    constructor(bodyManager: BodyManager) {
        this.bodyManager = bodyManager;
    }

    manageSpawning() {
        this.managePowerupSpawning()
        this.manageAsteroidSpawning()
        this.manageBlackholeSpawning()
    }

    onRemoveBody(body: CustomBody<CustomBodyType>) {
        if(isPowerup(body)) {
            this.powerups--;
        }

        if(isAsteroid(body)) {
            this.asteroids--;
        }

        if(isBlackhole(body)) {
            this.blackholes--;
        }
    }

    allowedToSpawn(chance: number, spawnRate: number) {
        return (chance > Math.random()) && (spawnRate > Math.random())
    }

    managePowerupSpawning() {
        const chance = 1 - (this.powerups / this.maxPowerups)
        const effect = this.bodyManager.powerupManager.getRandomEffect()
        const spawnRate = effect.spawnRate
        if(!this.allowedToSpawn(chance, spawnRate)) return;
        this.spawnPowerup(effect)
    }

    spawnPowerup(effect: PowerupEffect) {
        const {x, y} = this.bodyManager.gameManager.createRandomPosition()
        this.bodyManager.factory.createPowerup(x, y, effect)
        this.powerups++
    }

    manageAsteroidSpawning() {
        const chance = 1 - (this.asteroids / this.maxAsteroids)
        const spawnRate = this.asteroidSpawnrate
        if(!this.allowedToSpawn(chance, spawnRate)) return;
        this.spawnAsteroid()
    }

    spawnAsteroid() {
        const {x, y} = this.bodyManager.gameManager.createRandomPosition()
        this.bodyManager.factory.createAsteroid(x, y, {
            direction: {x: inBetween(-2, 2), y: inBetween(-2, 2)},
            size: inBetween(1, 2),
            spin: inBetween(0.5, 1)
        })
        this.asteroids++
    }

    manageBlackholeSpawning() {
        const chance = 1 - (this.blackholes / this.maxBlackholes)
        const spawnRate = this.blackholeSpawnrate
        if(!this.allowedToSpawn(chance, spawnRate)) return;
        this.spawnBlackhole()
    }

    spawnBlackhole() {
        const {x, y} = this.bodyManager.gameManager.createRandomPosition()
        this.bodyManager.factory.createBlackhole(x, y, {
            lifeTime: inBetween(10, 60),
            forceRadius: inBetween(2, 3),
            forceStrength: 1,
            size: inBetween(2, 4),
            spin: inBetween(1, 2)
        })
        this.blackholes++;
    }
}
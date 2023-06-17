import { CustomBody, isCustomBody } from "../custom-body/custom-body";
import { BodyManager } from "../manager/body-manager/body-manager";
import { isAsteroid } from '../custom-body/obstacle/asteroid';
import { BASE_TICK_RATE } from "../server-game-engine";
import inBetween from "../../util/in-between";
import { isBlackhole } from "../custom-body/obstacle/blackhole";
import { isPowerup } from "../custom-body/powerup/powerup";

interface BodySpawnInstance<BodyType extends CustomBody> {
    create: (x: number, y: number) => void
    isBodyType: (body: CustomBody) => body is BodyType
    spawnRate: number
    spawnAmount: number
    amount: number
}

interface Spawns {
    [id: string]: BodySpawnInstance<CustomBody>
}

export class BodySpawner {

    bodyManager: BodyManager
    baseSpawnRate: number = 1/BASE_TICK_RATE

    spawns: Spawns = {
        asteroid: {
            create: (x, y) => this.createRandomAsteroid(x, y),
            isBodyType: isAsteroid,
            spawnRate: 0.75,
            spawnAmount: 25,
            amount: 0
        },
        blackhole: {
            create: (x, y) => this.createRandomBlackhole(x, y),
            isBodyType: isBlackhole,
            spawnRate: 0.1,
            spawnAmount: 5,
            amount: 0
        },
        powerup: {
            create: (x, y) => this.createRandomPowerup(x, y),
            isBodyType: isPowerup,
            spawnRate: 0.2,
            spawnAmount: 5,
            amount: 0
        }
    }

    constructor(bodyManager: BodyManager) {
        this.bodyManager = bodyManager
    }

    manageSpawning() {  

        // This has some weird bug where sometimes randomly, a body is either not removed correctly or added twice
        // Since the total amount of bodies present in the physics engine is randomly higher than the amount states here
        // This is a temporary fix to make sure the amount is always correct
        // TODO: Fix this bug
        if(this.bodyManager.gameManager.getCurrentTick() % 1000 == 0) {
            for(const [key, spawn] of Object.entries(this.spawns)) {
                let total = 0;
                for(const body of this.bodyManager.gameManager.physicsEngine.world.bodies) {
                    if(!isCustomBody(body)) continue;
                    if(spawn.isBodyType(body)) total++
                }
                if(total !== spawn.amount) {
                    console.error(`BUG! type: ${key}, amount: ${spawn.amount} !== total: ${total}`)
                    spawn.amount = total;
                }
            }
        }

        for(const spawn of Object.values(this.spawns)) {
            this.manageSpawn(spawn)
        }
    }

    manageSpawn(spawn: BodySpawnInstance<CustomBody>) {
        if(spawn.amount >= spawn.spawnAmount) return;
        if(this.baseSpawnRate < Math.random()) return;
        if(spawn.spawnRate < Math.random()) return;

        const {x, y} = this.bodyManager.gameManager.createRandomPosition()
        spawn.create(x, y)
    }

    onSpawn(body: CustomBody) {
        for(const spawn of Object.values(this.spawns)) {
            if(spawn.isBodyType(body)) {
                spawn.amount++
            }
        }
    }

    onDespawn(body: CustomBody) {
        for(const spawn of Object.values(this.spawns)) {
            if(spawn.isBodyType(body)) {
                spawn.amount--
            }
        }
    }

    createRandomAsteroid(x: number, y: number) {
        this.bodyManager.factory.createAsteroid(x, y, {
            baseSpin: inBetween(0.01, 0.025),
            direction: {
                x: inBetween(-1, 1),
                y: inBetween(-1, 1)
            },
            size: inBetween(0.5, 1.5)
        })
    }

    createRandomBlackhole(x: number, y: number) {
        this.bodyManager.factory.createBlackhole(x, y, {
            baseSpin: inBetween(0.01, 0.05),
            forceRadius: inBetween(1, 1.25),
            forceStrength: inBetween(1, 1.5),
            size: inBetween(2, 4),
            lifeTime: inBetween(10, 30) * BASE_TICK_RATE
        })
    }

    createRandomPowerup(x: number, y: number) {
        const effect = this.bodyManager.powerupManager.getRandomEffect()
        this.bodyManager.factory.createPowerup(x, y, {
            effectBase: effect,
        })
    }

}
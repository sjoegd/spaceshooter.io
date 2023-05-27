import { Body, World } from "matter-js";
import BodyManager from "../../managers/body_manager";
import { Asteroid, AsteroidManager } from './asteroid';
import { Spacejet } from "../spacejet";
import between from "../../util/between";

export interface Obstacle extends Body {
    isObstacle: boolean
    health: number
    massToHealthRatio: number
    baseDamage: number
}

export type ObstacleType = 'asteroid'

export class ObstacleManager {

    TYPE_LIST: ObstacleType[] = [
        'asteroid'
    ]

    TYPE_CREATE = {
        asteroid: (x: number, y: number) => this.asteroidManager.createRandomAsteroid(x, y)
    }

    TYPE_SPAWN_RATE = {
        asteroid: 0.05
    }

    TYPE_CHECK = {
        asteroid: (obstacle: Obstacle) => (<Asteroid> obstacle).isAsteroid
    }

    TYPE_MANAGE = {
        asteroid: (obstacle: Obstacle) => this.asteroidManager.manageAsteroid(<Asteroid> obstacle)
    }

    bodyManager: BodyManager
    asteroidManager: AsteroidManager

    obstacles: Obstacle[] = []
    maxObstacles: number

    constructor(bodyManager: BodyManager, obstacles: number) {
        this.bodyManager = bodyManager; 
        this.asteroidManager = new AsteroidManager(this)
        this.maxObstacles = obstacles;
    }

    createObstacles() {
        const amount = this.maxObstacles;
        for(let i = 0; i < amount; i++) {
            const obstacle = this.createRandomObstacle(this.getRandomObstacleType())
            this.addObstacle(obstacle)
        }
    }

    getRandomObstacleType() {
        const i = Math.round(between(0, this.TYPE_LIST.length - 1))
        return this.TYPE_LIST[i]
    }

    createRandomObstacle(type: ObstacleType) {
        const {x, y} = this.bodyManager.gameEngine.getRandomPosition()
        return this.TYPE_CREATE[type](x, y)
    }

    manageObstacles() {
        this.manageObstacleSpawning()

        for(const obstacle of this.obstacles) {
            for(const type of this.TYPE_LIST) {
                if(!this.TYPE_CHECK[type](obstacle)) continue;
                this.TYPE_MANAGE[type](obstacle)
            }
        }
    }

    manageObstacleSpawning() {
        const chance = 1 - (this.obstacles.length / this.maxObstacles)
        if(chance < Math.random()) return;

        const type = this.getRandomObstacleType()
        if(this.TYPE_SPAWN_RATE[type] < Math.random()) return;

        const obstacle = this.createRandomObstacle(type)
        this.addObstacle(obstacle)
    }

    addObstacle(obstacle: Obstacle) {
        this.obstacles.push(obstacle)
        World.add(this.bodyManager.world, obstacle)
    }

    removeObstacle(obstacle: Obstacle) {
        this.obstacles = this.obstacles.filter(a => a.id !== obstacle.id)
        World.remove(this.bodyManager.world, obstacle)
    }

    handleDamage(obstacle: Obstacle, damage: number, owner?: Spacejet) {
        // TODO: Generalize
        if((<Asteroid> obstacle).isAsteroid) {
            this.asteroidManager.handleDamage(<Asteroid> obstacle, damage, owner)
        }
    }
}
import { Body, Vector } from "matter-js";
import { CustomBody } from "../../../body/body";
import { Obstacle, isObstacle } from "../../../body/obstacle/obstacle";
import { BodyManager, CustomBodyManager } from '../body_manager';
import { AsteroidManager } from "./asteroid_manager";
import { BlackholeManager } from "./blackhole_manager";

export class ObstacleManager implements CustomBodyManager<'obstacle'> {

    bodyManager: BodyManager;
    asteroidManager: AsteroidManager
    blackholeManager: BlackholeManager

    constructor(bodyManager: BodyManager) {
        this.bodyManager = bodyManager;
        this.asteroidManager = new AsteroidManager(this)
        this.blackholeManager = new  BlackholeManager(this)
    }

    manageBody(obstacle: CustomBody<String>) {
        if(!this.isBodyType(obstacle)) return;

        const speed = Vector.magnitude(obstacle.velocity) 
        const spin = obstacle.angularSpeed 

        if(speed < obstacle.baseSpeed) {
            if(speed == 0) {
                Body.applyForce(obstacle, obstacle.position, Vector.mult(obstacle.baseVelocity, obstacle.speedIncrement))
            } else {
                const scale = ((obstacle.baseSpeed - speed) / speed) * obstacle.speedIncrement
                Body.applyForce(obstacle, obstacle.position, Vector.mult(obstacle.velocity, scale))
            }
        }

        if(spin < obstacle.baseSpin) {
            if(spin == 0) {
                Body.setAngularVelocity(obstacle, obstacle.baseSpin * obstacle.spinIncrement)
            } else {
                const scale = ((obstacle.baseSpin - spin) / spin) * obstacle.spinIncrement
                Body.setAngularVelocity(obstacle, spin + spin*scale)
            }
        }
    }
    
    isBodyType(body: CustomBody<String>): body is Obstacle {
        return isObstacle(body)
    }
}

export interface CustomObstacleManager<CustomObstacle extends Obstacle> extends CustomBodyManager<'obstacle'> {
    obstacleManager: ObstacleManager
    manageObstacle: (obstacle: CustomObstacle) => void
    isObstacleType: (obstacle: Obstacle) => obstacle is CustomObstacle
}
import { Body, Vector } from 'matter-js';

import { CustomBody } from '../../../custom-body/custom-body';
import { isObstacle, Obstacle } from '../../../custom-body/obstacle/obstacle';
import { BodyManager, CustomBodyManager } from '../body-manager';
import { AsteroidManager } from './asteroid-manager';
import { BlackholeManager } from './blackhole-manager';

export class ObstacleManager implements CustomBodyManager<Obstacle> {
    
    bodyManager: BodyManager;

    constructor(bodyManager: BodyManager) {
        this.bodyManager = bodyManager;
    }

    manageBody(body: CustomBody) {
        if(!this.isBodyType(body)) return;
        this.manageObstacle(body)
    }

    manageObstacle(obstacle: Obstacle) {
        const speed = obstacle.speed;
        const spin = obstacle.angularSpeed;

        if(speed < obstacle.baseSpeed) {
            if(speed == 0) {
                Body.applyForce(obstacle, obstacle.position, Vector.mult(obstacle.baseVelocity, obstacle.speedIncrease))
            } else {
                const scale = ((obstacle.baseSpeed - speed) / speed) * obstacle.speedIncrease
                Body.applyForce(obstacle, obstacle.position, Vector.mult(obstacle.velocity, scale))
            }
        }

        if(spin < obstacle.baseSpin) {
            if(spin ==  0) {
                Body.setAngularVelocity(obstacle, obstacle.baseSpin * obstacle.spinIncrease)
            } else {
                const scale = ((obstacle.baseSpin - spin) / spin) * obstacle.spinIncrease
                Body.setAngularVelocity(obstacle, spin + spin*scale)
            }
        }
    }

    onCollision(source: CustomBody, _target: CustomBody) {
        if(!this.isBodyType(source)) return;
        // ...
    }

    isBodyType (body: CustomBody): body is Obstacle {
        return isObstacle(body)
    }
}

export interface ObstacleManagers {

    asteroidManager: AsteroidManager
    blackholeManager: BlackholeManager

}
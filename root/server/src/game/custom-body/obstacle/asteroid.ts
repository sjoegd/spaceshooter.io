import { AsteroidManager } from '../../manager/body-manager/obstacle/asteroid-manager';
import { Obstacle, isObstacle } from './obstacle';
import { CustomBody } from '../custom-body';

export interface Asteroid extends Obstacle {
    obstacleType: 'asteroid'
    manager: AsteroidManager
    hp: number
}

export function isAsteroid(body: CustomBody): body is Asteroid {
    if(!isObstacle(body)) return false
    return body.obstacleType == 'asteroid'
}

export interface AsteroidOptions {
    manager: AsteroidManager
}

export function createAsteroid(x: number, y: number, options: AsteroidOptions) {
    
}
import { Controller } from '../../../controller/controller';
import { Spaceshooter, isSpaceshooter } from '../../../controller/spaceshooter/spaceshooter';
import { ControllerManager, CustomControllerManager } from '../controller-manager';

type rewardAction =
    'enemyKill' |
    'asteroidDestroyed' |
    'tickSurvived' |
    'powerupTaken' |
    'damageTaken' |
    'damageDealt' |
    'death'

export class SpaceshooterManager implements CustomControllerManager<Spaceshooter> {
    
    controllerManager: ControllerManager;

    rewards = {
        'enemyKill': 500,
        'asteroidDestroyed': 0, // 0 till asteroids give something
        'tickSurvived': 0.1,
        'powerupTaken': 50,
        'damageTaken': -1,
        'damageDealt': 1,
        'death': -500
    }
    
    constructor(controllerManager: ControllerManager) {
        this.controllerManager = controllerManager;
    }

    manageControllerBeforeUpdate(spaceshooter: Controller) {
        if(!this.isControllerType(spaceshooter)) return;
        spaceshooter.handleInput()
        spaceshooter.onEntityTickSurvived()
    }

    manageControllerAfterUpdate(spaceshooter: Controller) {
        if(!this.isControllerType(spaceshooter)) return;
        spaceshooter.handleTickReward()
    }

    getReward(action: rewardAction) {
        return this.rewards[action]
    }

    isControllerType(controller: Controller): controller is Spaceshooter {
        return isSpaceshooter(controller)
    }
}
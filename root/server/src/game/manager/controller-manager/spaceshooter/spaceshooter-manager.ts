import { Controller } from '../../../controller/controller';
import { Spaceshooter, isSpaceshooter } from '../../../controller/spaceshooter/spaceshooter';
import { ControllerManager, CustomControllerManager } from '../controller-manager';

type rewardAction =
    'enemyKill' |
    'asteroidDestroyed' |
    'tickSurvived' |
    'powerupTaken' |
    'damageTaken' |
    'death'

export class SpaceshooterManager implements CustomControllerManager<Spaceshooter> {
    
    controllerManager: ControllerManager;

    // TODO
    rewards = {
        'enemyKill': 0,
        'asteroidDestroyed': 0,
        'tickSurvived': 0,
        'powerupTaken': 0,
        'damageTaken': 0,
        'death': 0
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
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
        'asteroidDestroyed': 0, 
        'tickSurvived': -0.1,
        'powerupTaken': 50,
        'damageTaken': -1,
        'damageDealt': 1,
        'death': -250
    }

    bodyID: {[id: string]: number} = {
        'nothing': 0,
        'blackhole': -1,
        'bullet': -0.66,
        'wall': -0.33,
        'asteroid': 0.33,
        'spacejet': 0.66,
        'powerup': 1,
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
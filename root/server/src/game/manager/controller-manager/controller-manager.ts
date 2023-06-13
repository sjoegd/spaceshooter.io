import { Events, Body } from 'matter-js';
import { GameManager } from '../game-manager';
import { CustomBody, isCustomBody } from '../../custom-body/custom-body';
import { CustomBodyManager } from '../body-manager/body-manager';
import { Controller } from '../../controller/controller';
import { SpaceshooterManager } from './spaceshooter/spaceshooter-manager';
import { isSpaceshooter } from '../../controller/spaceshooter/spaceshooter';
import { ControllerFactory } from '../../factory/controller-factory';

export class ControllerManager {

    gameManager: GameManager

    spaceshooterManager: SpaceshooterManager

    factory: ControllerFactory

    controllers: Controller[] = []

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;
        this.spaceshooterManager = new SpaceshooterManager(this)
        this.factory = new ControllerFactory(this)
    }

    manageControllersBeforeUpdate() {

        for(const controller of this.controllers) {
            controller.onBeforeUpdate()
        }

    }

    manageControllersAfterUpdate() {

        for(const controller of this.controllers) {
            controller.onAfterUpdate()
        }

    }

    addController(controller: Controller) {
        this.controllers.push(controller)
    }

    removeController(controller: Controller) {
        this.controllers = this.controllers.filter(c => c.id !== controller.id)
        this.gameManager.bodyManager.removeCustomBody(controller.entity)
    }
}

export interface CustomControllerManager<ControllerType extends Controller> {

    controllerManager: ControllerManager

    manageControllerBeforeUpdate: (controller: Controller) => void
    manageControllerAfterUpdate: (controller: Controller) => void

    isControllerType(controller: Controller): controller is ControllerType
}
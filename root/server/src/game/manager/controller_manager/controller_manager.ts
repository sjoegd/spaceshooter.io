import { Controller } from '../../controller/controller';
import { isSpacejetController } from '../../controller/spacejet/spacejet_controller';
import { ServerGameEngine } from '../../server_game_engine';
import { GameManager } from '../game_manager';
import { SpacejetControllerManager } from './spacejet_controller_manager';


export class ControllerManager {

    gameManager: GameManager

    spacejetControllerManager: SpacejetControllerManager

    controllers: Controller[] = []

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;
        this.spacejetControllerManager = new SpacejetControllerManager(this)
    }

    manageControllersBeforeUpdate() {
        
        for(const controller of this.controllers) {
            // handle inputs
            controller.handleInput()
            // ...
        }
        
    }
    
    manageControllersAfterUpdate() {
        
        for(const controller of this.controllers) {
            // handle spacejet controllers
            if(isSpacejetController(controller)) {
                this.spacejetControllerManager.manageControllerRewards(controller)
            }
            // ...
        }
        
    }
    
    addController(controller: Controller) {
        this.controllers.push(controller)
    }

    removeController(controller: Controller) {
        this.controllers = this.controllers.filter(c => c.entity.id !== controller.entity.id)
        this.gameManager.bodyManager.removeBody(controller.entity)
    }
}
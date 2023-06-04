import { Spacejet } from "../../body/entity/spacejet/spacejet";
import { ControllerManager } from "../../manager/controller_manager/controller_manager";
import { SpacejetControllerManager } from "../../manager/controller_manager/spacejet_controller_manager";
import { SpacejetController } from "./spacejet_controller";


export class RLAgent implements SpacejetController {
    
    spacejetControllerManager: SpacejetControllerManager
    controllerManager: ControllerManager
    entity: Spacejet;

    totalReward: number = 0;
    tickReward: number = 0;

    constructor(manager: SpacejetControllerManager, entity: Spacejet) {
        this.spacejetControllerManager = manager;
        this.controllerManager = manager.controllerManager;
        this.entity = entity;
        this.entity.controller = this;
    }

    handleInput() {

    }

    handleTickReward() {

    }

    onEnemyKill()  {

    }

    onAsteroidDestroyed(mass: number) {

    }

    onTickSurvived() {

    }

    onDamageTaken() {

    }

    onPowerupTaken() {

    }

    onEntityDeath() {

    }

}
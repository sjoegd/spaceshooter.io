import { Spacejet, isSpacejet } from "../../body/entity/spacejet/spacejet";
import { SpacejetControllerManager } from "../../manager/controller_manager/spacejet_controller_manager";
import { Controller } from "../controller";


export interface SpacejetController extends Controller {
    spacejetControllerManager: SpacejetControllerManager
    entity: Spacejet

    totalReward: number
    tickReward: number
    handleTickReward: () => void

    onEnemyKill: () => void
    onAsteroidDestroyed: (mass: number) => void
    onTickSurvived: () => void
}

export function isSpacejetController(controller: Controller): controller is SpacejetController {
    return isSpacejet(controller.entity)
}
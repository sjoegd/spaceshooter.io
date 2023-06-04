import { Entity } from "../body/entity/entity";
import { ControllerManager } from "../manager/controller_manager/controller_manager";


export interface Controller {
    controllerManager: ControllerManager
    entity: Entity
    
    onEntityDeath: () => void
    onDamageTaken: (damage: number) => void
    onPowerupTaken: () => void

    handleInput: () => void
}
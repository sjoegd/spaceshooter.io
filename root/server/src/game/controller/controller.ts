import { ControllerManager } from '../manager/controller-manager/controller-manager';
import { Entity } from '../custom-body/entity/entity';

export interface Controller {
    manager: ControllerManager
    entity: Entity

    onEntityDeath: () => void
    onEntityDamageTaken: (damage: number) => void
    onEntityPowerupTaken: () => void

    handleInput: () => void
}
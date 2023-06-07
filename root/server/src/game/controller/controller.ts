import { ControllerManager, CustomControllerManager } from '../manager/controller-manager/controller-manager';
import { Entity } from '../custom-body/entity/entity';
import { UUID } from 'crypto';

export interface Controller {
    manager: ControllerManager
    customManager: CustomControllerManager<Controller>
    entity: Entity
    id: UUID

    onEntityDeath: () => void
    onEntityDamageTaken: (damage: number) => void
    onEntityPowerupTaken: () => void

    onBeforeUpdate: () => void
    onAfterUpdate: () => void
}


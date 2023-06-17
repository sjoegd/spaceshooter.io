import { UUID } from 'crypto';

import { Entity } from '../custom-body/entity/entity';
import {
    ControllerManager, CustomControllerManager
} from '../manager/controller-manager/controller-manager';

export interface Controller {
    manager: ControllerManager
    customManager: CustomControllerManager<Controller>
    entity: Entity
    id: UUID

    onEntityDeath: () => void
    onEntityDamageTaken: (damage: number) => void
    onEntityDamageDealt: (damage: number) => void
    onEntityPowerupTaken: () => void

    onBeforeUpdate: () => void
    onAfterUpdate: () => void
}


import { Controller } from '../controller';
import { SpaceshooterManager } from '../../manager/controller-manager/spaceshooter/spaceshooter-manager';
import { Spacejet } from '../../custom-body/entity/spacejet/spacejet';

export interface Spaceshooter extends Controller {
    manager: SpaceshooterManager
    entity: Spacejet

    totalReward: number
    tickReward: number
    handleTickReward: () => void

    onEntityEnemyKill: () => void
    onEntityAsteroidDestroyed: (mass: number) => void
    onEntityTickSurvived: () => void
}
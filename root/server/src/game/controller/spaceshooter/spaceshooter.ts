import { Controller } from '../controller';
import { SpaceshooterManager } from '../../manager/controller-manager/spaceshooter/spaceshooter-manager';
import { Spacejet, isSpacejet } from '../../custom-body/entity/spacejet/spacejet';
import { ControllerManager } from '../../manager/controller-manager/controller-manager';
import { UUID, randomUUID } from 'crypto';

export abstract class Spaceshooter implements Controller {

    manager: ControllerManager;
    customManager: SpaceshooterManager;

    entity: Spacejet
    id: UUID = randomUUID()

    totalReward: number = 0;
    tickReward: number = 0;

    constructor(customManager: SpaceshooterManager, entity: Spacejet) {
        this.manager = customManager.controllerManager
        this.customManager = customManager
        this.entity = entity;
        this.entity.controller = this;
    }

    onBeforeUpdate() {
        this.customManager.manageControllerBeforeUpdate(this)
    }

    onAfterUpdate() {
        this.customManager.manageControllerAfterUpdate(this)
    }

    abstract handleInput(): void
    abstract handleTickReward(): void
    abstract onEntityDeath(): void
    abstract onEntityAmmoChange(): void
    
    onEntityEnemyKill(): void {
        const reward = this.customManager.getReward('enemyKill')
        this.tickReward += reward;
    }

    onEntityAsteroidDestroyed(mass: number): void {
        const rewardMultiplier = this.customManager.getReward('asteroidDestroyed')
        const reward = rewardMultiplier * mass
        this.tickReward += reward;
    }

    onEntityTickSurvived(): void {
        const reward = this.customManager.getReward('tickSurvived')
        this.tickReward += reward;
    }

    onEntityDamageTaken(damage: number): void {
        const rewardMultiplier = this.customManager.getReward('damageTaken')
        const reward = rewardMultiplier * damage;
        this.tickReward += reward;
    }

    onEntityDamageDealt(damage: number): void {
        const rewardMultiplier = this.customManager.getReward('damageDealt')
        const reward = rewardMultiplier * damage;
        this.tickReward += reward;
    }

    onEntityPowerupTaken(): void {
        const reward = this.customManager.getReward('powerupTaken')
        this.tickReward += reward;
    }
}

export function isSpaceshooter(controller: Controller): controller is Spaceshooter {
    return isSpacejet(controller.entity)
}


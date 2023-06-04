import { Spacejet } from "../../body/entity/spacejet/spacejet";
import { Bot } from "../../bot/bot";
import { ControllerManager } from "../../manager/controller_manager/controller_manager";
import { SpacejetControllerManager } from "../../manager/controller_manager/spacejet_controller_manager";
import { SpacejetController } from "./spacejet_controller";

export class RLAgent implements SpacejetController {
    
    static inputSize: number = 3; // todo
    static outputSize: number = 24; // 3 * 3 * 2 * 2
    
    spacejetControllerManager: SpacejetControllerManager
    controllerManager: ControllerManager
    entity: Spacejet;
    bot: Bot

    isDeath = false;

    totalReward: number = 0;
    tickReward: number = 0;

    constructor(manager: SpacejetControllerManager, entity: Spacejet, bot: Bot) {
        this.spacejetControllerManager = manager;
        this.controllerManager = manager.controllerManager;
        this.entity = entity;
        this.entity.controller = this;
        this.bot = bot;
        this.bot.agent = this;
    }

    handleInput() {
        const state = this.getStateInput()
        const action = this.bot.getAction(state)
        this.handleAction(action)
    }

    // todo
    getStateInput() {
        return [Math.random(), Math.random(), Math.random()]
    }

    // actions from 0 -> 23
    // hardcoded, could probably not be hardcoded
    handleAction(action: number) {
        switch(action) {
            case 0: // 
            case 1: //
            case 2: //
            case 3: //
            case 4: //
            case 5: //
            case 6: //
            case 7: //
            case 8: // 
            case 9: //
            case 10: // 
            case 11: //
            case 12: //
            case 13: //
            case 14: //
            case 15: //
            case 16: //
            case 17: //
            case 18: // 
            case 19: //
            case 20: // 
            case 21: //
            case 22: //
            case 23: //
        }
    }

    handleTickReward() {
        this.bot.giveReward(this.tickReward)
        this.totalReward += this.tickReward        
        this.tickReward = 0;

        if(this.isDeath) {
            this.bot.manager.giveNewRLAgent(this.bot)
        }
    }

    onEnemyKill()  {
        const reward = this.spacejetControllerManager.getReward('killEnemy')
        this.tickReward += reward;
    }

    onAsteroidDestroyed(mass: number) {
        const rewardMultiplier = this.spacejetControllerManager.getReward('destroyAsteroid')
        const reward = rewardMultiplier * mass
        this.tickReward += reward;
    }

    onTickSurvived() {
        const reward = this.spacejetControllerManager.getReward('surviveTick')
        this.tickReward += reward;
    }

    onDamageTaken(damage: number) {
        const rewardMultiplier = this.spacejetControllerManager.getReward('takeDamage')
        const reward = rewardMultiplier * damage;
        this.tickReward += reward;
    }

    onPowerupTaken() {
        const reward = this.spacejetControllerManager.getReward('takePowerup')
        this.tickReward += reward
    }

    onEntityDeath() {
        const reward = this.spacejetControllerManager.getReward('death')
        this.tickReward += reward;

        this.isDeath = true;
    }
}
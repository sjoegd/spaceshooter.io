import { Player } from '../../controller/spacejet/player';
import { SpacejetController } from '../../controller/spacejet/spacejet_controller';
import { ControllerManager } from './controller_manager';
import { PlayerSocket } from '../player_socket_manager';
import { RLAgent } from '../../controller/spacejet/rl_agent';
import { Bot } from '../../bot/bot';

type rewardAction =
    'killEnemy' |
    'destroyAsteroid' |
    'surviveTick' |
    'takePowerup' |
    'takeDamage' |
    'death'

export class SpacejetControllerManager {

    controllerManager: ControllerManager

    rewards = {
        'killEnemy': 1000,
        'destroyAsteroid': 0, // 0 till asteroids give something
        'surviveTick': 0,
        'takePowerup': 100,
        'takeDamage': -1,
        'death': -2000,
    }

    constructor(controllerManager: ControllerManager) {
        this.controllerManager = controllerManager;
    }

    manageControllerRewards(controller: SpacejetController) {
        controller.onTickSurvived()
        controller.handleTickReward()
    }

    createPlayer(playerSocket: PlayerSocket): Player {
        const {x, y} = this.controllerManager.gameManager.createRandomPosition()
        const spacejet = this.controllerManager.gameManager.bodyManager.factory.createSpacejet(x, y, 'base')
        const player = new Player(this, spacejet, playerSocket)
        return player;
    }
    
    createRLAgent(bot: Bot): RLAgent {
        const {x, y} = this.controllerManager.gameManager.createRandomPosition()
        const spacejet = this.controllerManager.gameManager.bodyManager.factory.createSpacejet(x, y, 'alien')
        const rlAgent = new RLAgent(this, spacejet, bot)
        return rlAgent
    }

    getReward(action: rewardAction) {
        return this.rewards[action]
    }
}
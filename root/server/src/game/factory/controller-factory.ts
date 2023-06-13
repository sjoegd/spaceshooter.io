import { Agent } from "../agent/agent";
import { Bot } from "../controller/spaceshooter/bot";
import { Player } from "../controller/spaceshooter/player";
import { ControllerManager } from "../manager/controller-manager/controller-manager";
import { GameSocket } from "../manager/socket-manager";

export class ControllerFactory {

    controllerManager: ControllerManager

    constructor(controllerManager: ControllerManager) {
        this.controllerManager = controllerManager;
    }

    createBot(agent: Agent, learn: boolean = false): Bot {
        const {x, y} = this.controllerManager.gameManager.createRandomPosition()
        const spacejet = this.controllerManager.gameManager.bodyManager.factory.createSpacejet(x, y, {
            spacejetPropertiesBase: learn ? 'special-alien' : 'alien'
        })
        const bot = new Bot(this.controllerManager.spaceshooterManager, spacejet, agent)
        this.controllerManager.addController(bot)
        return bot;
    }

    createPlayer(socket: GameSocket): Player {
        const {x, y} = this.controllerManager.gameManager.createRandomPosition()
        const spacejet = this.controllerManager.gameManager.bodyManager.factory.createSpacejet(x, y, {
            spacejetPropertiesBase: 'standard'
        })
        const player = new Player(this.controllerManager.spaceshooterManager, spacejet, socket)
        this.controllerManager.addController(player)
        return player
    }

}
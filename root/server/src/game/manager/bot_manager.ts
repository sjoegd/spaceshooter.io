import { ServerGameEngine } from "../server_game_engine";
import { Bot } from '../bot/bot';
import { TrainingBot } from "../bot/training_bot/training_bot";

export class BotManager {

    gameEngine: ServerGameEngine

    trainingBotAmount: number = 1

    bots: TrainingBot[] = []

    constructor(gameEngine: ServerGameEngine) {
        this.gameEngine = gameEngine;
        this.createBots()
    }

    exportBots() {
        for(const bot of this.bots) {
            bot.exportDQNAgent()
        }
    }

    addBot(bot: TrainingBot) {
        this.bots.push(bot)
    }

    removeBot(bot: TrainingBot) {
        this.bots = this.bots.filter(b => b.id !== bot.id)
    }

    createBots() {
        for(let i = 0; i < this.trainingBotAmount; i++) {
            const bot = this.createTrainingBot()
            this.addBot(bot)
        }
    }

    createTrainingBot() {
        const bot = new TrainingBot(this)
        this.giveNewRLAgent(bot)
        return bot
    }

    giveNewRLAgent(bot: Bot) {
        if(bot.agent) {
            this.gameEngine.gameManager.controllerManager.removeController(bot.agent)
        }    
        const RLAgent = this.gameEngine.gameManager.controllerManager.spacejetControllerManager.createRLAgent(bot)
        this.gameEngine.gameManager.controllerManager.addController(RLAgent)
    }
}
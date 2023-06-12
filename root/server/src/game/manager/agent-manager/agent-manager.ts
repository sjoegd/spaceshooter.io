import { GameManager } from '../game-manager';
import { AgentFactory } from '../../factory/agent-factory';
import { Agent } from '../../agent/agent';
import { Bot } from '../../controller/spaceshooter/bot';
import { LearningManager } from './learning-manager';
// @ts-ignore
import { DQNAgent } from "../../../../node_modules/@brain/rl/dist/rl.js"


export class AgentManager {

    gameManager: GameManager
    factory: AgentFactory
    learningManager: LearningManager

    agents: Agent[] = []

    constructor(gameManager: GameManager, amount: number = 0, learn: boolean = false) {
        this.gameManager = gameManager;
        this.factory = new AgentFactory(this);
        this.learningManager = new LearningManager(this);
        this.createAgents(amount, learn);

        if(learn) {
            console.log('Started learning')
        }
    }

    createAgents(amount: number, learn: boolean) {
        for(let i = 0; i < amount; i++) {
            this.factory.createAgent(this.createRandomModel(), i === 0 ? learn : false)
        }
    }

    manageAgents() {
        this.learningManager.manageLearning(this.agents)
        for(const agent of this.agents) {
            agent.manage()
        }
    }

    addAgent(agent: Agent) {
        this.agents.push(agent)
    }

    removeAgent(agent: Agent) {
        this.agents = this.agents.filter(a => a !== agent)
    }

    createNewBot(agent: Agent) {
        return this.gameManager.controllerManager.factory.createBot(agent)
    }

    removeBot(bot: Bot) {
        this.gameManager.controllerManager.removeController(bot)
    }

    createRandomModel() {
        const model = new DQNAgent({
            inputSize: Bot.stateSpace,
            outputSize: Bot.actionSpace,
            hiddenLayers: [16, 16],
        })

        return model.toJSON()
    }
}
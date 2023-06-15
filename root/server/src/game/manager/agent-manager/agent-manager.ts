import { GameManager } from '../game-manager';
import { AgentFactory } from '../../factory/agent-factory';
import { Agent } from '../../agent/agent';
import { Bot } from '../../controller/spaceshooter/bot';
import { LearningManager } from './learning-manager';
// @ts-ignore
import { DQNAgent } from "../../../../node_modules/@brain/rl/dist/rl.js"
import { readFileSync } from 'fs';
import path from 'path';


export class AgentManager {

    gameManager: GameManager
    factory: AgentFactory
    learningManager: LearningManager
    learn: boolean

    agents: Agent[] = []

    constructor(gameManager: GameManager, amount: number = 0, learn: boolean = false) {
        this.gameManager = gameManager;
        this.factory = new AgentFactory(this);
        this.learningManager = new LearningManager(this);
        this.learn = learn;
        this.createAgents(amount, learn);

        if(learn) {
            console.log('Started learning')
        }
    }

    createAgents(amount: number, learn: boolean) {
        for(let i = 0; i < amount; i++) {
            this.factory.createAgent(this.getTrainedModel(), i === 0 ? learn : false)
        }
    }

    manageAgents() {
        if(this.learn) {
            this.learningManager.manageLearning(this.agents)
        }
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
        return this.gameManager.controllerManager.factory.createBot(agent, agent.learn)
    }

    removeBot(bot: Bot) {
        this.gameManager.controllerManager.removeController(bot)
    }

    getTrainedModel() {
        const file = readFileSync(path.resolve(__dirname, '../../../../model/model.json'))
        const model = JSON.parse(file.toString())
        return model
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
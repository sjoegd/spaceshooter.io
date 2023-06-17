import { readFileSync } from 'fs';
import path from 'path';

// @ts-ignore
import { DQNAgent } from '../../../../node_modules/@brain/rl/dist/rl.js';
import { Agent } from '../../agent/agent';
import { Bot } from '../../controller/spaceshooter/bot';
import { AgentFactory } from '../../factory/agent-factory';
import { GameManager } from '../game-manager';
import { LearningManager } from './learning-manager';

export class AgentManager {

    gameManager: GameManager
    factory: AgentFactory
    learningManager: LearningManager
    learn: boolean

    agents: Agent[] = []

    constructor(gameManager: GameManager, amount: number = 0, learn: boolean = false, newModel: boolean = false) {
        this.gameManager = gameManager;
        this.factory = new AgentFactory(this);
        this.learningManager = new LearningManager(this);
        this.learn = learn;
        this.createAgents(amount, learn, newModel);

        if(learn) {
            console.log('Started learning')
            console.log('New Model: ', newModel)
        }
    }

    createAgents(amount: number, learn: boolean, newModel: boolean) {
        for(let i = 0; i < amount; i++) {
            this.factory.createAgent(
                newModel ? this.createRandomModel() : this.getTrainedModel(), 
                i === 0 ? learn : false
            )
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
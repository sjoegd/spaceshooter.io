import { GameManager } from './game-manager';
import { LearningAgent } from '../agent/learning_agent/learning-agent';
import { GhostAgent } from '../agent/ghost_agent/ghost-agent';
import { AgentFactory } from '../factory/agent-factory';
import { Agent } from '../agent/agent';
import { IDQNAgentJSON, DQNAgent } from '@brain/rl';
import { Bot } from '../controller/spaceshooter/bot';
import { readFileSync } from 'fs';

export class AgentManager {

    botsPerGhostAgent = 5;
    botsPerLearningAgent = 1;

    learningMemorySize = 5; // how many past learning models will be stored at a time
    ghostSteps: number = 10000; // every n steps, take a new random IDQNAgentJSON from learningMemory for every ghost
    learningSteps: number = 20000; // every n steps, store the current JSON of learningAgent to postLearning and remove the last one

    gameManager: GameManager

    factory: AgentFactory

    ghostAgents: GhostAgent[] = []
    learningAgent?: LearningAgent

    ghostModel: IDQNAgentJSON
    learningMemory?: IDQNAgentJSON[]

    isLearning: boolean

    constructor(gameManager: GameManager, botAmount: number, learning: boolean, ghostAgentSource?: string) {
        this.gameManager = gameManager;
        this.factory = new AgentFactory(this);

        if(ghostAgentSource) {
            const text = readFileSync(ghostAgentSource, "utf-8")
            const IDQNAgentJSON: IDQNAgentJSON = JSON.parse(text)
            this.ghostModel = IDQNAgentJSON
        } else {
            this.ghostModel = this.createRandomIDQNAgentJSON()
        }

        if(learning) {
            this.getLearningAgent()
            botAmount -= this.botsPerLearningAgent
            this.learningMemory = new Array(this.learningMemorySize)
        }
        this.getGhostAgents(botAmount)

        this.isLearning = learning
    }

    getGhostAgents(amount: number) {
        const i = amount;

        while(i > 0) {
            const botAmount = Math.min(i, this.botsPerGhostAgent)
            this.ghostAgents.push(this.factory.createGhostAgent(botAmount, this.ghostModel))
        }
    }

    getLearningAgent() {
        this.learningAgent = this.factory.createLearningAgent(this.botsPerLearningAgent)
    }

    manageAgents() {
        for(const agent of this.ghostAgents) {
            agent.manageBots()
        }
        
        if(this.isLearning) {
            this.learningAgent!.manageBots()
            this.manageLearning()
        }
    }

    manageLearning() {

        // check learningSteps
        // and perform necessary stuff

        // Check ghostSteps
        // and perform necessary stuff

    }

    giveAgentNewBot(agent: Agent) {
        const bot = this.gameManager.controllerManager.factory.createBot(agent)
        agent.addBot(bot)
    }

    createRandomIDQNAgentJSON() {
        return new DQNAgent({
            inputSize: Bot.stateSpace,
            outputSize: Bot.actionSpace,
            hiddenLayers: [16, 16]
        }).toJSON()
    }
}
import { GameManager } from './game-manager';
import { AgentFactory } from '../factory/agent-factory';
import { Agent } from '../agent/agent';
import { IDQNAgentJSON, DQNAgent } from '@brain/rl';
import { Bot } from '../controller/spaceshooter/bot';
import { readFileSync } from 'fs';

export class AgentManager {

    gameManager: GameManager
    factory: AgentFactory

    agents: Agent[] = []

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;
        this.factory = new AgentFactory(this);
    }

    manageAgents() {

    }

    addAgent(agent: Agent) {
        this.agents.push(agent)
    }

    removeAgent(agent: Agent) {
        this.agents = this.agents.filter(a => a !== agent)
    }

    giveNewBot(agent: Agent) {
        const bot = this.gameManager.controllerManager.factory.createBot(agent)
        agent.addBot(bot)
    }

}
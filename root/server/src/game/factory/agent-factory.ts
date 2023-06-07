import { GhostAgent } from "../agent/ghost_agent/ghost-agent";
import { LearningAgent } from "../agent/learning_agent/learning-agent";
import { AgentManager } from "../manager/agent-manager";
import { IDQNAgentJSON } from '@brain/rl';

export class AgentFactory {

    agentManager: AgentManager

    constructor(agentManager: AgentManager) {
        this.agentManager = agentManager;
    }

    createGhostAgent(botAmount: number, IDQNAgentJSON: IDQNAgentJSON) {
        const agent = new GhostAgent(this.agentManager, botAmount, IDQNAgentJSON)
        return agent;
    }

    createLearningAgent(botAmount: number) {
        const agent = new LearningAgent(this.agentManager, botAmount, this.agentManager.createRandomIDQNAgentJSON())
        return agent;
    }

}
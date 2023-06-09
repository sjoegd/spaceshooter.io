import { Agent } from "../agent/agent";
import { AgentManager } from "../manager/agent-manager";
import { IDQNAgentJSON } from '@brain/rl';

export class AgentFactory {

    agentManager: AgentManager

    constructor(agentManager: AgentManager) {
        this.agentManager = agentManager;
    }

    createAgent(model: IDQNAgentJSON, learn: boolean) {
        const agent = new Agent(this.agentManager, model, learn)
        this.agentManager.addAgent(agent)
        return agent;
    }

}
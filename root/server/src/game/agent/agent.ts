import { DQNAgent, IDQNAgentJSON } from "@brain/rl";
import { Bot } from "../controller/spaceshooter/bot";
import { AgentManager } from "../manager/agent-manager";

export class Agent {

    manager: AgentManager;

    DQN: DQNAgent;
    bots: Bot[] = [];
    learn: boolean;

    constructor(manager: AgentManager, model: IDQNAgentJSON, learn: boolean = false) {
        this.manager = manager;
        this.DQN = new DQNAgent(model);
        this.learn = learn;
    }

    manageBots() {
        for(const bot of this.bots) {
            if(!bot.isDeath) continue;
            this.removeBot(bot)
        }
    }

    updateModel(model: IDQNAgentJSON) {
        this.DQN = new DQNAgent(model)
    }

    addBot(bot: Bot) {
        this.bots.push(bot)
    }

    removeBot(bot: Bot) {
        bot.manager.removeController(bot)
        this.bots = this.bots.filter(b => b.id !== bot.id)
    }

    getBotCount() {
        return this.bots.length
    }

    getAction(state: number[]): number {
        return this.DQN.act(state)
    }

    giveReward(reward: number) {
        if(!this.learn) return;
        this.DQN.learn(reward)
    }
}
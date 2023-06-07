import { Bot } from "../../controller/spaceshooter/bot";
import { AgentManager } from "../../manager/agent-manager";
import { Agent } from "../agent";
import { DQNAgent, IDQNAgentJSON } from '@brain/rl';

export class LearningAgent implements Agent {

    manager: AgentManager

    bots: Bot[] = []
    botAmount: number
    DQNAgent: DQNAgent;

    constructor(manager: AgentManager, botAmount: number = 1, IDQNAgentJSON: IDQNAgentJSON) {
        this.manager = manager;
        this.botAmount = botAmount;
        this.DQNAgent = new DQNAgent(IDQNAgentJSON)
    }

    manageBots() {
        for(const bot of this.bots) {
            if(!bot.isDeath) continue;
            bot.manager.removeController(bot)

        }
    }

    addBot(bot: Bot) {
        this.bots.push(bot)
    }

    removeBot(bot: Bot) {
        bot.manager.removeController(bot)
        this.bots = this.bots.filter(b => b.id !== bot.id)
    }

    getAction(state: number[]) {
        return this.DQNAgent.act(state)
    }

    giveReward(reward: number) {
        this.DQNAgent.learn(reward)
    }
}
import { AgentManager } from "../../manager/agent-manager";
import { Bot } from "../../controller/spaceshooter/bot";
import { IDQNAgentJSON, DQNAgent } from '@brain/rl';
import { Agent } from "../agent";

export class GhostAgent implements Agent {

    manager: AgentManager

    bots: Bot[] = []
    botAmount: number
    DQNAgent: DQNAgent

    constructor(manager: AgentManager, botAmount: number = 1, IDQNAgentJSON: IDQNAgentJSON) {
        this.manager = manager;
        this.botAmount = botAmount;
        this.DQNAgent = new DQNAgent(IDQNAgentJSON);

        this.getBots()
    }

    updateDQNAgent(IDQNAgentJSON: IDQNAgentJSON) {
        this.DQNAgent = new DQNAgent(IDQNAgentJSON)
    }

    getBots() {
        for(let i = 0; i < this.botAmount; i++) {
            this.manager.giveAgentNewBot(this)
        }
    }

    manageBots() {
        for(const bot of this.bots) {
            if(!bot.isDeath) continue;
            this.removeBot(bot)
            this.manager.giveAgentNewBot(this)
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

    // Ghost doesn't learn, only acts
    giveReward() {}
}
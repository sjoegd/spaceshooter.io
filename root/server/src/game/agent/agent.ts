// import { DQNAgent, IDQNAgentJSON } from "@brain/rl";
// @ts-ignore
import { DQNAgent, IDQNAgentJSON } from "../../../node_modules/@brain/rl/dist/rl.js"
import { Bot } from "../controller/spaceshooter/bot";
import { AgentManager } from "../manager/agent-manager/agent-manager.js";

export class Agent {

    manager: AgentManager;

    DQN: DQNAgent;
    learn: boolean;
    bots: Bot[] = [];
    botCount: number;

    constructor(manager: AgentManager, model: IDQNAgentJSON, learn: boolean = false, botCount: number = 2) {
        this.manager = manager;
        this.DQN = new DQNAgent(model);
        this.learn = learn;
        this.botCount = botCount;
        this.createBots(botCount);
    }

    createBots(count: number) {
        for(let i = 0; i < count; i++) {
            this.addBot()
        }
    }

    manage() {
        this.manageBots()
    }

    manageBots() {
        for(const bot of this.bots) {
            if(!bot.isDeath) continue;
            this.removeBot(bot);
            this.addBot();
        }
    }

    updateModel(model: IDQNAgentJSON) {
        this.DQN = new DQNAgent(model)
    }

    getModel() {
        return this.DQN.toJSON()
    }

    addBot() {
        const bot = this.manager.createNewBot(this)
        this.bots.push(bot)
    }

    removeBot(bot: Bot) {
        this.manager.removeBot(bot)
        this.bots = this.bots.filter(b => b.id !== bot.id)
    }

    getAction(state: number[]): number {
        return this.DQN.act(state)
    }

    giveReward(reward: number) {
        if(!this.learn) return;
        this.DQN.learn(reward)
    }
}
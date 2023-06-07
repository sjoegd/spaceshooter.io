import { DQNAgent } from "@brain/rl";
import { Bot } from "../controller/spaceshooter/bot";
import { AgentManager } from "../manager/agent-manager";

export interface Agent {
    manager: AgentManager

    bots: Bot[]
    DQNAgent: DQNAgent

    manageBots: () => void
    addBot: (bot: Bot) => void
    removeBot: (bot: Bot) => void

    getAction: (state: number[]) => number
    giveReward: (reward: number) => void
}
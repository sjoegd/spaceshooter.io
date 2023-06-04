import { DQNAgent } from '@brain/rl';
import { RLAgent } from '../controller/spacejet/rl_agent';
import { BotManager } from '../manager/bot_manager';

export interface Bot {
    manager: BotManager

    agent: RLAgent | undefined
    DQN: DQNAgent

    getAction: (state: number[]) => number
    giveReward: (reward: number) => void
}
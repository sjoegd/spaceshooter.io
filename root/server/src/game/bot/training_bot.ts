import { RLAgent } from "../controller/spacejet/rl_agent";
import { Bot } from "./bot";
// import wasn't resolving
// @ts-ignore 
import { DQNAgent } from '../../../node_modules/@brain/rl/dist/rl.js'
// import { DQNAgent } from '@brain/rl'
import { writeFile } from "fs";
import { UUID, randomUUID } from "crypto";
import { BotManager } from "../manager/bot_manager";
import path from "path";

export class TrainingBot implements Bot {

    manager: BotManager

    agent: RLAgent | undefined;
    DQN: DQNAgent = new DQNAgent({
        inputSize: RLAgent.inputSize,
        outputSize: RLAgent.outputSize
    })
    id: UUID = randomUUID()

    constructor(manager: BotManager) {
        this.manager = manager;
    }

    getAction(state: number[]) {
        return this.DQN.act(state)
    }

    giveReward(reward: number) {
        this.DQN.learn(reward)
    }

    exportDQNAgent() {
        writeFile(path.resolve(__dirname, `./bot_json/${this.id}.json`), JSON.stringify(this.DQN.toJSON()), () => {console.log(`Exported ${this.id}`)})
    }
    
}


import { writeFile } from "fs";
import { AgentManager } from "./agent-manager";
import { Agent } from "../../agent/agent";
import { IDQNAgentJSON } from "@brain/rl";
import path from "path";

/**
 * swap_steps:
 *  - How often change the agents
 * window:
 *  - How many previous models are saved
 * save_steps:
 *  - How often a learn agent's model is saved
 */

export class LearningManager {
  agentManager: AgentManager;

  swap_steps: number;
  save_steps: number;
  window: number;

  memory: IDQNAgentJSON[] = [];
  savePath: string = "../../../../model/model.json";

  constructor(
    agentManager: AgentManager,
    swap_steps: number = 5000,
    save_steps: number = 20000,
    window: number = 5
  ) {
    this.agentManager = agentManager;
    this.swap_steps = swap_steps;
    this.save_steps = save_steps;
    this.window = window;
  }

  manageLearning(agents: Agent[]) {
    const tick = this.agentManager.gameManager.getCurrentTick();
    this.manageSave(agents, tick);
    this.manageSwap(agents, tick);
  }

  manageSwap(agents: Agent[], tick: number) {
    if (tick % this.swap_steps !== 0) return;
    for (const agent of agents) {
      if (agent.learn) continue;
      const model =
        this.memory[Math.round(Math.random() * this.memory.length - 1)] ??
        this.agentManager.createRandomModel();
      agent.updateModel(model);
      console.log("Model updated")
    }
  }

  manageSave(agents: Agent[], tick: number) {
    if (tick % this.save_steps !== 0) return;
    for (const agent of agents) {
      if (!agent.learn) continue;
      const model = agent.getModel();
      if (this.memory.length >= this.window) {
        this.memory.shift();
      }
      this.memory.push(model);
      this.saveModel(model);
    }
  }

  saveModel(model: IDQNAgentJSON) {
    writeFile(
      path.resolve(__dirname, this.savePath),
      JSON.stringify(model),
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Model saved");
      }
    );
  }
}

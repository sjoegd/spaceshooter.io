import { Agent } from "../../agent/agent";
import { Spacejet } from "../../custom-body/entity/spacejet/spacejet";
import { SpaceshooterManager } from "../../manager/controller-manager/spaceshooter/spaceshooter-manager";
import { Spaceshooter } from "./spaceshooter";

export class Bot extends Spaceshooter {

    /**
    * TODO
    */
    static stateSpace: number = 16;
    /**
    * 3 (forward | backward | none) x
    * 3 (right | left | none) x
    * 2 (boost | none) x
    * 2 (shoot | none) 
    */
    static actionSpace: number = 24; 

    agent: Agent
    isDeath: boolean = false;

    constructor(customManager: SpaceshooterManager, entity: Spacejet, agent: Agent) {
        super(customManager, entity)
        this.agent = agent;
    }
    
    handleInput(): void {
        const state = this.getState()
        const action = this.agent.getAction(state)
        this.handleAction(action)
    }

    getState(): number[] {
        return [
            //... of stateSpace
        ]
    }

    handleAction(action: number) {
        // handle 0 -> actionSpace - 1
    }

    handleTickReward(): void {
        this.agent.giveReward(this.tickReward)
        this.totalReward += this.tickReward
        this.tickReward = 0;
    }
    
    onEntityDeath(): void {
        const reward = this.customManager.getReward('death')
        this.tickReward += reward;
        this.isDeath = true;
    }

}
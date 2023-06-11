import Matter, { Body, Collision, Query, Vector } from "matter-js";
import { Agent } from "../../agent/agent";
import { Spacejet } from "../../custom-body/entity/spacejet/spacejet";
import { SpaceshooterManager } from "../../manager/controller-manager/spaceshooter/spaceshooter-manager";
import { Spaceshooter } from "./spaceshooter";
// @ts-ignore
import Line from "matter-lines"

export class Bot extends Spaceshooter {

    static rayCount = 16;
    static rayLength = 200;

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
    static actionSpace: number = 36; 


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
        const rayCount = Bot.stateSpace;
        const rayLength = 200;
        
        const rayResults = this.rayCast(rayCount, rayLength)
        return rayResults
    }

    rayCast(rayCount: number, rayLength: number): number[] {
        const position = this.entity.position;
        const bodies = this.manager.gameManager.physicsWorld.bodies.filter(b => b.id !== this.entity.id);
        const rayResults: number[] = [];

        return [
            1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1 ,1
        ]
    }

    handleAction(action: number) {

        const bitString = action.toString(2);
        const bits = bitString.split("");

        while (bits.length < 6) {
            bits.unshift("0");
        }

        const boost = parseInt(bits[0], 2);
        const shoot = parseInt(bits[1], 2);
        const direction = parseInt(bits[2] + bits[3], 2);
        const angle = parseInt(bits[4] + bits[5], 2);

        this.handleBoostAction(boost)
        this.handleShootAction(shoot)
        this.handleDirectionAction(direction)
        this.handleAngleAction(angle)
    }
    
    handleBoostAction(action: number) {
        switch (action) {
            case 0: this.entity.entityState.boost = true; break;
            case 1: this.entity.entityState.boost = false; break;
        }
    }

    handleShootAction(action: number) {
        switch (action) {
            case 0: this.entity.entityState.shoot = true; break;
            case 1: this.entity.entityState.shoot = false; break;
        }
    }

    handleDirectionAction(action: number) {
        switch (action) {
            case 0: this.entity.entityState.forward = true; this.entity.entityState.backward = false; break;
            case 1: this.entity.entityState.backward = true; this.entity.entityState.forward = false; break;
            case 2: this.entity.entityState.forward = false; this.entity.entityState.backward = false; break;
        }
    }

    handleAngleAction(action: number) {
        switch (action) {
            case 0: this.entity.entityState.right = true; this.entity.entityState.left = false; break;
            case 1: this.entity.entityState.left = true; this.entity.entityState.right = false; break;
            case 2: this.entity.entityState.right = false; this.entity.entityState.left = false; break;
        }
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

    onEntityAmmoChange(): void {}

}
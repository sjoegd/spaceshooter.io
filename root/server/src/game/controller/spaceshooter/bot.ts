import { Body, Collision, Query, Vector } from "matter-js";
import { Agent } from "../../agent/agent";
import { Spacejet } from "../../custom-body/entity/spacejet/spacejet";
import { SpaceshooterManager } from "../../manager/controller-manager/spaceshooter/spaceshooter-manager";
import { Spaceshooter } from "./spaceshooter";
import { isCustomBody } from "../../custom-body/custom-body";

export class Bot extends Spaceshooter {

    static rayCount = 16;
    static rayLength = 300;

    bodyTypeToNumber: {
        [bodyType: string]: number | undefined
    } = {
        "wall": 0.2,
        "powerup": 0.4,
        "obstacle": 0.6,
        "bullet": 0.8,
        "entity": 1,
    }

    /**
    * rayCount 
    * health
    * shield
    * ammo
    * isReloading
    */
    static stateSpace: number = Bot.rayCount + 4;
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
        const rayResults = this.rayCast(Bot.rayCount, Bot.rayLength);
        const health = this.entity.hp / this.entity.entityProperties.maxHP;
        const shield = this.entity.shield / this.entity.entityProperties.maxShield;
        const ammo = this.entity.ammo / this.entity.entityProperties.maxAmmo;
        const isReloading = this.entity.entityState.isReloading ? 1 : 0;

        return [...rayResults, health, shield, ammo, isReloading]
    }

    rayCast(rayCount: number, rayLength: number): number[] {
        const position = this.entity.position;
        const bodies = this.manager.gameManager.physicsWorld.bodies.filter(b => b.id !== this.entity.id && !b.isSensor);
        const rayResults: number[] = [];

        for(let i = 0; i < rayCount; i++) {
            const angle = (i / rayCount) * Math.PI * 2;
            const rayVector = Vector.create(Math.cos(angle), Math.sin(angle)); 
            const ray = Query.ray(bodies, position, Vector.add(position, Vector.mult(rayVector, rayLength)));
            const rayCollision = this.parseRayCollision(ray[0])
            rayResults.push(rayCollision)
        }

        return rayResults;
    }

    parseRayCollision(ray: Collision | undefined) {
        if(!ray) return 0;

        const body = ray.bodyB

        if(isCustomBody(body)) {
            return this.bodyTypeToNumber[body.bodyType] ?? 0
        }

        if(body.isStatic) {
            return this.bodyTypeToNumber["wall"] ?? 0
        }

        return 0;
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
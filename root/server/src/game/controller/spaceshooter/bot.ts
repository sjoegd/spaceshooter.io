import { Collision, Query, Vector } from "matter-js";
import { Agent } from "../../agent/agent";
import { Spacejet } from "../../custom-body/entity/spacejet/spacejet";
import { SpaceshooterManager } from "../../manager/controller-manager/spaceshooter/spaceshooter-manager";
import { Spaceshooter } from "./spaceshooter";
import { isCustomBody } from "../../custom-body/custom-body";
import { isObstacle } from "../../custom-body/obstacle/obstacle";
import { isEntity } from "../../custom-body/entity/entity";

export class Bot extends Spaceshooter {

    static rayCount = 16;
    static rayLength = 300;

    /**
    * rayCount 
    * health
    * shield
    * ammo
    * isReloading
    * speed / maxSpeed
    * angle / 360
    */
    static stateSpace: number = Bot.rayCount + 6;

    /**
     * forward
     * backward
     * stop
     * left
     * right
     * stop turn
     * shoot
     * stop shoot
     * boost
     * stop boost
     */
    static actionSpace: number = 10; 

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

        const health = +(this.entity.hp / this.entity.entityProperties.maxHP).toFixed(2);
        const shield = +(this.entity.shield / this.entity.entityProperties.maxShield).toFixed(2);
        const ammo = +(this.entity.ammo / this.entity.entityProperties.maxAmmo).toFixed(2);
        const isReloading = this.entity.entityState.isReloading ? 1 : 0;
        const speed = +(this.entity.speed / this.entity.entityProperties.maxSpeed).toFixed(2);
        const angle = +(this.entity.angle / 360).toFixed(2);

        return [...rayResults, health, shield, ammo, isReloading, speed, angle]
    }

    rayCast(rayCount: number, rayLength: number): number[] {
        const position = this.entity.position;
        const bodies = this.manager.gameManager.physicsWorld.bodies.filter(b => b.id !== this.entity.id && !(b.isSensor && b.isStatic));
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

    // get bodyID of rays body
    parseRayCollision(ray: Collision | undefined) {
        if(!ray) return this.customManager.bodyID['nothing'];

        const body = ray.bodyB

        if (body.isStatic) {
            return this.customManager.bodyID['wall'];
        }

        if(isCustomBody(body)) {
            
            if(isObstacle(body)) {
                return this.customManager.bodyID[body.obstacleType];
            }

            if(isEntity(body)) {
                return this.customManager.bodyID[body.entityType];
            }

            return this.customManager.bodyID[body.bodyType];
        }

        return this.customManager.bodyID['nothing'];
    }

    handleAction(action: number) {

        switch(action) {
            case 0: 
                this.entity.entityState.forward = true; 
                this.entity.entityState.backward = false; 
                break;
            case 1: 
                this.entity.entityState.backward = true; 
                this.entity.entityState.forward = false; 
                break;
            case 2: 
                this.entity.entityState.forward = false; 
                this.entity.entityState.backward = false; 
                break;
            case 3: 
                this.entity.entityState.right = true; 
                this.entity.entityState.left = false; 
                break;
            case 4: 
                this.entity.entityState.left = true; 
                this.entity.entityState.right = false; 
                break;
            case 5: 
                this.entity.entityState.right = false; 
                this.entity.entityState.left = false; 
                break;
            case 6: 
                this.entity.entityState.boost = true; 
                break;
            case 7: 
                this.entity.entityState.boost = false; 
                break;
            case 8: 
                this.entity.entityState.shoot = true; 
                break;
            case 9: 
                this.entity.entityState.shoot = false; 
                break;
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
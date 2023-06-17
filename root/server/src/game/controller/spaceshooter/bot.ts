import { Collision, Query, Vector } from 'matter-js';

import { Agent } from '../../agent/agent';
import { isCustomBody } from '../../custom-body/custom-body';
import { isEntity } from '../../custom-body/entity/entity';
import { Spacejet } from '../../custom-body/entity/spacejet/spacejet';
import { isObstacle } from '../../custom-body/obstacle/obstacle';
import { SpaceshooterManager } from '../../manager/controller-manager/spaceshooter/spaceshooter-manager';
import { Spaceshooter } from './spaceshooter';

export class Bot extends Spaceshooter {

    static rayCount = 16;
    static rayLength = 250;

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
     * left
     * right
     * shoot
     * boost
     */
    static actionSpace: number = 6; 

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
        const bodies = this.manager.gameManager.physicsEngine.world.bodies.filter(b => b.id !== this.entity.id && !(b.isSensor && b.isStatic));
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

        const state = this.entity.entityState;
        // reset state
        state.forward = false;
        state.backward = false;
        state.right = false;
        state.left = false;
        state.boost = false;
        state.shoot = false;

        switch(action) {
            case 0: 
                state.forward = true; 
                break;
            case 1: 
                state.backward = true; 
                break;
            case 2: 
                state.right = true; 
                break;
            case 3: 
                state.left = true; 
                break;
            case 4: 
                state.boost = true; 
                break;
            case 5: 
                state.shoot = true; 
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
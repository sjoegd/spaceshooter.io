import { BodyManager } from "../../managers/custom_body_manager";
import { CustomBody, CustomBodyManager } from "../custom_body";

export interface Powerup extends CustomBody<'powerup'> {
    effect: PowerupEffect
}

export interface PowerupEffect {

}

export function createPowerup() {

}

export class PowerupManager implements CustomBodyManager<Powerup> {
    
    bodyManager: BodyManager
    
    effects: PowerupEffect[] = []
    powerups: Powerup[] = []

    constructor(manager: BodyManager) {
        this.bodyManager = manager;
    }

    createPowerups() {
        
    }

    createRandomPowerup() {

    }

    manage() {
        
    }

    managePowerup() {

    }

    add(body: CustomBody<String>) {
        if(!this.isType(body)) return;
        this.powerups.push(body)
    }

    remove(body: CustomBody<String>) {
        if(!this.isType(body)) return;
        this.powerups = this.powerups.filter(p => p.id !== body.id)
    }

    addToWorld(body: CustomBody<String>) {
        this.bodyManager.addBodyToWorld(body)
    }

    removeFromWorld(body: CustomBody<String>) {
        this.bodyManager.removeBodyFromWorld(body)
    }
    
    isType(body: CustomBody<String>): body is Powerup {
        return body.bodyType == 'powerup'
    }
}




import { Spacejet, SpacejetState, SpacejetType, createSpacejet } from "../../bodies/entities/spacejet/spacejet";
import { CreatureManager } from "../../managers/creature_manager";
import { Vector } from "matter-js";
import { Spaceshooter, SpaceshooterStateUpdate } from "./spaceshooter";
import { BaseSpacejetType } from "../../bodies/entities/spacejet/types/base_spacejet";

type KeyInput = {
    key: string,
    down: boolean
}

export class Player implements Spaceshooter {

    id: string
    type: SpacejetType
    entity: Spacejet
    creatureManager: CreatureManager

    keyInputQueue: KeyInput[] = []
    inputManager: PlayerInputManager

    constructor(id: string, position: Vector, creatureManager: CreatureManager, inputManager: PlayerInputManager, type: SpacejetType = new BaseSpacejetType()) {
        this.id = id;
        this.type = type;
        this.entity = this.createEntity(position);
        this.creatureManager = creatureManager;
        this.inputManager = inputManager;
    }

    createEntity(position: Vector): Spacejet {
        return createSpacejet(position.x, position.y, this.type, this)
    }

    process() {
        this.processInput()
    }

    processInput() {
        for(const {key, down} of this.keyInputQueue) {
            this.inputManager.manageInput(this.entity, key, down)
        }
        this.keyInputQueue = []
    }

    onKeyInput(key: string, down: boolean) {
        this.keyInputQueue.push({key, down})
    }

    onEntityDeath() {
        this.creatureManager.onPlayerDeath(this)        
    }

    onEntityStateUpdate(update: SpaceshooterStateUpdate) {
        this.creatureManager.onPlayerStateUpdate(this, update)
    }
}

export class PlayerInputManager {

    keyAction: Map<string, (state: SpacejetState, down: boolean) => void> = new Map([
        ['w', (state, down) => {state.forward = down}],
        ['a', (state, down) => {state.left = down}],
        ['s', (state, down) => {state.backward = down}],
        ['d', (state, down) => {state.right = down}],
        ['space', (state, down) => {state.shooting = down}],
        ['shift', (state, down) => {state.boost = down}]
    ])

    manageInput(spacejet: Spacejet, key: string, down: boolean) {
        const state = spacejet.state;
        const action = this.keyAction.get(key)
        
        if(action) {
            action(state, down)
        }
    }
}
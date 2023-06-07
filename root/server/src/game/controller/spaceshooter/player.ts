import { PlayerStateRender } from "../../../../../types/render_types";
import { Spacejet } from "../../custom-body/entity/spacejet/spacejet";
import { ControllerManager } from "../../manager/controller-manager/controller-manager";
import { SpaceshooterManager } from "../../manager/controller-manager/spaceshooter/spaceshooter-manager";
import { GameSocket } from "../../manager/socket-manager";
import { Spaceshooter } from "./spaceshooter";

export interface KeyInput {
    key: string,
    down: boolean
}

export class Player extends Spaceshooter {
    
    socket: GameSocket

    keyInputs: KeyInput[] = []
    keyAction: Map<string, (down: boolean) => void> 

    constructor(customManager: SpaceshooterManager, entity: Spacejet, socket: GameSocket) {
        super(customManager, entity)

        this.socket = socket;
        this.keyAction = new Map([
            ['w', (down) => this.entity.entityState.forward = down],
            ['s', (down) => this.entity.entityState.backward = down],
            ['a', (down) => this.entity.entityState.left = down],
            ['d', (down) => this.entity.entityState.right = down],
            ['space', (down) => this.entity.entityState.shoot = down],
            ['shift', (down) => this.entity.entityState.boost = down]
        ])
    }

    startSocketConnection() {
        this.socket.on('key', (key, down) => {
            this.keyInputs.push({key, down})
        })
    }

    stopSocketConnection() {
        this.socket.removeAllListeners('key')
    }
    
    handleInput(): void {
        this.handleKeyInputs()
    }

    handleKeyInputs() {
        for(const {key, down} of this.keyInputs) {
            const action = this.keyAction.get(key)

            if(action) {
                action(down)
            }
        }

        this.keyInputs = []
    }

    handleTickReward(): void {
        if(this.tickReward == 0) return;

        this.totalReward += Math.round(this.tickReward)
        this.tickReward = 0;

        this.onPlayerStateUpdate({score: this.totalReward})
    }
    
    onPlayerStateUpdate(update: PlayerStateRender) {
        this.socket.emit('player-state-update', update)
    }

    onEntityDeath(): void {
        this.socket.emit('death')
        this.socket.manager.removeSocketsPlayer(this.socket)
    }
}
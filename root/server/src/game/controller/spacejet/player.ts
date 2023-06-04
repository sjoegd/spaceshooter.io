import { PlayerStateRender } from "../../../../../types/render_types";
import { Spacejet } from "../../body/entity/spacejet/spacejet";
import { ControllerManager } from "../../manager/controller_manager/controller_manager";
import { SpacejetControllerManager } from "../../manager/controller_manager/spacejet_controller_manager";
import { PlayerSocket } from "../../manager/player_socket_manager";
import { SpacejetController } from "./spacejet_controller";

export interface KeyInput {
    key: string,
    down: boolean
}

export class Player implements SpacejetController {
    
    spacejetControllerManager: SpacejetControllerManager
    controllerManager: ControllerManager
    entity: Spacejet;
    socket: PlayerSocket
    
    keyInputs: KeyInput[] = []
    keyAction: Map<string, (down: boolean) => void> 

    totalReward: number = 0;
    tickReward: number = 0;
    
    constructor(manager: SpacejetControllerManager, entity: Spacejet, socket: PlayerSocket) {
        this.spacejetControllerManager = manager;
        this.controllerManager = manager.controllerManager;
        this.entity = entity;
        this.entity.controller = this;
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

    handleInput() {
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

    handleTickReward() {
        if(this.tickReward == 0) return

        this.totalReward += Math.round(this.tickReward)
        this.tickReward = 0;
        this.onPlayerStateUpdate({score: this.totalReward})
    }

    onEnemyKill()  {
        const reward = this.spacejetControllerManager.getReward('killEnemy')
        this.tickReward += reward;
    }

    onAsteroidDestroyed(mass: number) {
        const rewardMultiplier = this.spacejetControllerManager.getReward('destroyAsteroid')
        const reward = rewardMultiplier * mass
        this.tickReward += reward;
    }

    onTickSurvived() {
        const reward = this.spacejetControllerManager.getReward('surviveTick')
        this.tickReward += reward;
    }

    onDamageTaken(damage: number) {
        const rewardMultiplier = this.spacejetControllerManager.getReward('takeDamage')
        const reward = rewardMultiplier * damage;
        this.tickReward += reward;
    }

    onPowerupTaken() {
        const reward = this.spacejetControllerManager.getReward('takePowerup')
        this.tickReward += reward
    }

    onEntityDeath() {
        const reward = this.spacejetControllerManager.getReward('death')
        this.tickReward += reward;

        this.socket.emit('death')
        this.socket.manager.removePlayer(this.socket)
    }

    onPlayerStateUpdate(update: PlayerStateRender) {
        this.socket.emit('player-state-update', update)
    }
}
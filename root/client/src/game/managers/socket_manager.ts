import { io, Socket } from "socket.io-client";
import { ClientGameEngine } from "../client_game_engine";
import { PlayerStateRender, StateRender } from '../../../../server/src/game/managers/game_manager';

export class SocketManager {

    gameEngine: ClientGameEngine

    socket: Socket

    constructor(gameEngine: ClientGameEngine) {
        this.gameEngine = gameEngine;

        this.socket = io('http://localhost:3000', {
            path: '/game-socket'
        })

        this.socket.on('connect', () => console.log(this.socket.id))
    }

    setup() {
        this.setupStateUpdates()
        this.setupPlayerStateUpdates()
    }

    setupStateUpdates() {
        this.socket.on('state-update', (state: StateRender) => {
            this.gameEngine.render.updateState(state)
        })
    }

    setupPlayerStateUpdates() {
        this.socket.on('player-state-update', (playerState: PlayerStateRender) => {
            this.gameEngine.render.updatePlayerState(playerState)
        })
    }

    emit(ev: string, ...args: any[]) {
        this.socket.emit(ev, ...args)
    }
}
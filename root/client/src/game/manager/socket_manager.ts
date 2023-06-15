import { io, Socket } from "socket.io-client";
import { ClientGameEngine } from "../client_game_engine";
import { GameStateRender, PlayerStateRender } from "../../../../types/render_types";

export class SocketManager {

    engine: ClientGameEngine

    socket: Socket
    isConnected = false

    constructor(gameEngine: ClientGameEngine) {
        this.engine = gameEngine;

        this.socket = io({ // localhost:3000 for development
            path: '/game-socket'
        })

        this.socket.on('connect', () => {
            this.isConnected = true;
            this.engine.overlayOptions.setActive(true)
        })

        this.socket.on('disconnect', () => {
            this.isConnected = false;
        })
    }

    setup() {
        this.socket.on('game-state-update', (state: GameStateRender) => {
            this.engine.render.updateState(state)
        })

        this.socket.on('player-state-update', (playerState: PlayerStateRender) => {
            this.engine.render.updatePlayerState(playerState)
            this.engine.hudOptions.setPlayerState(this.engine.render.playerState);
        })

        this.socket.on('death', () => {
            this.engine.overlayOptions.setActive(true)
        })
    }

    emit(ev: string, ...args: any[]) {
        if(!this.isConnected) return;
        this.socket.emit(ev, ...args)
    }
}
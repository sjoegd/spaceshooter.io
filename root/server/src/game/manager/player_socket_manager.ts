import { Socket } from "socket.io";
import { BodyRender, GameStateRender } from "../../../../types/render_types";
import { ServerGameEngine } from "../server_game_engine";
import { Player } from "../controller/spacejet/player";

export interface PlayerSocket extends Socket {
    player: Player | undefined
    manager: PlayerSocketManager
}

export class PlayerSocketManager {

    gameEngine: ServerGameEngine
    playerSockets: PlayerSocket[] = []

    constructor(gameEngine: ServerGameEngine) {
        this.gameEngine = gameEngine;
    }

    addSocket(socket: Socket) {
        // currently assuming every socket will be a player

        const playerSocket = <PlayerSocket> socket
        playerSocket.manager = this;
        
        this.playerSockets.push(playerSocket)

        // add listeners
        socket.on('play', () => {
            this.removePlayer(playerSocket) // remove previous playerSocket instance (if present)
            this.addPlayer(playerSocket) // add new playerSocket instance
        })
    }

    removeSocket(socket: Socket) {
        const playerSocket = <PlayerSocket> socket;

        this.playerSockets = this.playerSockets.filter(s => s.id !== playerSocket.id)
        this.removePlayer(playerSocket)

        // remove all previous listeners
        socket.removeAllListeners('play')
    }

    addPlayer(playerSocket: PlayerSocket) {
        // add player instance if not present
        if(!playerSocket.player) {
            playerSocket.player = this.gameEngine.gameManager.controllerManager.spacejetControllerManager.createPlayer(playerSocket)
            this.gameEngine.gameManager.controllerManager.addController(playerSocket.player)
            playerSocket.player.startSocketConnection()
        }
    }

    removePlayer(playerSocket: PlayerSocket) {
        // remove player instance if present
        if(playerSocket.player) {
            playerSocket.player.stopSocketConnection()
            this.gameEngine.gameManager.controllerManager.removeController(playerSocket.player)
            playerSocket.player = undefined;
        }
    }

    onGameStateUpdate(bodyRenders: BodyRender[]) {
        for(const socket of this.playerSockets) {
            const gameStateRender: GameStateRender = {
                bodyRenders,
                origin: socket.player?.entity.position
            }
            socket.emit('game-state-update', gameStateRender)
        }
    }
}
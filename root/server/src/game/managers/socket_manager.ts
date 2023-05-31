import { Socket } from "socket.io";
import { GameManager } from "./game_manager";
import { BodyRender, PlayerStateRender, StateRender } from "../../../../types/render_types";

export class SocketManager {

    gameManager: GameManager

    sockets: Socket[] = []

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;
    }

    onConnect(socket: Socket) {
        this.sockets.push(socket)

        // information handshake 

        // setup base communication
        // -> send necesarry socket input to creature manager
        socket.on('key', (key: string, down: boolean) => {
            this.gameManager.creatureManager.onSocketKeyInput(socket, key, down)
        })

        // on start, play, respawn etc
        // -> creature manager handles

        // when player wants to play
        // -> creates player instance for socket
        this.gameManager.creatureManager.addSocketPlayer(socket)
    }

    onDisconnect(socket: Socket) {
        this.sockets = this.sockets.filter(s => s.id !== socket.id)
        
        this.gameManager.creatureManager.removeSocketPlayer(socket)
        // remove all listeners
        socket.removeAllListeners('key')
    }

    onStateUpdate(bodyRenders: BodyRender[]) {
        for(const socket of this.sockets) {
            const origin = this.gameManager.creatureManager.getSocketPlayerOrigin(socket)
            const stateRender: StateRender = {
                bodyRenders,
                origin
            }
            socket.emit('state-update', stateRender)
        }
    }

    onPlayerStateUpdate(socket: Socket, playerState: PlayerStateRender) {
        socket.emit('player-state-update', playerState)
    }
}
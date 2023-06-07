import { Socket } from 'socket.io';
import { GameManager } from './game-manager';
import { Player } from '../controller/spaceshooter/player';
import { BodyRender, GameStateRender } from '../../../../types/render_types';

export interface GameSocket extends Socket {
    player?: Player
    manager: SocketManager
}

export class SocketManager {

    gameManager: GameManager
    sockets: GameSocket[] = []

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;
    }

    addSocket(socket: Socket) {

        const gameSocket = <GameSocket> socket;
        gameSocket.manager = this;
        this.sockets.push(gameSocket);

        // add listeners
        socket.on('play', () => {
            this.removeSocketsPlayer(gameSocket)
            this.addSocketsPlayer(gameSocket)
        })
    }

    removeSocket(socket: Socket) {

        const gameSocket = <GameSocket> socket;
        this.sockets = this.sockets.filter(s => s.id != gameSocket.id)
        this.removeSocketsPlayer(gameSocket)
        
        // remove all added listeners
        socket.removeAllListeners('play')
    }

    addSocketsPlayer(socket: GameSocket) {
        if(socket.player) return;

        socket.player = this.gameManager.controllerManager.factory.createPlayer(socket)
        socket.player.startSocketConnection()
    }

    removeSocketsPlayer(socket: GameSocket) {
        if(!socket.player) return;

        this.gameManager.controllerManager.removeController(socket.player)
        socket.player.stopSocketConnection()
        socket.player = undefined;
    }

    onGameStateUpdate(bodyRenders: BodyRender[]) {
        for(const socket of this.sockets) {
            const render: GameStateRender = {
                bodyRenders,
                origin: socket.player?.entity.position
            }
            socket.emit('game-state-update', render)
        }
    }
}
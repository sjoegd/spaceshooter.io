import { Socket } from "socket.io";
import { GameManager } from "./game_manager";

export class SocketManager {

    manager: GameManager

    sockets: Socket[] = []

    constructor(manager: GameManager) {
        this.manager = manager;
    }

    onConnect(socket: Socket) {
        this.sockets.push(socket)
    }

    onDisconnect(socket: Socket) {
        this.sockets = this.sockets.filter(s => s.id !== socket.id)
    }

}
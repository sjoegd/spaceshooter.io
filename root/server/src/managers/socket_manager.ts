import { Socket } from "socket.io";
import { Body, Events } from "matter-js";
import GameEngine, { BodyRender } from "../game_engine";
import BodyManager from "./body_manager";
import InputManager from "./input_manager";
import { Spacejet, createSpacejet } from "../bodies/spacejet";

export interface SocketState {
    spacejet?: Spacejet
}

export default class SocketManager {
    
    gameEngine: GameEngine
    bodyManager: BodyManager
    inputManager: InputManager
    sockets: Socket[] = []
    socketStates: Map<Socket, SocketState> = new Map()

    constructor(gameEngine: GameEngine) {
        this.gameEngine = gameEngine;
        this.bodyManager = gameEngine.bodyManager;
        this.inputManager = gameEngine.inputManager;
    }

    addSocket(socket: Socket) {
        this.sockets.push(socket)
        this.setupSocket(socket)
    }

    setupSocket(socket: Socket) {
        this.setupSpacejet(socket);
        this.setupInput(socket);
    }

    setupSpacejet(socket: Socket) {
        const {x, y} = this.gameEngine.getRandomPosition()
        const spacejet = createSpacejet(x, y)
        this.bodyManager.addSpacejet(spacejet)

        this.socketStates.set(socket, {
            spacejet
        })

        const onRemove = ({object}: {object: Body}) => {
            if(object !== spacejet) return;

            if(this.socketStates.has(socket)) {
                this.socketStates.set(socket, {});
            }

            Events.off(this.gameEngine.engine.world, 'afterRemove', onRemove)
        };
        Events.on(this.gameEngine.engine.world, 'afterRemove', onRemove);
    }

    setupInput(socket: Socket) {
        // player input
        socket.on('key', (key: string, value: boolean) => {
            const { spacejet } = this.socketStates.get(socket) ?? {}
            if(spacejet) {
                this.inputManager.manageInput(spacejet, key, value)
            }
        })
    }

    removeSocket(socket: Socket) {
        this.sockets = this.sockets.filter(s => s.id !== socket.id)

        const { spacejet } = this.socketStates.get(socket) ?? {}
        if(spacejet) {
            this.bodyManager.removeSpacejet(spacejet)
        }

        this.socketStates.delete(socket)

        // remove all added listeners
        socket.removeAllListeners('key')
    }

    emitStateUpdate(bodies: BodyRender[]) {
        for(const socket of this.sockets) {
            const { spacejet } = this.socketStates.get(socket) ?? {}

            socket.emit('update_state', {
                bodies,
                ui: {
                    origin: spacejet?.position,
                    health: spacejet?.health,
                    shield: spacejet?.shield,
                    ammo: spacejet?.ammo
                }
            })
        }
    }
}
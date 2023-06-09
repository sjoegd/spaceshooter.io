import { Engine } from 'matter-js';
import { Socket } from 'socket.io';

import { GameManager } from './manager/game-manager';

export const BASE_TICK_RATE: number = 60;

export class ServerGameEngine {

    tickRate: number;
    currentTick: number = 1;
    gameLoop: NodeJS.Timer;

    physicsEngine: Engine;

    gameManager: GameManager;

    constructor(tickRate: number = BASE_TICK_RATE, train: boolean = false, newModel: boolean = false) {
        this.tickRate = tickRate;

        this.physicsEngine = Engine.create({
            gravity: {x: 0, y: 0}
        });

        this.gameManager = new GameManager(this, train, newModel);

        this.gameLoop = this.createGameLoop()
    }

    createGameLoop() {
        
        return setInterval(() => {

            this.gameManager.manageGameBeforeUpdate();

            Engine.update(this.physicsEngine, 1000/BASE_TICK_RATE); // to speed-up time (for RL training)

            this.gameManager.manageGameAfterUpdate();

            this.currentTick++;

        }, 1000/this.tickRate);

    }

    updateTickRate(tickRate: number) {
        this.tickRate = tickRate;
        this.updateGameLoop();
    }

    updateGameLoop() {
        clearInterval(this.gameLoop);
        this.gameLoop = this.createGameLoop();
    }

    connectSocket(socket: Socket) {
        this.gameManager.socketManager.addSocket(socket)
    }

    disconnectSocket(socket: Socket) {
        this.gameManager.socketManager.removeSocket(socket)
    }
}
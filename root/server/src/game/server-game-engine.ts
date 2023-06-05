import { Engine } from "matter-js";
import { GameManager } from './manager/game-manager';

export const BASE_TICK_RATE: number = 60;

export class ServerGameEngine {

    tickRate: number;
    currentTick: number = 0;
    gameLoop: NodeJS.Timer;

    physicsEngine: Engine;

    gameManager: GameManager;

    constructor(tickRate: number = BASE_TICK_RATE) {
        this.tickRate = tickRate;

        this.physicsEngine = Engine.create({
            gravity: {x: 0, y: 0}
        });

        this.gameManager = new GameManager(this);

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

}
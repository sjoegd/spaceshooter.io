import { GameManager } from './game-manager';

export class SocketManager {

    gameManager: GameManager

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;
    }

}
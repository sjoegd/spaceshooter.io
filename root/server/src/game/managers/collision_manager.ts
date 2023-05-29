import { Events } from "matter-js";
import { GameManager } from "./game_manager";

export class CollisionManager {

    gameManager: GameManager

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;
    }

}
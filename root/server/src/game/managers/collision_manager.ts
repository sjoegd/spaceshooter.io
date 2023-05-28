import { Events } from "matter-js";
import { GameManager } from "./game_manager";

export class CollisionManager {

    manager: GameManager

    constructor(manager: GameManager) {
        this.manager = manager;
        this.setup()
    }

    setup() {
        Events.on(this.manager.engine, 'collisionStart', (ev) => {

        })
    }

}
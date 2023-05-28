import { Bodies, Body, Engine, Events, World } from "matter-js";
import { SocketManager } from "./socket_manager";
import { BodyManager } from "./body_manager";
import { CollisionManager } from "./collision_manager";

export class GameManager {

    engine: Engine;
    world: World;

    socketManager: SocketManager;
    bodyManager: BodyManager;
    collisionManager: CollisionManager;

    constructor(engine: Engine) {
        this.engine = engine;
        this.world = engine.world;
        this.socketManager = new SocketManager(this)
        this.bodyManager = new BodyManager(this)
        this.collisionManager = new CollisionManager(this)
    }

    setup() {
        this.bodyManager.setup()
        this.setupStateUpdates()
    }

    setupStateUpdates() {
        Events.on(this.engine, 'afterUpdate', () => {
            // get body renders and send to sockets
        })
    }



}
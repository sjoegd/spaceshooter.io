import { Body, Engine, Events, Vector, World } from "matter-js";
import { SocketManager } from "./socket_manager";
import { BodyManager } from "./body_manager";
import { CollisionManager } from "./collision_manager";
import { GameEngine } from "../game_engine";
import { CreatureManager } from "./creature_manager";
import { BodyRender } from "../../../../types/render_types";

export class GameManager {

    gameEngine: GameEngine;
    engine: Engine;
    world: World;

    socketManager: SocketManager;
    bodyManager: BodyManager;
    collisionManager: CollisionManager;
    creatureManager: CreatureManager;

    constructor(gameEngine: GameEngine) {
        this.gameEngine = gameEngine;
        this.engine = gameEngine.engine;
        this.world = gameEngine.engine.world;
        this.socketManager = new SocketManager(this)
        this.bodyManager = new BodyManager(this)
        this.collisionManager = new CollisionManager(this)
        this.creatureManager = new CreatureManager(this)
        this.setup()
    }

    setup() {
        this.setupGameUpdates()
        this.setupStateUpdates()
    }

    setupGameUpdates() {
        Events.on(this.engine, 'beforeUpdate', () => {
            this.manageGame()
        })
    }

    setupStateUpdates() {
        Events.on(this.engine, 'afterUpdate', () => {
            const bodyRenders = this.world.bodies.map(b => this.getBodyRender(b))
            this.socketManager.onStateUpdate(bodyRenders)
        })
    }

    getBodyRender(body: Body): BodyRender {
        return {
            vertices: body.vertices.map(v => ({ x: v.x, y: v.y })),
            render: body.render,
            position: body.position,
            angle: body.angle
        }
    }

    manageGame() {
        this.creatureManager.manageCreatures()
        this.bodyManager.manageBodies()
    }

    createRandomPosition(): Vector {
        return this.gameEngine.createRandomPosition()
    }
}
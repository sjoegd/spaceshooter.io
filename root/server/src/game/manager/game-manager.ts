import { Bodies, Body, Engine, World } from "matter-js";
import { ServerGameEngine } from "../server-game-engine";
import inBetween from "../../util/in_between";
import { BodyManager } from "./body-manager/body-manager";
import { CollisionManager } from './collision-manager';
import { SocketManager } from './socket-manager';
import { ControllerManager } from './controller-manager/controller-manager';
import { AgentManager } from './agent-manager';


export class GameManager {

    WORLD_SIZE = 3000;
    BORDER_SIZE = 200;

    gameEngine: ServerGameEngine
    physicsEngine: Engine
    physicsWorld: World

    bodyManager: BodyManager
    collisionManager: CollisionManager
    controllerManager: ControllerManager
    socketManager: SocketManager
    agentManager: AgentManager

    constructor(gameEngine: ServerGameEngine) {
        this.gameEngine = gameEngine;
        this.physicsEngine = gameEngine.physicsEngine;
        this.physicsWorld = this.physicsEngine.world;

        this.setupWorld()

        this.bodyManager = new BodyManager(this)
        this.collisionManager = new CollisionManager(this)
        this.controllerManager = new ControllerManager(this)
        this.socketManager = new SocketManager(this)
        this.agentManager = new AgentManager(this)
    }

    manageGameBeforeUpdate() {
        this.bodyManager.manageBodies()
    }

    manageGameAfterUpdate() {

    }

    setupWorld() {
        const background = this.createWorldBackground()
        const borders = this.createWorldBorders()
        World.add(this.physicsWorld, [background, ...borders])
    }

    createWorldBackground(): Body {
        return Bodies.rectangle(this.WORLD_SIZE/2, this.WORLD_SIZE/2, this.WORLD_SIZE, this.WORLD_SIZE, {
            isStatic: true,
            isSensor: true,
            collisionFilter: {
                category: 0x0002,
                mask: 0x0002
            },
            render: {
                fillStyle: `pattern|grid_75px.png`,
            }
        })
    }

    createWorldBorders(): Body[] {
        const options = {
            isStatic: true,
            render: {
                fillStyle: 'color|#333333',
            }
        }

        return [
            Bodies.rectangle(this.WORLD_SIZE/2, 0, this.WORLD_SIZE + this.BORDER_SIZE, this.BORDER_SIZE, options),
            Bodies.rectangle(this.WORLD_SIZE/2, this.WORLD_SIZE, this.WORLD_SIZE + this.BORDER_SIZE, this.BORDER_SIZE, options),
            Bodies.rectangle(0, this.WORLD_SIZE/2, this.BORDER_SIZE, this.WORLD_SIZE + this.BORDER_SIZE, options),
            Bodies.rectangle(this.WORLD_SIZE, this.WORLD_SIZE/2, this.BORDER_SIZE, this.WORLD_SIZE + this.BORDER_SIZE, options)
        ]
    }

    createRandomPosition() {
        return {
            x: inBetween(this.BORDER_SIZE, this.WORLD_SIZE - this.BORDER_SIZE),
            y: inBetween(this.BORDER_SIZE, this.WORLD_SIZE - this.BORDER_SIZE)
        }
    }

    getCurrentTick() {
        return this.gameEngine.currentTick;
    }
}
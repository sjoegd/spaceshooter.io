import { Bodies, Body, Engine, World } from "matter-js";
import { ServerGameEngine } from "../server-game-engine";
import inBetween from "../../util/in-between";
import { BodyManager } from "./body-manager/body-manager";
import { CollisionManager } from './collision-manager';
import { SocketManager } from './socket-manager';
import { ControllerManager } from './controller-manager/controller-manager';
import { AgentManager } from './agent-manager/agent-manager';
import { BodyRender } from "../../../../types/render_types";

export class GameManager {

    WORLD_SIZE = 4000;
    BORDER_SIZE = 200;

    gameEngine: ServerGameEngine
    physicsEngine: Engine
    physicsWorld: World

    bodyManager: BodyManager
    collisionManager: CollisionManager
    controllerManager: ControllerManager
    socketManager: SocketManager
    agentManager: AgentManager

    constructor(gameEngine: ServerGameEngine, train: boolean) {
        this.gameEngine = gameEngine;
        this.physicsEngine = gameEngine.physicsEngine;
        this.physicsWorld = this.physicsEngine.world;

        this.setupWorld()

        this.bodyManager = new BodyManager(this)
        this.collisionManager = new CollisionManager(this)
        this.controllerManager = new ControllerManager(this)
        this.socketManager = new SocketManager(this)
        this.agentManager = new AgentManager(this, 1, train)
    }

    manageGameBeforeUpdate() {
        this.controllerManager.manageControllersBeforeUpdate()
        this.bodyManager.manageBodies()
    }

    manageGameAfterUpdate() {
        this.controllerManager.manageControllersAfterUpdate()
        this.agentManager.manageAgents()
        if(this.socketManager.shouldSendGameStateUpdate()) { 
            this.socketManager.onGameStateUpdate(
                this.physicsWorld.bodies
                    .sort(this.bodyManager.sortBody)
                    .map(b => this.getBodyRender(b))
            ) 
        }
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

    getBodyRender(body: Body): BodyRender {
        return {
            vertices: body.vertices.map(v => ({x: v.x, y: v.y})),
            render: body.render,
            position: body.position,
            angle: body.angle
        }
    }
}
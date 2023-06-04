import { Bodies, Body, Engine, World } from "matter-js";
import { ServerGameEngine } from "../server_game_engine";
import inBetween from "../../util/in_between";
import { BodyManager } from "./body_manager/body_manager";
import { CollisionManager } from "./collision_manager";
import { ControllerManager } from "./controller_manager/controller_manager";

export class GameManager {

    WORLD_SIZE = 3000;
    BORDER_SIZE = 200;

    gameEngine: ServerGameEngine
    engine: Engine
    world: World

    bodyManager: BodyManager 
    collisionManager: CollisionManager
    controllerManager: ControllerManager

    constructor(gameEngine: ServerGameEngine) {
        this.gameEngine = gameEngine;
        this.engine = gameEngine.engine;
        this.world = gameEngine.world;
        this.setupWorld();

        this.bodyManager = new BodyManager(this)
        this.collisionManager = new CollisionManager(this)
        this.controllerManager = new ControllerManager(this)
    }

    manageGameBeforeUpdate() {
        this.controllerManager.manageControllersBeforeUpdate()
        this.bodyManager.manageBodies()
    }

    manageGameAfterUpdate() {
        this.controllerManager.manageControllersAfterUpdate()
    }

    setupWorld() {
        const background = this.createWorldBackground()
        const borders = this.createWorldBorders()
        World.add(this.world, [background, ...borders])
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

    calculateTimeFromTicks(timeTicks: number) {
        return timeTicks * (1000/this.gameEngine.TICK_RATE)
    }
}
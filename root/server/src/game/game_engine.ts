import { Bodies, Body, Engine, Runner, Vector, World } from "matter-js";
import { GameManager } from "./managers/game_manager";
import { Socket } from "socket.io";
import inBetween from "../util/in_between";

export class GameEngine {

    TICK_RATE = 60;
    WORLD_SIZE = 4000;
    BORDER_SIZE = 50;

    engine: Engine
    runner: Runner

    manager: GameManager

    constructor() {
        this.engine = Engine.create({
            gravity: {x: 0, y: 0}
        })

        this.runner = Runner.create({
            delta: 1000/this.TICK_RATE,
            isFixed: true
        })  

        this.setup()
        this.manager = new GameManager(this)
    }

    setup() {
        this.setupWorld()
        this.setupRunner()
    }

    setupWorld() {
        const background = this.createBackground()
        const borders = this.createBorders()
        World.add(this.engine.world, [background, ...borders])
    }

    setupRunner() {
        Runner.run(this.runner, this.engine)
    }

    createBackground(): Body {
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

    createBorders(): Body[] {
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

    createRandomPosition(): Vector {
        return {
            x: inBetween(this.BORDER_SIZE, this.WORLD_SIZE - this.BORDER_SIZE),
            y: inBetween(this.BORDER_SIZE, this.WORLD_SIZE - this.BORDER_SIZE)
        }
    }

    onSocketConnect(socket: Socket) {
        this.manager.socketManager.onConnect(socket)
    }

    onSocketDisconnect(socket: Socket) {
        this.manager.socketManager.onDisconnect(socket)
    }
}
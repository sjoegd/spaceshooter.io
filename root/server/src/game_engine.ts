import { Socket } from "socket.io";
import { Bodies, Body, Engine, Events, IBodyRenderOptions, IBodyRenderOptionsSprite, Runner, Vector, World } from "matter-js";
import BodyManager from "./managers/body_manager";
import InputManager from "./managers/input_manager";
import SocketManager from "./managers/socket_manager";
import CollisionManager from "./managers/collision_manager";

export interface BodyRender {
    vertices: Vector[],
    render: IBodyRenderOptions
    sprite?: SpriteRender
    position: Vector
    angle: number
}

export interface SpriteRender extends IBodyRenderOptionsSprite {
    xOffset: number,
    yOffset: number
}

export default class GameEngine {

    TICKRATE: number = 60;
    WORLD_SIZE: number = 4000;
    BORDER_SIZE: number = 50;

    engine: Engine
    runner: Runner

    bodyManager: BodyManager
    inputManager: InputManager
    socketManager: SocketManager
    collisionManager: CollisionManager

    constructor() {
        this.engine = Engine.create({
            gravity: {x: 0, y: 0}
        })

        this.runner = Runner.create({
            delta: 1000/this.TICKRATE,
            isFixed: true
        })

        this.bodyManager = new BodyManager(this)
        this.inputManager = new InputManager(this)
        this.socketManager = new SocketManager(this)
        this.collisionManager = new CollisionManager(this)

        this.setupWorld()
        this.setupStateUpdate()
        
        Runner.run(this.runner, this.engine)
    }

    setupWorld() {
        
        // background
        const background = Bodies.rectangle(this.WORLD_SIZE/2, this.WORLD_SIZE/2, this.WORLD_SIZE, this.WORLD_SIZE, {
            isStatic: true,
            isSensor: true,
            restitution: 1,
            friction: 0,
            collisionFilter: {
                category: 0x0002,
                mask: 0x0002
            },
            render: {
                fillStyle: `/pattern/grid_75px.png`,
            }
        })

        // borders
        const borderOptions = {
            isStatic: true,
            render: {
                fillStyle: '/color/#333333',
                strokeStyle: 'black',
                lineWidth: this.BORDER_SIZE/10
            }
        }

        const borders = [
            Bodies.rectangle(this.WORLD_SIZE/2, 0, this.WORLD_SIZE + this.BORDER_SIZE, this.BORDER_SIZE, borderOptions),
            Bodies.rectangle(this.WORLD_SIZE/2, this.WORLD_SIZE, this.WORLD_SIZE + this.BORDER_SIZE, this.BORDER_SIZE, borderOptions),
            Bodies.rectangle(0, this.WORLD_SIZE/2, this.BORDER_SIZE, this.WORLD_SIZE + this.BORDER_SIZE, borderOptions),
            Bodies.rectangle(this.WORLD_SIZE, this.WORLD_SIZE/2, this.BORDER_SIZE, this.WORLD_SIZE + this.BORDER_SIZE, borderOptions)
        ]

        World.add(this.engine.world, [background, ...borders])

        this.bodyManager.setupWorld()
    }

    setupStateUpdate() {
        Events.on(this.engine, 'afterUpdate', () => {
            const bodies = this.engine.world.bodies.map(body => this.getBodyRender(body))
            this.socketManager.emitStateUpdate(bodies)
        })
    }

    getBodyRender(body: Body): BodyRender {
        return {
            vertices: body.vertices.map((v => ({x: v.x, y: v.y}))),
            render: body.render,
            position: body.position,
            angle: body.angle,
            sprite: body.render.sprite?.texture ? <SpriteRender> body.render.sprite : undefined
        }
    }

    onSocketConnect(socket: Socket) {
        this.socketManager.addSocket(socket)
    }

    onSocketDisconnect(socket: Socket) {
        this.socketManager.removeSocket(socket)
    }

    getRandomPosition(): Vector {
        return {
            x: Math.random() * (this.WORLD_SIZE-(this.BORDER_SIZE*2)) + this.BORDER_SIZE,
            y: Math.random() * (this.WORLD_SIZE-(this.BORDER_SIZE*2)) + this.BORDER_SIZE
        }
    }
}

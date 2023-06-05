import Matter, { Body, Common, Engine, Events, Runner, World } from "matter-js";
import { GameManager } from "./manager/game_manager";
import { Socket } from "socket.io";
import { PlayerSocketManager } from "./manager/player_socket_manager";
import { BodyRender } from "../../../types/render_types";
import { CustomBody } from "./body/body";
import { ControllerManager } from "./manager/controller_manager/controller_manager";
import { BotManager } from './manager/bot_manager';

export const BASE_TICK_RATE = 60;

export class ServerGameEngine {

    TICK_RATE;
    BOT_EXPORT_TICKS = 10000;

    currentTick = 1;

    engine: Engine
    world: World

    gameManager: GameManager
    socketManager: PlayerSocketManager
    botManager: BotManager

    constructor(tickRate: number = BASE_TICK_RATE) {
        this.TICK_RATE = tickRate;
        this.engine = Engine.create({
            gravity: {x: 0, y: 0}
        })

        this.world = this.engine.world

        this.gameManager = new GameManager(this)
        this.socketManager = new PlayerSocketManager(this)
        this.botManager = new BotManager(this)

        this.setupGameLoop()
        this.setupGameStateUpdates()
    }

    setupGameLoop() {
        setInterval(() => {

            if(this.currentTick % this.BOT_EXPORT_TICKS == 0) {
                this.botManager.exportBots()
            }

            this.gameManager.manageGameBeforeUpdate()
            Engine.update(this.engine, 1000/BASE_TICK_RATE)
            this.gameManager.manageGameAfterUpdate()

            this.currentTick++;

        }, 1000/this.TICK_RATE)
    }

    setupGameStateUpdates() {
        Events.on(this.engine, 'afterUpdate', () => {
            if(!this.socketManager.shouldGiveGameStateUpdate()) return;
            const bodyRenders = this.world.bodies.sort(this.sortBody).map(b => this.getBodyRender(b))
            this.socketManager.onGameStateUpdate(bodyRenders)
        })
    }

    connectSocket(socket: Socket) {
        this.socketManager.addSocket(socket)
    }

    disconnectSocket(socket: Socket) {
        this.socketManager.removeSocket(socket)
    }

    sortBody(a: Body, b: Body) {
        // order based on z_index, (statics get -1)
        const a_c = <CustomBody<String>> a;
        const b_c = <CustomBody<String>> b;
        a_c.z_index = a_c.z_index ?? -1;
        b_c.z_index = b_c.z_index ?? -1;
        return a_c.z_index - b_c.z_index
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
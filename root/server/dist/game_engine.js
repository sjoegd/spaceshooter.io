"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const matter_js_1 = require("matter-js");
const body_manager_1 = __importDefault(require("./managers/body_manager"));
const input_manager_1 = __importDefault(require("./managers/input_manager"));
const socket_manager_1 = __importDefault(require("./managers/socket_manager"));
const collision_manager_1 = __importDefault(require("./managers/collision_manager"));
class GameEngine {
    constructor() {
        this.TICKRATE = 60;
        this.WORLD_SIZE = 4000;
        this.BORDER_SIZE = 50;
        this.engine = matter_js_1.Engine.create({
            gravity: { x: 0, y: 0 }
        });
        this.runner = matter_js_1.Runner.create({
            delta: 1000 / this.TICKRATE,
            isFixed: true
        });
        this.bodyManager = new body_manager_1.default(this);
        this.inputManager = new input_manager_1.default(this);
        this.socketManager = new socket_manager_1.default(this);
        this.collisionManager = new collision_manager_1.default(this);
        this.setupWorld();
        this.setupStateUpdate();
        matter_js_1.Runner.run(this.runner, this.engine);
    }
    setupWorld() {
        // background
        const background = matter_js_1.Bodies.rectangle(this.WORLD_SIZE / 2, this.WORLD_SIZE / 2, this.WORLD_SIZE, this.WORLD_SIZE, {
            isStatic: true,
            isSensor: true,
            collisionFilter: {
                category: 0x0002,
                mask: 0x0002
            },
            render: {
                fillStyle: `/pattern/grid_100px.png`,
            }
        });
        // borders
        const borderOptions = {
            isStatic: true,
            render: {
                fillStyle: '/color/#333333',
                strokeStyle: 'black',
                lineWidth: this.BORDER_SIZE / 10
            }
        };
        const borders = [
            matter_js_1.Bodies.rectangle(this.WORLD_SIZE / 2, 0, this.WORLD_SIZE + this.BORDER_SIZE, this.BORDER_SIZE, borderOptions),
            matter_js_1.Bodies.rectangle(this.WORLD_SIZE / 2, this.WORLD_SIZE, this.WORLD_SIZE + this.BORDER_SIZE, this.BORDER_SIZE, borderOptions),
            matter_js_1.Bodies.rectangle(0, this.WORLD_SIZE / 2, this.BORDER_SIZE, this.WORLD_SIZE + this.BORDER_SIZE, borderOptions),
            matter_js_1.Bodies.rectangle(this.WORLD_SIZE, this.WORLD_SIZE / 2, this.BORDER_SIZE, this.WORLD_SIZE + this.BORDER_SIZE, borderOptions)
        ];
        matter_js_1.World.add(this.engine.world, [background, ...borders]);
    }
    setupStateUpdate() {
        matter_js_1.Events.on(this.engine, 'afterUpdate', () => {
            const bodies = this.engine.world.bodies.map(body => this.getBodyRender(body));
            this.socketManager.emitStateUpdate(bodies);
        });
    }
    getBodyRender(body) {
        var _a;
        return {
            vertices: body.vertices.map((v => ({ x: v.x, y: v.y }))),
            render: body.render,
            position: body.position,
            angle: body.angle,
            sprite: ((_a = body.render.sprite) === null || _a === void 0 ? void 0 : _a.texture) ? body.render.sprite : undefined
        };
    }
    onSocketConnect(socket) {
        this.socketManager.addSocket(socket);
    }
    onSocketDisconnect(socket) {
        this.socketManager.removeSocket(socket);
    }
    getRandomPosition() {
        return {
            x: Math.random() * (this.WORLD_SIZE - (this.BORDER_SIZE * 2)) + this.BORDER_SIZE,
            y: Math.random() * (this.WORLD_SIZE - (this.BORDER_SIZE * 2)) + this.BORDER_SIZE
        };
    }
}
exports.default = GameEngine;

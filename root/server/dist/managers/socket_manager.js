"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matter_js_1 = require("matter-js");
const spacejet_1 = require("../bodies/spacejet");
class SocketManager {
    constructor(gameEngine) {
        this.sockets = [];
        this.socketStates = new Map();
        this.gameEngine = gameEngine;
        this.bodyManager = gameEngine.bodyManager;
        this.inputManager = gameEngine.inputManager;
    }
    addSocket(socket) {
        this.sockets.push(socket);
        this.setupSocket(socket);
    }
    setupSocket(socket) {
        this.setupSpacejet(socket);
        this.setupInput(socket);
    }
    setupSpacejet(socket) {
        const { x, y } = this.gameEngine.getRandomPosition();
        const spacejet = (0, spacejet_1.createSpacejet)(x, y);
        this.bodyManager.addSpacejet(spacejet);
        this.socketStates.set(socket, {
            spacejet
        });
        const onRemove = ({ object }) => {
            if (object !== spacejet)
                return;
            if (this.socketStates.has(socket)) {
                this.socketStates.set(socket, {});
            }
            matter_js_1.Events.off(this.gameEngine.engine.world, 'afterRemove', onRemove);
        };
        matter_js_1.Events.on(this.gameEngine.engine.world, 'afterRemove', onRemove);
    }
    setupInput(socket) {
        // player input
        socket.on('key', (key, value) => {
            var _a;
            const { spacejet } = (_a = this.socketStates.get(socket)) !== null && _a !== void 0 ? _a : {};
            if (spacejet) {
                this.inputManager.manageInput(spacejet, key, value);
            }
        });
    }
    removeSocket(socket) {
        var _a;
        this.sockets = this.sockets.filter(s => s.id !== socket.id);
        const { spacejet } = (_a = this.socketStates.get(socket)) !== null && _a !== void 0 ? _a : {};
        if (spacejet) {
            this.bodyManager.removeSpacejet(spacejet);
        }
        this.socketStates.delete(socket);
        // remove all added listeners
        socket.removeAllListeners('key');
    }
    emitStateUpdate(bodies) {
        var _a;
        for (const socket of this.sockets) {
            const { spacejet } = (_a = this.socketStates.get(socket)) !== null && _a !== void 0 ? _a : {};
            socket.emit('update_state', {
                bodies,
                origin: spacejet === null || spacejet === void 0 ? void 0 : spacejet.position
            });
        }
    }
}
exports.default = SocketManager;

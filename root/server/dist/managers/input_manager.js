"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InputManager {
    constructor(gameEngine) {
        this.keyAction = new Map();
        this.gameEngine = gameEngine;
        this.bodyManager = gameEngine.bodyManager;
        this.setup();
    }
    setup() {
        this.setupKeyActions();
    }
    setupKeyActions() {
        this.keyAction.set('w', (state, value) => {
            state.forward = value;
        });
        this.keyAction.set('a', (state, value) => {
            state.left = value;
        });
        this.keyAction.set('s', (state, value) => {
            state.backward = value;
        });
        this.keyAction.set('d', (state, value) => {
            state.right = value;
        });
        this.keyAction.set('space', (state, value) => {
            state.shooting = value;
        });
        this.keyAction.set('shift', (state, value) => {
            state.boost = value;
        });
    }
    manageInput(spacejet, key, value) {
        const state = spacejet.state;
        const action = this.keyAction.get(key);
        if (action) {
            action(state, value);
        }
    }
}
exports.default = InputManager;

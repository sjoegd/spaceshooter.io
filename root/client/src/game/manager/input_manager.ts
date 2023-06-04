import { ClientGameEngine } from "../client_game_engine";

export class InputManager {

    gameEngine: ClientGameEngine

    validKeys: (string | number)[] = ['w', 'a', 's', 'd', 'space', 'shift']
    keyCodeToKey: Map<number, string> = new Map([
        [32, 'space'],
        [16, 'shift']
    ])

    constructor(gameEngine: ClientGameEngine) {
        this.gameEngine = gameEngine;
    }

    setup() {
        this.setupMovementInput()
    }

    setupMovementInput() {
        const keyListener = (down: boolean) => {
            return (ev: KeyboardEvent) => {
                const key = ev.key.toLowerCase()
                const keyCodeKey = this.keyCodeToKey.get(ev.keyCode) ?? ""
                if(this.validKeys.includes(key)) {
                    this.gameEngine.socket.emit('key', key, down)
                }
                if(this.validKeys.includes(keyCodeKey)) {
                    this.gameEngine.socket.emit('key', keyCodeKey, down)
                }
            }
        }

        const downKeyListener = keyListener(true)
        const upKeyListener = keyListener(false)

        document.addEventListener('keydown', downKeyListener)
        document.addEventListener('keyup', upKeyListener)
    }

}
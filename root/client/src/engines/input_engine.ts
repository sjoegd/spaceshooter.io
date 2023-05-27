import SocketEngine from "./socket_engine";

export default class InputEngine {

    socketEngine: SocketEngine

    validKeys: (string | number)[] = ['w', 'a', 's', 'd', 'space', 'shift']
    keyCodeToKey: Map<number, string> = new Map([
        [32, 'space'],
        [16, 'shift']
    ])

    constructor(socketEngine: SocketEngine) {
        this.socketEngine = socketEngine;
        this.setup()
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
                    this.socketEngine.callSocket('key', key, down)
                }
                if(this.validKeys.includes(keyCodeKey)) {
                    this.socketEngine.callSocket('key', keyCodeKey, down)
                }
            }
        }

        const downKeyListener = keyListener(true)
        const upKeyListener = keyListener(false)

        document.addEventListener('keydown', downKeyListener)
        document.addEventListener('keyup', upKeyListener)
    }



}
import { InputManager } from "./managers/input_manager";
import { RenderManager } from "./managers/render_manager";
import { SocketManager } from "./managers/socket_manager";


export class ClientGameEngine {

    render: RenderManager
    socket: SocketManager
    input: InputManager

    constructor(canvas: HTMLCanvasElement, width: number, height: number) {
        this.render = new RenderManager(this, canvas, width, height)
        this.socket = new SocketManager(this)
        this.input = new InputManager(this)
        this.setup()
    }

    setup() {
        this.socket.setup()
        this.input.setup()
        this.render.setup()
    }

    updateWindowSize(width: number, height: number) {
        this.render.updateWindowSize(width, height)
    }

}
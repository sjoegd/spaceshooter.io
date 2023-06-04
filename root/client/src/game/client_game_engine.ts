import { OverlayOptions } from "../App";
import { InputManager } from "./manager/input_manager";
import { RenderManager } from "./manager/render_manager";
import { SocketManager } from "./manager/socket_manager";

export class ClientGameEngine {

    render: RenderManager
    socket: SocketManager
    input: InputManager
    overlayOptions: OverlayOptions

    constructor(canvas: HTMLCanvasElement, width: number, height: number, overlayOptions: OverlayOptions) {
        this.render = new RenderManager(this, canvas, width, height)
        this.socket = new SocketManager(this)
        this.input = new InputManager(this)
        this.overlayOptions = overlayOptions;
        this.setup()
    }

    setup() {
        this.socket.setup()
        this.input.setup()
        this.render.setup()
    }

    startPlaying() {
        this.socket.emit('play')
        this.overlayOptions.setActive(false)
    }

    updateWindowSize(width: number, height: number) {
        this.render.updateWindowSize(width, height)
    }

}
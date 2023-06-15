import { HudOptions, OverlayOptions } from "./components/Game";
import { InputManager } from "./manager/input_manager";
import { RenderManager } from "./manager/render_manager";
import { SocketManager } from "./manager/socket_manager";

export class ClientGameEngine {

    render: RenderManager
    socket: SocketManager
    input: InputManager
    overlayOptions: OverlayOptions
    hudOptions: HudOptions

    constructor(canvas: HTMLCanvasElement, width: number, height: number, overlayOptions: OverlayOptions, hudOptions: HudOptions) {
        this.render = new RenderManager(this, canvas, width, height)
        this.socket = new SocketManager(this)
        this.input = new InputManager(this)
        this.overlayOptions = overlayOptions;
        this.hudOptions = hudOptions;
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
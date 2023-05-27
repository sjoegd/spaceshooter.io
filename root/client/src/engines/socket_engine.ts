import { io, Socket } from "socket.io-client"
import { BodyRender, UIRender } from "./render_engine"

export default class SocketEngine {

  socket: Socket
  updateStateCallbacks: ((bodies: BodyRender[], ui?: UIRender) => void)[] = []

  constructor() {
    const [http, address, port] = window.location.href.split(":")
    this.socket = io(`${http}:${address}:${port}`) // port -> 3000 for dev

    this.socket.on('connect', () => {
      console.log(this.socket.id)
    })

    this.socket.on('update_state', ({bodies, ui}: {bodies: BodyRender[], ui?: UIRender}) => {
      for(const cb of this.updateStateCallbacks) {
        cb(bodies, ui)
      }
    })

  }

  callSocket(ev: string, ...args: any[]) {
    this.socket.emit(ev, ...args)
  }

  onUpdateState(cb: (bodies: BodyRender[], ui?: UIRender) => void) {
    this.updateStateCallbacks.push(cb)
  }

}
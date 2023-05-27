import SocketEngine from "./socket_engine"
import { Vector, IBodyRenderOptions, IBodyRenderOptionsSprite} from "matter-js"
import { createPattern, getLinearGradient } from "../util/fillStyle"

// constants, should be specified by server at setup
const MAX_HEALTH = 100;
const MAX_SHIELD = 50;
const MAX_AMMO = 10;

interface SpriteRender extends IBodyRenderOptionsSprite {
    xOffset: number,
    yOffset: number
}

export interface StateRender {
    bodies: BodyRender[],
    ui: UIRender
}

export interface BodyRender {
    vertices: Vector[]
    render: IBodyRenderOptions
    sprite?: SpriteRender
    position: Vector
    angle: number
}

export interface UIRender {
    origin?: Vector
    health?: number,
    shield?: number,
    ammo?: number,
}

export default class RenderEngine {
    
    FRAMERATE = 60

    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D | null
    socketEngine: SocketEngine
    width: number
    height: number

    baseStyle = "black"
    patterns: Map<string, CanvasPattern> = new Map<string, CanvasPattern>()
    sprites: Map<string, HTMLImageElement> = new Map<string, HTMLImageElement>()

    origin: Vector = {
        x: 0,
        y: 0
    }

    state: StateRender = {
        bodies: [],
        ui: {
            origin: { x: 0, y: 0 },
            health: MAX_HEALTH,
            shield: 0,
            ammo: MAX_AMMO
        }
    }

    maxHealthBox = this.createBox(MAX_HEALTH*3, 25)
    maxShieldBox = this.createBox(MAX_SHIELD*3, 15)

    constructor(canvas: HTMLCanvasElement, socketEngine: SocketEngine, width: number, height: number) {
        this.canvas = canvas;
        this.canvas.style.background = '#181A1B'
        this.context = canvas.getContext('2d');
        this.socketEngine = socketEngine;
        this.width = width;
        this.height = height;
        canvas.width = width;
        canvas.height = height;

        this.socketEngine.onUpdateState((bodies, ui) => this.updateState(bodies, ui))
        this.start()
    }

    start() {
        setInterval(() => {
            window.requestAnimationFrame(() => this.drawState(this.state))
        }, 1000/this.FRAMERATE)
    }

    updateWindow(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
    }

    updateState(bodies: BodyRender[], ui?: UIRender) {
        this.state = {
            bodies, 
            ui: ui ?? this.state.ui
        }
    }

    drawState(state: StateRender) {
        if(!this.context) return;

        const { bodies, ui: { origin, health, shield, ammo } } = state;

        if(origin) {
            const {x, y} = origin;
            this.origin = {
                x: x - this.width/2,
                y: y - this.height/2
            }
        }

        const ctx = this.context;

        ctx.save()
        ctx.clearRect(0, 0, this.width, this.height)
        ctx.translate(-this.origin.x, -this.origin.y)
        bodies.forEach(body => this.drawBody(body))
        ctx.restore()

        ctx.save()
        this.drawUI(health ?? 0, shield ?? 0, ammo ?? 0)
        ctx.restore()
    }

    drawUI(health: number, shield: number, ammo: number) {
        if(!this.context) return;
        const ctx = this.context;
    
        const healthBox = this.createBox(health*3, 25)
        const shieldBox = this.createBox(shield*3, 15)

        ctx.strokeStyle = 'black'
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5

        ctx.fillStyle = 'red'
        this.drawBox(this.maxHealthBox, { x: 10, y: this.height - 35 })

        ctx.fillStyle = 'yellow'
        this.drawBox(this.maxShieldBox, { x: 10, y: this.height - 60 })

        ctx.globalAlpha = 1;

        if(health > 0) {
            ctx.strokeStyle = 'darkred'
            ctx.fillStyle = 'red'
            this.drawBox(healthBox, { x: 10, y: this.height - 35 })
        }

        if(shield > 0) {
            ctx.strokeStyle = 'darkyellow'
            ctx.fillStyle = 'yellow'
            this.drawBox(shieldBox, { x: 10, y: this.height - 60 })
        }

        ctx.fillStyle = 'lightgray'
        ctx.strokeStyle = 'white'
        ctx.font = '20px Arial'
        ctx.fillText(`${ammo}/${MAX_AMMO}`, 170, this.height - 45)
        ctx.strokeText(`${ammo}/${MAX_AMMO}`, 170, this.height - 45)
    }
    
    drawBody(body: BodyRender) {
        if(!this.context) return;
        const ctx = this.context;

        const {vertices, render, position, angle, sprite} = body;
        const {visible, fillStyle, lineWidth, strokeStyle, opacity} = render;

        // check if sprite, if so handle
        spriteIf: if(sprite) {
            const {texture, xScale, yScale, xOffset, yOffset} = sprite;
            if(!texture || !xScale || !yScale || !xOffset || !yOffset) break spriteIf;

            const img = this.getSprite(texture)
            if(!img) return;

            const scaledWidth = img.width * xScale
            const scaledHeight = img.height * yScale

            ctx.save()
            ctx.translate(position.x, position.y)
            ctx.rotate(angle)
            ctx.drawImage(img, -scaledWidth/2 - xOffset, -scaledHeight/2 - yOffset, scaledWidth, scaledHeight)
            ctx.restore()
            return;
        }

        // else normal render
        if(!visible) return;

        ctx.fillStyle = this.parseFillstyle(fillStyle)
        ctx.lineWidth = lineWidth ?? 1;
        ctx.strokeStyle = strokeStyle ?? this.baseStyle;
        ctx.globalAlpha = opacity ?? 1;
        this.drawVertices(vertices)
    }

    drawVertices(vertices: Vector[]) {
        if(!this.context) return;
        const ctx = this.context;
        ctx.beginPath()
        for(const {x, y} of vertices) {
            ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }

    drawBox(vertices: Vector[], position: Vector) {
        if(!this.context) return;
        const ctx = this.context;
        ctx.save()
        ctx.translate(position.x, position.y)
        this.drawVertices(vertices)
        ctx.restore()
    }

    getSprite(src: string) {
        const sprite = this.sprites.get(src)

        if(!sprite) {
            const img = new Image()
            img.onload = () => {
                this.sprites.set(src, img)
            }
            img.src = src
        }

        return sprite;
    }

    parseFillstyle(fillStyle: string | undefined) {
        if(!fillStyle) {
            return this.baseStyle
        }
        
        const [_, type, src] = fillStyle.split('/')

        switch(type) {
            case 'pattern':
                return this.getPattern(src)
            case 'color':
                return src;
            case 'gradient':
                return this.getGradient(src)
        }

        return this.baseStyle
    }

    getPattern(src: string) {
        const pattern = this.patterns.get(src)

        if(!pattern) {
            // create pattern for next use
            const img = new Image()
            img.onload = () => {
                if(!this.context) return;
                const createdPattern = createPattern(this.context, img)
                if(!createdPattern) return;
                this.patterns.set(src, createdPattern)
            }
            img.src = src;

            return this.baseStyle
        }

        return pattern;
    }

    getGradient(src: string) {
        if(!this.context) return this.baseStyle;
        const ctx = this.context
        const [color1, color2, width, height] = src.split('-')
        return getLinearGradient(ctx, color1, color2, +width, +height)
    }

    createBox(width: number, height: number): Vector[] {
        return [
            {x: 0, y: 0},
            {x: width, y: 0},
            {x: width, y: height},
            {x: 0, y: height}
        ]
    }
}


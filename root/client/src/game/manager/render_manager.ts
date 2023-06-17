import { Vector } from 'matter-js';

import {
    BodyRender, GameStateRender, PlayerStateRender, SpriteRender
} from '../../../../types/render_types';
import { createLinearGradient, createPattern } from '../../util/fillStyle';
import { ClientGameEngine } from '../client_game_engine';

export class RenderManager {

    engine: ClientGameEngine
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D | null
    width = 0
    height = 0

    baseStyle = 'white'

    sprites: Map<string, HTMLImageElement> = new Map()
    patterns: Map<string, CanvasPattern> = new Map()
    gradients: Map<string, CanvasGradient> = new Map()

    origin: Vector = {
        x: 1500, 
        y: 1500
    }

    state: GameStateRender = {
        bodyRenders: [],
        origin: this.origin,
    }

    playerState: PlayerStateRender = {
        health: 0,
        shield: 0,
        ammo: 0,
        score: 0
    }

    constructor(gameEngine: ClientGameEngine, canvas: HTMLCanvasElement, width: number, height: number) {
        this.engine = gameEngine;
        this.canvas = canvas;
        this.canvas.style.background = '#181A1B'
        this.context = canvas.getContext('2d');
        this.updateWindowSize(width, height)
    }

    setup() {
        const animate = () => {
            this.drawState(this.state, this.playerState)
            requestAnimationFrame(animate)
        }

        animate()
    }

    updateWindowSize(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
    }

    updateState(state: GameStateRender) {
        this.state = { ...this.state, ...state };
    }

    updatePlayerState(playerState: PlayerStateRender) {
        this.playerState = { 
            health: playerState.health ?? this.playerState.health,
            shield: playerState.shield ?? this.playerState.shield,
            ammo: playerState.ammo ?? this.playerState.ammo,
            score: playerState.score ?? this.playerState.score
         };
    }

    drawState(state: GameStateRender, playerState: PlayerStateRender) {
        if(!this.context) return;
        const ctx = this.context;
        const { bodyRenders, origin } = state;
        const { health, shield, ammo } = playerState;

        if(origin) {
            this.origin = {
                x: origin.x - this.width/2,
                y: origin.y - this.height/2
            }
        }

        ctx.save()
        ctx.clearRect(0, 0, this.width, this.height)
        ctx.translate(-this.origin.x, -this.origin.y)
        bodyRenders.forEach(b => this.drawBodyRender(ctx, b))
        ctx.restore()

        ctx.save()
        this.drawUI(health ?? 0, shield ?? 0, ammo ?? 0)
        ctx.restore()
    }

    drawUI(health: number, shield: number, ammo: number) {
        health
        shield
        ammo
    }

    drawBodyRender(ctx: CanvasRenderingContext2D, bodyRender: BodyRender) {
        const { vertices, render, position, angle } = bodyRender
        const { fillStyle, strokeStyle, lineWidth, opacity, visible, sprite } = render

        if(!visible || opacity === 0) return;

        spriteIf: if(sprite) {
            const { texture, xScale, yScale, xOffset, yOffset } = <SpriteRender> sprite
            
            if(!texture) break spriteIf
            
            const img = this.getSprite(texture)

            const scaledWidth = img.width * xScale
            const scaledHeight = img.height * yScale
            
            ctx.save()
            ctx.translate(position.x, position.y)
            ctx.rotate(angle)
            ctx.drawImage(img, -scaledWidth/2 - xOffset, -scaledHeight/2 - yOffset, scaledWidth, scaledHeight)
            ctx.restore()
            
            return;
        }

        // normal render
        ctx.fillStyle = this.parseFillStyle(ctx, fillStyle)
        ctx.strokeStyle = strokeStyle ?? this.baseStyle
        ctx.lineWidth = lineWidth ?? 1
        ctx.globalAlpha = opacity ?? 1
        this.drawVertices(ctx, vertices)
    }

    drawVertices(ctx: CanvasRenderingContext2D, vertices: Vector[]) {
        ctx.beginPath()
        for(const {x, y} of vertices) {
            ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }

    parseFillStyle(ctx: CanvasRenderingContext2D, fillStyle?: string) {
        if(!fillStyle) return this.baseStyle;

        const [type, src] = fillStyle.split('|')

        switch(type) {
            case 'pattern':
                return this.getPattern(ctx, src)
            case 'color':
                return src;
            case 'gradient':
                return this.getGradient(ctx, src)
        }

        return this.baseStyle;
    }

    getSprite(src: string) {
        const sprite = this.sprites.get(src)
        if(sprite) return sprite;

        const img = new Image()
        img.onload = () => {
            this.sprites.set(src, img)
        }
        img.src = src

        return img;
    }

    getPattern(ctx: CanvasRenderingContext2D, src: string) {
        const pattern = this.patterns.get(src)
        if(pattern) return pattern;


        const img = new Image()
        img.onload = () => {
            const createdPattern = createPattern(ctx, img)
            if(createdPattern) {
                this.patterns.set(src, createdPattern)
            }
        }
        img.src = src;

        return this.baseStyle;
    }

    getGradient(ctx: CanvasRenderingContext2D, src: string) {
        const gradient = this.gradients.get(src)
        if(gradient) return gradient;

        const [color1, color2, width, height] = src.split('-')
        const createdGradient = createLinearGradient(ctx, color1, color2, +width, +height)
        this.gradients.set(src, createdGradient)
        return createdGradient
    }

}
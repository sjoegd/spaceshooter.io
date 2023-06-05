import { SpriteRender } from "../../../../../../../types/render_types";
import { SpacejetProperties } from "./spacejet-properties";
import { BASE_TICK_RATE } from '../../../../server-game-engine';
import { BulletTypeBase } from "../../../bullet/type/bullet-type";

export class StandardSpacejetProperties implements SpacejetProperties {
    scale: number = 1/5;
    
    hitbox = [[ 
        { "x":691, "y":356 }, 
        { "x":165.00164794921875, "y":9.99298095703125 }, 
        { "x":107, "y":0 }, 
        { "x":2.0000200271606445, "y":312.9960021972656 }, 
        { "x":2.0000200271606445, "y":398.9968566894531 }, 
        { "x":106, "y":710 }, 
        { "x":166.0016632080078, "y":698.999870300293 } 
    ]].map(arr => arr.map(({x, y}) => ({x: x*this.scale, y: y*this.scale})))
    
    baseTexture: string = 'body/spacejet.png'
    boostTexture: string = 'body/spacejet_boost.png'

    sprite: SpriteRender = {
        texture: this.baseTexture,
        xScale: this.scale,
        yScale: this.scale,
        xOffset: -50 * this.scale,
        yOffset: 0
    }

    maxSpeed: number = 10;
    speedIncrease: number = 0.25;
    angleIncrease: number = Math.PI/48;
    dampingForce: number = 0.005;

    boostMultiply: number = 2
    boostDuration: number = 0.5 * BASE_TICK_RATE
    boostCooldown: number = 2.5 * BASE_TICK_RATE

    fireRate: number = 10
    reloadDuration: number = 1 * BASE_TICK_RATE;
    bulletTypeBase: BulletTypeBase = 'standard'
    
    baseShield: number = 0
    baseHP: number = 100
    baseAmmo: number = 10

    maxShield: number = 50
    maxHP: number = 100
    maxAmmo: number = 10
}
import { Vector } from 'matter-js';

import { SpriteRender } from '../../../../../../../types/render_types';
import { BASE_TICK_RATE } from '../../../../server-game-engine';
import { BulletTypeBase } from '../../../bullet/type/bullet-type';
import { SpacejetProperties } from './spacejet-properties';

export class AlienSpacejetProperties implements SpacejetProperties {
    
    scale: number = 1/5;
    
    hitbox: Vector[][] = [[
        { "x":15, "y":1 }, { "x":51.000511169433594, "y":270.9955749511719 }, { "x":700, "y":320 }, { "x":203.0020294189453, "y":55.99346923828125 },
        { "x":12, "y":709 }, { "x":177.00177001953125, "y":663.9995193481445 }, { "x":701, "y":388 }, { "x":700, "y":320 }, { "x":51.000511169433594, "y":439.9972839355469 },
        { "x":51.000511169433594, "y":270.9955749511719 }, { "x":51.000511169433594, "y":439.9972839355469 }, { "x":700, "y":320 } 
    ]].map(arr => arr.map(({x, y}) => ({x: x*this.scale, y: y*this.scale})))
    
    baseTexture: string = 'body/alien_spacejet.png'
    boostTexture: string = 'body/alien_spacejet_boost.png'

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
    dampingForce: number = 0.0025;

    boostMultiply: number = 1.5
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
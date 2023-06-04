import { Vector } from "matter-js";
import { SpriteRender } from "../../../../../../../types/render_types";
import { SpacejetManager } from "../../../../manager/body_manager/entity/spacejet_manager";
import { BASE_TICK_RATE } from "../../../../server_game_engine";
import { BulletType } from "../../../bullet/bullet";
import { BaseBulletType } from "../../../bullet/type/base_bullet_type";
import { SpacejetSettings } from "./spacejet_settings";


export class AlienSpacejetSettings implements SpacejetSettings {
    scale: number = 1/5;

    hitbox: Vector[][] = [[
        { "x":15, "y":1 }, { "x":51.000511169433594, "y":270.9955749511719 }, { "x":700, "y":320 }, { "x":203.0020294189453, "y":55.99346923828125 },
        { "x":12, "y":709 }, { "x":177.00177001953125, "y":663.9995193481445 }, { "x":701, "y":388 }, { "x":700, "y":320 }, { "x":51.000511169433594, "y":439.9972839355469 },
        { "x":51.000511169433594, "y":270.9955749511719 }, { "x":51.000511169433594, "y":439.9972839355469 }, { "x":700, "y":320 } 
    ]].map(arr => arr.map(({x, y}) => ({x: x*this.scale, y: y*this.scale})))

    baseTexture: string = 'body/alien_spacejet.png'
    boostTexture: string = 'body/alien_spacejet.png'
    
    sprite: SpriteRender = {
        texture: this.baseTexture,
        xScale: this.scale,
        yScale: this.scale,
        xOffset: -50 * this.scale,
        yOffset: 0
    }

    maxSpeed: number = 10;
    speedIncrement: number = 0.25;
    angleIncrement: number = Math.PI/48;
    dampingForce: number = 0.005;

    boostMultiply: number = 2
    boostDurationTime: number
    boostDurationTicks: number = 0.5 * BASE_TICK_RATE
    boostCooldownTime: number
    boostCooldownTicks: number = 2.5 * BASE_TICK_RATE

    fireRate: number = 10
    fireRateTime: number 
    fireRateTicks: number = 1/this.fireRate * BASE_TICK_RATE
    reloadTime: number 
    reloadTicks: number = 1 * BASE_TICK_RATE
    bulletType: BulletType = new BaseBulletType()

    baseShield: number = 0
    baseHP: number = 100
    baseAmmo: number = 10

    maxShield: number = 50
    maxHP: number = 100
    maxAmmo: number = 10

    constructor(manager: SpacejetManager) {
        this.boostDurationTime = manager.bodyManager.gameManager.calculateTimeFromTicks(this.boostDurationTicks)
        this.boostCooldownTime = manager.bodyManager.gameManager.calculateTimeFromTicks(this.boostCooldownTicks)
        this.fireRateTime = manager.bodyManager.gameManager.calculateTimeFromTicks(this.fireRateTicks)
        this.reloadTime = manager.bodyManager.gameManager.calculateTimeFromTicks(this.reloadTicks)
    }
}
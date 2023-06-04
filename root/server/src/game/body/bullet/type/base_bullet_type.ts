import { Vector } from "matter-js";
import { SpriteRender } from "../../../../../../types/render_types";
import { BulletType } from "../bullet";

export class BaseBulletType implements BulletType {
    scale: number = 1/40;
    hitbox: Vector[][] = [[
        {x: 0, y: 0},
        {x: 950 * this.scale, y: 0},
        {x: 950 * this.scale, y: 342 * this.scale},
        {x: 0, y: 342 * this.scale}
    ]];
    sprite: SpriteRender = {
        texture: 'body/laser_bullet.png',
        xScale: this.scale,
        yScale: this.scale,
        xOffset: 0,
        yOffset: 0
    };
    damage: number = 10;
    baseSpeed: number = 35;
    minSpeed: number = 15;
}
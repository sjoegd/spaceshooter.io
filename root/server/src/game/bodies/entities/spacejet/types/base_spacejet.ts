import { BaseBulletType } from "../../../bullets/types/base_bullet";
import { SpacejetType } from "../spacejet";

export class BaseSpacejetType implements SpacejetType {
    SCALE = 1/5;
    HITBOX = [[
        {x: 20 * this.SCALE, y: 356 * this.SCALE},
        {x: 20 * this.SCALE, y: 306 * this.SCALE},
        {x: 105 * this.SCALE, y: 0 * this.SCALE},
        {x: 165 * this.SCALE, y: 8 * this.SCALE},
        {x: 375 * this.SCALE, y: 255 * this.SCALE},
        {x: 505 * this.SCALE, y: 255 * this.SCALE},
        {x: 700 * this.SCALE, y: 356 * this.SCALE },
        {x: 505 * this.SCALE, y: (712-255) * this.SCALE},
        {x: 375 * this.SCALE, y: (712-255) * this.SCALE},
        {x: 165 * this.SCALE, y: (712-8) * this.SCALE},
        {x: 105 * this.SCALE, y: 712 * this.SCALE},
        {x: 20 * this.SCALE, y: (712-306) * this.SCALE},   
    ]]
    BASE_TEXTURE = 'body/spacejet.png'
    BOOST_TEXTURE = 'body/spacejet_boost.png'
    SPRITE = {
        texture: this.BASE_TEXTURE,
        xScale: this.SCALE,
        yScale: this.SCALE,
        xOffset: -50 * this.SCALE,
        yOffset: 0
    }
    MAX_SPEED = 10;
    SPEED_INCREMENT = 0.25;
    ANGLE_INCREMENT = Math.PI/48
    DAMPING_FORCE = 0.005;
    BOOST_COOLDOWN = 2500
    BOOST_MULTIPLY = 2
    BOOST_DURATION = 500
    FIRERATE = 10;
    RELOAD_TIME = 1000;
    BULLET_TYPE = new BaseBulletType()
    BASE_SHIELD = 0;
    BASE_HEALTH = 100;
    BASE_AMMO = 10;
    MAX_SHIELD = 50;
    MAX_HEALTH = 100;
    MAX_AMMO = 10;
}
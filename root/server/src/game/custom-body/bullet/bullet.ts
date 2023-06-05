import { BulletManager } from "../../manager/body-manager/bullet/bullet-manager";
import { CustomBody } from "../custom-body";
import { Spacejet } from "../entity/spacejet/spacejet";
import { BulletType, BulletTypeBase } from './type/bullet-type';

export interface Bullet extends CustomBody {
    bodyType: 'bullet'
    manager: BulletManager

    bulletType: BulletType
    owner: Spacejet
}

export function isBullet(body: CustomBody): body is Bullet {
    return body.bodyType == 'bullet'
}

export interface BulletOptions {
    manager: BulletManager
    bulletTypeBase: BulletTypeBase
    owner: Spacejet
}

export function createBullet(x: number, y: number, options: BulletOptions) {

}
import { BulletType } from "../bullet";

export class BaseBulletType implements BulletType {
    damage = 10;
    baseSpeed = 25;
    minSpeed = 15;
    airFriction = 0.05;
}

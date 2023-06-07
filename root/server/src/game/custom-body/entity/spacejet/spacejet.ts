import { CustomBody, createCustomBody } from "../../custom-body";
import { Entity, EntityState, createEntity, isEntity } from "../entity";
import { SpacejetManager } from "../../../manager/body-manager/entity/spacejet-manager";
import { SpacejetProperties, SpacejetPropertiesBase, createSpacejetProperties } from "./properties/spacejet-properties";
import { Bodies } from "matter-js";
import { Spaceshooter } from '../../../controller/spaceshooter/spaceshooter';

export interface Spacejet extends Entity {
    manager: SpacejetManager

    entityType: 'spacejet'
    entityProperties: SpacejetProperties
    entityState: SpacejetState

    ammo: number;
    enemyKills: number;

    controller?: Spaceshooter
}

export class SpacejetState implements EntityState {
    forward: boolean = false;
    backward: boolean = false;
    left: boolean = false;
    right: boolean = false;

    shoot: boolean = false;
    lastTimeShot: number = -Infinity

    boost: boolean = false;
    isBoosting: boolean = false;
    boostStart: number = 0;
    lastBoostEnd: number = -Infinity;

    isReloading: boolean = false;
}

export function isSpacejet(body: CustomBody): body is Spacejet {
    if(!isEntity(body)) return false
    return body.entityType == 'spacejet'
}

export interface SpacejetOptions {
    spacejetPropertiesBase: SpacejetPropertiesBase
    controller?: Spaceshooter
}

export function createSpacejet(x: number, y: number, manager: SpacejetManager, options: SpacejetOptions) {

    const { spacejetPropertiesBase, controller } = options;

    const properties = createSpacejetProperties(spacejetPropertiesBase)

    const body = Bodies.fromVertices(x, y, properties.hitbox, {
        torque: 0,
        inertia: Infinity,
        density: 0.01,
        render: {
            sprite: properties.sprite
        }
    })

    const customBody = createCustomBody(body, 'entity', manager)

    const spacejet = <Spacejet> createEntity(customBody, {
        entityType: 'spacejet',
        entityProperties: properties,
        entityState: new SpacejetState(),
        controller
    })

    spacejet.ammo = properties.baseAmmo;
    spacejet.enemyKills = 0;

    return spacejet;
}


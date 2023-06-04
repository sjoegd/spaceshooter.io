import { Bodies } from "matter-js";
import { Entity, EntityState, createEntity, isEntity } from "../entity";
import { CustomBody, createCustomBody } from "../../body";
import { SpacejetManager } from "../../../manager/body_manager/entity/spacejet_manager";
import { SpacejetSettings } from "./settings/spacejet_settings";
import { SpacejetController } from "../../../controller/spacejet/spacejet_controller";

export interface Spacejet extends Entity {
    entityType: 'spacejet'
    entitySettings: SpacejetSettings
    entityState: SpacejetState
    
    controller?: SpacejetController 

    ammo: number
    enemyKills: number
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

export function isSpacejet(body: CustomBody<String>): body is Spacejet {
    if(!isEntity(body)) return false;
    return body.entityType == 'spacejet'
}

export function createSpacejet(x: number, y: number, settings: SpacejetSettings, manager: SpacejetManager): Spacejet {
    
    const body = Bodies.fromVertices(x, y, settings.hitbox, {
        torque: 0,
        inertia: Infinity,
        density: 0.015,
        render: {
            sprite: settings.sprite
        }
    })

    const customBody = createCustomBody(body, 'entity', manager)

    const spacejet = <Spacejet> createEntity(customBody, {
        entityType: 'spacejet',
        entitySettings: settings,
        entityState: new SpacejetState(),
        controller: undefined
    })
    
    spacejet.ammo = settings.baseAmmo
    spacejet.enemyKills = 0;

    return spacejet;
}
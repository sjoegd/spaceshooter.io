import { EntityManager } from "../../manager/body-manager/entity/entity-manager";
import { CustomBody } from "../custom-body";
import { Controller } from '../../controller/controller';

export interface Entity extends CustomBody {
    bodyType: 'entity'
    manager: EntityManager
    
    entityType: string
    entityProperties: EntityProperties
    entityState: EntityState

    hp: number
    shield: number
    controller?: Controller
}

export interface EntityProperties {
    maxSpeed: number
    speedIncrease: number
    angleIncrease: number
    dampingForce: number

    baseShield: number
    baseHP: number
    maxShield: number
    maxHP: number
}

export interface EntityState {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
}

export interface EntityOptions {
    entityType: string
    entityProperties: EntityProperties
    entityState: EntityState
    controller?: Controller
}

export function isEntity(body: CustomBody): body is Entity {
    return body.bodyType == 'entity'
}

export function createEntity(body: CustomBody, options: EntityOptions) {

    const { entityType, entityProperties, entityState, controller } = options;

    const entity = <Entity> body;
    entity.entityType = entityType;
    entity.entityProperties = entityProperties;
    entity.entityState = entityState;
    entity.hp = entityProperties.baseHP;
    entity.shield = entityProperties.baseShield
    entity.controller = controller;

    return entity;
}
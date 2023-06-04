import { Body } from "matter-js";
import { CustomBody } from "../body";
import { Controller } from "../../controller/controller";

export type EntityType = 'spacejet'

export interface Entity extends CustomBody<'entity'> {
    entityType: EntityType
    entitySettings: EntitySettings
    entityState: EntityState

    hp: number
    shield: number

    controller?: Controller 
}

export interface EntitySettings {
    maxSpeed: number
    speedIncrement: number
    angleIncrement: number
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
    entityType: EntityType
    entitySettings: EntitySettings
    entityState: EntityState
    controller?: Controller
}

export function isEntity(body: CustomBody<String>): body is Entity {
    return body.bodyType == 'entity'
}

export function createEntity(body: CustomBody<'entity'>, options: EntityOptions): Entity {
    const { entityType, entitySettings, entityState, controller } = options;

    const entity = <Entity> body;
    entity.entityType = entityType;
    entity.entitySettings = entitySettings;
    entity.entityState = entityState;
    entity.hp = entitySettings.baseHP;
    entity.shield = entitySettings.baseShield;
    entity.controller = controller;

    return entity;
}



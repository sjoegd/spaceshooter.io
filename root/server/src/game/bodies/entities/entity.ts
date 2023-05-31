import { Body } from "matter-js";
import { BodyManager } from "../../managers/body_manager";
import { CustomBody, CustomBodyManager, createCustomBody } from "../custom_body";
import { Spacejet, SpacejetManager } from "./spacejet/spacejet";


export type CustomEntities = Spacejet
export type CustomEntityManagers = SpacejetManager

export interface Entity<Type extends String> extends CustomBody<'entity'> {
    entityType: Type
}

export function createEntity<Type extends String>(body: Body, type: Type) {
    const entity = <Entity<Type>> createCustomBody(body, 'entity')
    entity.entityType = type;
    return entity
}

export class EntityManager implements CustomBodyManager<Entity<String>> {

    bodyManager: BodyManager
    
    managers: CustomEntityManagers[]
    spacejetManager: SpacejetManager

    constructor(manager: BodyManager) {
        this.bodyManager = manager;
        this.spacejetManager = new SpacejetManager(this)
        this.managers = [this.spacejetManager]
    }

    manage() {
        for(const manager of this.managers) {
            manager.manage()
        }
    }

    add(body: CustomBody<String>) {
        if(!this.isType(body)) return;
        for(const manager of this.managers) {
            manager.add(body)
        }
    }

    remove(body: CustomBody<String>) {
        if(!this.isType(body)) return;
        for(const manager of this.managers) {
            manager.remove(body)
        }
    }

    addToWorld(body: CustomBody<String>) {
        this.bodyManager.addBodyToWorld(body)
    }

    removeFromWorld(body: CustomBody<String>) {
        this.bodyManager.removeBodyFromWorld(body)
    }

    isType(body: CustomBody<String>): body is Entity<String> {
        return body.bodyType == 'entity'
    }
}

export interface CustomEntityManager<CustomEntity extends Entity<String>> {
    entityManager: EntityManager
    entities: CustomEntity[]
    isType: (entity: Entity<String>) => entity is CustomEntity
    manage: () => void
    remove: (body: Entity<String>) => void
    add: (body: Entity<String>) => void
}
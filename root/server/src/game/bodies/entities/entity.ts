import { Body } from "matter-js";
import { BodyManager } from "../../managers/body_manager";
import { CustomBody, CustomBodyManager, BodyType } from "../custom_body";
import { SpacejetManager } from "./spacejet";

export type EntityType = 'spacejet'

export interface Entity<Type extends EntityType> extends CustomBody<'entity'> {
    entityType: Type
}

export function createEntity<Type extends EntityType>(type: Type, body: Body) {
    const entity = <Entity<Type>> body;
    entity.entityType = type;
    return entity
}

export class EntityManager implements CustomBodyManager {

    manager: BodyManager
    
    managers: CustomEntityManager[]
    spacejetManager: SpacejetManager

    constructor(manager: BodyManager) {
        this.manager = manager;
        this.spacejetManager = new SpacejetManager(this)
        this.managers = [this.spacejetManager]
    }

    isType(body: CustomBody<BodyType>): body is Entity<EntityType> {
        return body.bodyType == 'entity'
    }

    manage(body: CustomBody<BodyType>) {
        const entity = <Entity<EntityType>> body
        for(const manager of this.managers) {
            if(!manager.isType(entity)) continue;
            manager.manage(entity)
        }
    }

    remove(body: CustomBody<BodyType>) {
        this.manager.removeBody(body)
    }

    // could maybe generalize
    handleDamage(body: CustomBody<BodyType>) {
        const entity = <Entity<EntityType>> body
        for(const manager of this.managers) {
            if(!manager.isType(entity)) continue;
            manager.handleDamage(entity)
        }
    }
}

export interface CustomEntityManager {
    manager: EntityManager
    isType: (entity: Entity<EntityType>) => entity is Entity<EntityType>
    manage: (entity: Entity<EntityType>) => void
    handleDamage: (entity: Entity<EntityType>) => void
}
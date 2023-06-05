import { CustomBody } from "../../../custom-body/custom-body";
import { Entity, isEntity } from "../../../custom-body/entity/entity";
import { BodyManager, CustomBodyManager } from "../body-manager";
import { SpacejetManager } from "./spacejet-manager";

export class EntityManager implements CustomBodyManager<Entity> {
    
    bodyManager: BodyManager;

    constructor(bodyManager: BodyManager) {
        this.bodyManager = bodyManager;
    }

    manageBody(body: CustomBody) {
        if(!this.isBodyType(body)) return;
        this.manageEntity(body)
    }

    manageEntity(entity: Entity) {

    }

    isBodyType (body: CustomBody): body is Entity {
        return isEntity(body)
    }
}

export interface EntityManagers {
    
    spacejetManager: SpacejetManager

}
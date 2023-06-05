import { CustomBody } from "../../../custom-body/custom-body";
import { Entity } from "../../../custom-body/entity/entity";
import { Spacejet, isSpacejet } from "../../../custom-body/entity/spacejet/spacejet";
import { BodyManager, CustomBodyManager } from "../body-manager";
import { EntityManager } from "./entity-manager";

export class SpacejetManager extends EntityManager implements CustomBodyManager<Spacejet> {

    constructor(bodyManager: BodyManager) {
        super(bodyManager)
    }

    manageBody(body: CustomBody) {
        super.manageBody(body)
        if(!this.isBodyType(body)) return;
        this.manageSpacejet(body)
    }

    manageSpacejet(spacejet: Spacejet) {

    }

    isBodyType(body: CustomBody): body is Spacejet {
        return isSpacejet(body)
    }
}
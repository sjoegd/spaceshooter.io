import { Vector } from "matter-js";
import { Spacejet, SpacejetType, createSpacejet } from "../../bodies/entities/spacejet/spacejet";
import { Spaceshooter } from "./spaceshooter";
import { BaseSpacejetType } from "../../bodies/entities/spacejet/types/base_spacejet";

export class Alien implements Spaceshooter {

    id: string
    type: SpacejetType
    entity: Spacejet;

    constructor(id: string, position: Vector, type: SpacejetType = new BaseSpacejetType()) {
        this.id = id;
        this.type = type;
        this.entity = this.createEntity(position)
    }

    createEntity(position: Vector): Spacejet {
        return createSpacejet(position.x, position.y, this.type, this)
    }

    process() {
        this.entity.state.forward = Math.random() > 0.5
    }

    onEntityDeath() {

    }

    onEntityStateUpdate() {

    }

}
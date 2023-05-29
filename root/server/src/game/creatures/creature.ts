import { Vector } from "matter-js";
import { Entity } from "../bodies/entities/entity";

export interface Creature<Type extends Entity<String>> {
    id: string
    entity: Type
    createEntity: (position: Vector) => Type
    process: () => void 
    onEntityDeath: () => void
}
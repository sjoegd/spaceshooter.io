import { Vector } from "matter-js";
import { Spacejet, SpacejetType } from "../../bodies/entities/spacejet/spacejet";
import { Creature } from "../creature";

export interface Spaceshooter extends Creature<Spacejet> {
    type: SpacejetType
    onEntityStateUpdate: (update: SpaceshooterStateUpdate) => void
}

export type SpaceshooterStateUpdate = 
    {update: 'health', value: number} | 
    {update: 'shield', value: number} | 
    {update: 'ammo',   value: number}
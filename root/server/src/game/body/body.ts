import { Body } from "matter-js";
import { CustomBodyManager } from "../manager/body_manager/body_manager";

export type CustomBodyType = 'powerup' | 'obstacle' | 'entity' | 'bullet'

export interface CustomBody<BodyType extends String> extends Body {
    z_index: number
    bodyType: BodyType
    manage: () => void
    manager: CustomBodyManager<BodyType>
}

export function isCustomBody(body: Body): body is CustomBody<CustomBodyType> {
    return (<CustomBody<String>> body).bodyType !== undefined
}

export function createCustomBody<BodyType extends CustomBodyType>(body: Body, type: BodyType, manager: CustomBodyManager<BodyType>, z_index = 1): CustomBody<BodyType> {
    const customBody = <CustomBody<BodyType>> body
    customBody.z_index = z_index;
    customBody.bodyType = type;
    customBody.manager = manager;
    customBody.manage = () => {
        manager.manageBody(customBody)
    }
    return customBody
}
import { Body } from "matter-js";
import { CustomBodyManager } from "../manager/body-manager/body-manager";

export interface CustomBody extends Body {
    bodyType: string
    manage: () => void
    manager: CustomBodyManager<CustomBody>
}

export function isCustomBody(body: Body): body is CustomBody {
    return (<CustomBody> body).bodyType !== undefined;
}

export function createCustomBody<BodyType extends CustomBody>(body: Body, bodyType: string, manager: CustomBodyManager<BodyType>): CustomBody {
    
    const customBody = <CustomBody> body;
    customBody.bodyType = bodyType;
    customBody.manager = manager;

    customBody.manage = () => {
        manager.manageBody(customBody)
    };

    return customBody;
}

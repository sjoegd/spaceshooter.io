import { CustomBody } from "../../../custom-body/custom-body";
import { Blackhole, isBlackhole } from "../../../custom-body/obstacle/blackhole";
import { BodyManager, CustomBodyManager } from "../body-manager";
import { ObstacleManager } from "./obstacle-manager";

export class BlackholeManager extends ObstacleManager implements CustomBodyManager<Blackhole> {

    constructor(bodyManager: BodyManager) {
        super(bodyManager)
    }

    manageBody(body: CustomBody) {
        super.manageBody(body)
        if(!this.isBodyType(body)) return;
        this.manageBlackhole(body)
    }

    manageBlackhole(blackhole: Blackhole) {

    }

    isBodyType(body: CustomBody): body is Blackhole {
        return isBlackhole(body)
    }
}

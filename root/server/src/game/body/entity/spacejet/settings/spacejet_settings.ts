import { Vector } from "matter-js"
import { EntitySettings } from "../../entity"
import { BaseSpacejetSettings } from "./base_spacejet_settings"
import { SpriteRender } from "../../../../../../../types/render_types"
import { BulletType } from "../../../bullet/bullet"
import { SpacejetManager } from "../../../../manager/body_manager/entity/spacejet_manager"
import { AlienSpacejetSettings } from "./alien_spacejet_settings"

export type SpacejetSettingsType = 'base' | 'alien'

export interface SpacejetSettings extends EntitySettings {
    scale: number
    hitbox: Vector[][]
    baseTexture: string
    boostTexture: string
    sprite: SpriteRender
    
    boostMultiply: number
    boostDurationTime: number
    boostDurationTicks: number
    boostCooldownTime: number
    boostCooldownTicks: number

    fireRateTime: number
    fireRateTicks: number
    reloadTime: number 
    reloadTicks: number
    bulletType: BulletType

    baseAmmo: number
    maxAmmo: number
}

const typeToSettings = {
    'base': BaseSpacejetSettings,
    'alien': AlienSpacejetSettings
}

export function createSpacejetSettings(type: SpacejetSettingsType, manager: SpacejetManager): SpacejetSettings {
    const settings = new typeToSettings[type](manager)
    return settings
}
import { Bodies, Body, Vector, World } from "matter-js";
import BodyManager from "../../managers/body_manager";
import { Spacejet } from "../spacejet";
import { SpriteRender } from "../../game_engine";
import { createHealthEffect } from "./effects/health_effect";
import { createSpeedEffect } from "./effects/speed_effect";
import { createShieldEffect } from "./effects/shield_effect";
import between from "../../util/between";

export interface Powerup extends Body {
    isPowerup: boolean
    effect: PowerupEffect
}

export interface PowerupEffect {
    duration: number
    spawnRate: number
    applyEffect: (spacejet: Spacejet) => void
    removeEffect: (spacejet: Spacejet) => void
    hitbox: Vector[][]
    sprite: SpriteRender
}

export type Effect = 'health' | 'speed' | 'shield'

export const POWERUP_SIZE = 50;

export function createPowerup(x: number, y: number, effect: PowerupEffect) {
    const powerup = <Powerup> Bodies.fromVertices(x, y, effect.hitbox, {
        torque: 0,
        inertia: Infinity,
        frictionAir: 1,
        render: {
            sprite: effect.sprite
        }
    })

    powerup.isPowerup = true;
    powerup.effect = effect;
    return powerup;
}

export function createEffect(duration: number, spawnRate: number, applyEffect: (spacejet: Spacejet) => void, removeEffect: (spacejet: Spacejet) => void, hitbox: Vector[][], sprite: SpriteRender) {
    const effect = <PowerupEffect> {
        duration,
        spawnRate,
        applyEffect,
        removeEffect,
        hitbox,
        sprite
    }

    return effect;
}

export class PowerupManager {

    EFFECT = {
        health: createHealthEffect(),
        speed: createSpeedEffect(),
        shield: createShieldEffect()
    }

    EFFECT_LIST: Effect[] = [
        'health',
        'speed',
        'shield'
    ]

    bodyManager: BodyManager
    powerups: Powerup[] = []
    maxPowerups: number

    constructor(bodyManager: BodyManager, powerups: number) {
        this.bodyManager = bodyManager;
        this.maxPowerups = powerups;
    }

    createPowerups() {
        for(let i = 0; i < this.maxPowerups; i++) {
            const powerup = this.createRandomPowerup(this.getRandomEffect())
            this.addPowerup(powerup)
        }
    }

    getRandomEffect() {
        const i = Math.round(between(0, this.EFFECT_LIST.length - 1))
        return this.EFFECT[this.EFFECT_LIST[i]]
    }

    createRandomPowerup(effect: PowerupEffect) {
        const {x, y} = this.bodyManager.gameEngine.getRandomPosition()
        const powerup = createPowerup(x, y, effect)
        return powerup;
    }

    managePowerups() {
        this.managePowerupSpawning()
    }

    managePowerupSpawning() {
        // see if can spawn
        const chance = 1 - (this.powerups.length / this.maxPowerups)
        if(chance < Math.random()) return;
        
        // chose effect
        const effect = this.getRandomEffect()
        if(effect.spawnRate < Math.random()) return;

        // spawn powerup
        const powerup = this.createRandomPowerup(effect)
        this.addPowerup(powerup)
    }

    addPowerup(powerup: Powerup) {
        this.powerups.push(powerup)
        World.add(this.bodyManager.world, powerup)
    }

    removePowerup(powerup: Powerup) {
        this.powerups = this.powerups.filter(p => p.id !== powerup.id)
        World.remove(this.bodyManager.world, powerup)
    }

    onSpacejetHitsPowerup(spacejet: Spacejet, powerup: Powerup) {
        powerup.effect.applyEffect(spacejet)
        this.removePowerup(powerup)

        setTimeout(() => {
            powerup.effect.removeEffect(spacejet)
        }, powerup.effect.duration)
    }
}
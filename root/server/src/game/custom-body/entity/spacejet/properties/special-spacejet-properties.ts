import { AlienSpacejetProperties } from './alien-spacejet-properties';

export class SpecialAlienSpacejetProperties extends AlienSpacejetProperties {

    constructor() {
        super()

        this.baseTexture = 'body/special_alien_spacejet.png'
        this.sprite = {
            texture: this.baseTexture,
            xScale: this.scale,
            yScale: this.scale,
            xOffset: -50 * this.scale,
            yOffset: 0
        }
    }
}
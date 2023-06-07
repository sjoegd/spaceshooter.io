import { Events, Body } from 'matter-js';
import { GameManager } from '../game-manager';
import { CustomBody, isCustomBody } from '../../custom-body/custom-body';
import { CustomBodyManager } from '../body-manager/body-manager';

export class ControllerManager {

    gameManager: GameManager

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;
    }

}
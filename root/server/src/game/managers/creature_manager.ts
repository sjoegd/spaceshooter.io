import { Socket } from "socket.io";
import { Player, PlayerInputManager } from "../creatures/spaceshooters/player";
import { GameManager } from "./game_manager";
import { Creature } from "../creatures/creature";
import { Entity } from "../bodies/entities/entity";
import { SpaceshooterStateUpdate } from '../creatures/spaceshooters/spaceshooter';
import { Vector } from "matter-js";
import { PlayerStateRender } from "../../../../types/render_types";

export class CreatureManager {

    gameManager: GameManager
    playerInputManager: PlayerInputManager

    creatures: Creature<Entity<String>>[] = []

    socketPlayer: Map<Socket, Player> = new Map()
    playerSocket: Map<Player, Socket> = new Map()

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;
        this.playerInputManager = new PlayerInputManager()
    }

    manageCreatures() {
        for(const creature of this.creatures) {
            creature.process()
        }
    }

    addSocketPlayer(socket: Socket) {
        const player = new Player(socket.id, this.gameManager.createRandomPosition(), this, this.playerInputManager)
        this.socketPlayer.set(socket, player)
        this.playerSocket.set(player, socket)
        this.addCreature(player)
    }

    removeSocketPlayer(socket: Socket) {
        const player = this.socketPlayer.get(socket)
        if(!player) return;
        this.socketPlayer.delete(socket)
        this.playerSocket.delete(player)
        this.removeCreature(player)
    }

    addCreature(creature: Creature<Entity<String>>) {
        this.creatures.push(creature)
        this.gameManager.bodyManager.addBody(creature.entity)
    }

    removeCreature(creature: Creature<Entity<String>>) {
        this.creatures = this.creatures.filter(c => c.id !== creature.id)
        this.gameManager.bodyManager.removeBody(creature.entity)
    }

    onPlayerDeath(player: Player) {
        this.removeCreature(player)
        const socket = this.playerSocket.get(player)
        if(!socket) return;
        // send death message to player or something
        this.removeSocketPlayer(socket)
    }

    onPlayerStateUpdate(player: Player, {update, value}: SpaceshooterStateUpdate) {
        const socket = this.playerSocket.get(player);
        if(!socket) return;

        const playerState: PlayerStateRender = {}
        // @ts-ignore
        playerState[update] = value // this is correct, ts doesnt see that

        this.gameManager.socketManager.onPlayerStateUpdate(socket, playerState)
    }

    onSocketKeyInput(socket: Socket, key: string, down: boolean) {
        const player = this.socketPlayer.get(socket)
        if(!player) return;
        player.onKeyInput(key, down)
    }

    getSocketPlayerState(socket: Socket): PlayerStateRender {
        const player = this.socketPlayer.get(socket)
        return player ? {
            health: player.entity.health,
            shield: player.entity.shield,
            ammo: player.entity.shield
        } : {
            health: 0,
            shield: 0,
            ammo: 0
        }
    }

    getSocketPlayerOrigin(socket: Socket): Vector | undefined {
        const player = this.socketPlayer.get(socket)
        return player?.entity.position
    }
}
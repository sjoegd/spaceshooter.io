/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useRef, useState, useEffect, useReducer } from 'react';
import { ClientGameEngine } from '../client_game_engine';
import { useWindowSize } from '@react-hook/window-size';
import Overlay from './Overlay';
import { Render } from './Render';
import { PlayerStateRender } from '../../../../types/render_types';

export interface OverlayOptions {
  setActive: (active: boolean) => void
}

export interface HudOptions {
    setPlayerState: (state: PlayerStateRender) => void
}

export function Game() {

    const [width, height] = useWindowSize()
    const [overlayActive, setOverlayActive] = useState(true)

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const engineRef = useRef<ClientGameEngine | null>(null)

    const [playerState, setPlayerState] = useReducer((state: PlayerStateRender, action: PlayerStateRender) => {
        return {...state, ...action}
    }, {health: 0, ammo: 0, score: 0, shield: 0})

    useEffect(() => {
        const canvas = canvasRef.current;
        let engine = engineRef.current;

        if(!canvas) return;

        if(!engine) {
            engine = new ClientGameEngine(
                canvas,
                width,
                height,
                {setActive: setOverlayActive},
                {setPlayerState: setPlayerState}
            )

            engineRef.current = engine;
        }

        engine.updateWindowSize(width, height)

    }, [width, height])

    return (
        <div className='select-none'>
            <Overlay 
                overlayActive={overlayActive} 
                play={() => engineRef.current!.startPlaying()}
            />
            <Render 
                playerState={playerState}
                ref={canvasRef} 
            />
        </div>

    )
}
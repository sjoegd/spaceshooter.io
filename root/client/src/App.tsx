import { useEffect, useRef, useState } from 'react';
import { ClientGameEngine } from './game/client_game_engine';
import { useWindowSize } from '@react-hook/window-size';
import Overlay from './components/Overlay';

export interface OverlayOptions {
  setActive: (active: boolean) => void
}

function App() {
  const [overlayActive, setOverlayActive] = useState(true)
  const [width, height] = useWindowSize()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameEngineRef = useRef<ClientGameEngine | null>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    let gameEngine = gameEngineRef.current;

    if(!canvas) return;

    if(!gameEngine) {
      gameEngineRef.current = new ClientGameEngine(
        canvas, 
        width, 
        height, 
        {setActive: setOverlayActive}
      )

      gameEngine = gameEngineRef.current
    } 
      
    gameEngine.updateWindowSize(width, height)

  }, [width, height])

  function playGame() {
    const game = gameEngineRef.current;
    if(!game) return;

    game.startPlaying()
  }

  return (
    <>    
      <Overlay overlayActive={overlayActive} play={() => playGame()}/>
      <canvas ref={canvasRef}></canvas>
    </>
  )
}

export default App

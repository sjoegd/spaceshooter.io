import { useEffect, useRef } from 'react';
import { ClientGameEngine } from './game/client_game_engine';
import { useWindowSize } from '@react-hook/window-size';

function App() {
  const [width, height] = useWindowSize()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameEngineRef = useRef<ClientGameEngine | null>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    const gameEngine = gameEngineRef.current;

    if(!canvas) return;

    if(!gameEngine) {
      gameEngineRef.current = new ClientGameEngine(canvas, width, height)
    } else {
      gameEngine.updateWindowSize(width, height)
    }
  }, [width, height])

  return (
    <canvas ref={canvasRef}></canvas>
  )
}

export default App

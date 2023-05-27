import { useRef, useEffect } from 'react';
import { useWindowSize } from '@react-hook/window-size';
import RenderEngine from './engines/render_engine';
import SocketEngine from './engines/socket_engine';
import InputEngine from './engines/input_engine';

const socket = new SocketEngine()
new InputEngine(socket)

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const renderRef = useRef<RenderEngine | null>(null)
  const [width, height] = useWindowSize()
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const render = renderRef.current;

    if(!canvas || !width || !height) return;
    if(!render) {
      renderRef.current = new RenderEngine(canvas, socket, width, height)
    } else {
      render.updateWindow(width, height);
    }
  }, [width, height])

  return (
    <canvas ref={canvasRef}></canvas>
  )
}

export default App

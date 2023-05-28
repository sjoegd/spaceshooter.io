import { useRef } from 'react';
// import { useWindowSize } from '@react-hook/window-size';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // const [width, height] = useWindowSize()
  
  return (
    <canvas ref={canvasRef}></canvas>
  )
}

export default App

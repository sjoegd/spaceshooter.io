import React from 'react';

import { PlayerStateRender } from '../../../../types/render_types';
import Hud from './HUD/Hud';

export const Render = React.forwardRef((props: {playerState: PlayerStateRender}, ref: React.ForwardedRef<HTMLCanvasElement>) => {

  
  const {playerState} = props;

  return (
    <>
      <Hud playerState={playerState} />
      <canvas ref={ref}></canvas>
    </>
  )
})
import { PlayerStateRender } from '../../../../../types/render_types';
import Ammobar from './Ammobar';
import Healthbar from './Healthbar';
import Scorebar from './Scorebar';
import Shieldbar from './Shieldbar';

export default function Hud(props: {playerState: PlayerStateRender}) {

    const {playerState} = props;
    const {health, shield, ammo, score} = playerState;

    return (
        <div className="fixed w-screen h-screen flex items-end z-0 p-2">
            <Scorebar score={score ?? 0} />
            <div className="w-full flex justify-center">
                <div className="space-y-1">
                    <div className="flex">
                        <Shieldbar shield={shield ?? 0} maxShield={50} />
                        <Ammobar ammo={ammo ?? 0} maxAmmo={10} />
                    </div>
                    <Healthbar health={health ?? 0} maxHealth={100} />
                </div>
            </div>
        </div>
    )
}
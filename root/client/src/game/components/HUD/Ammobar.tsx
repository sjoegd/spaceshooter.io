export default function Ammobar(props: {ammo: number, maxAmmo: number}) {

    return (
        <div className='ml-auto text-white text-3xl font-mono'>
            {`${props.ammo}/${props.maxAmmo}`}
        </div>
    )
}

export default function Shieldbar(props: {shield: number, maxShield: number}) {
    return (
        <div className="w-[400px] h-[25px] bg-orange-400 bg-opacity-60 border-black border mt-auto">
            <div 
                className="h-full bg-orange-400 border-orange-600 border-r"
                style={{width: `${props.shield/props.maxShield * 100}%`}}
            />
        </div>
    )
}
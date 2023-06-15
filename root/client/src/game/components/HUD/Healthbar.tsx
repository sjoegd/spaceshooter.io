
export default function Healthbar(props: {health: number, maxHealth: number}) {
    return (
        <div className="w-[800px] h-[50px] bg-red-900 bg-opacity-60 border-2 border-black">
            <div 
                className="h-full bg-red-900 border-red-950 border-r"
                style={{width: `${props.health/props.maxHealth * 100}%`}}
            />
        </div>
    )
}
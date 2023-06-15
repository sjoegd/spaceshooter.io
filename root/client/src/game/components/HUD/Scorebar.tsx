
export default function Scorebar(props: {score: number}) {
    return (
        <div className="text-white mb-auto flex text-3xl font-mono">
            {`Score: ${props.score}`}
        </div>
    )
}
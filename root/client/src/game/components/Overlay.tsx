
export default function Overlay(props: {overlayActive: boolean, play: () => void}) {

  const { overlayActive, play } = props;

  const overlay = <>
    <div className="fixed w-screen h-screen flex justify-center items-center text-white z-10">
      <button className="text-2xl border-white border-4 px-6 py-1 rounded bg-slate-800" onClick={play}>Play</button>
    </div>
  </>

  return (
    overlayActive ? overlay : <></>
  )
}

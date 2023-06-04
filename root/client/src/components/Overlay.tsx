
export default function Overlay(props: {overlayActive: boolean, play: () => void}) {

  const { overlayActive, play } = props;

  const overlay = <>
    <div className="fixed w-screen h-screen flex justify-center items-center text-white">
      <button onClick={play}>Play</button>
    </div>
  </>

  return (
    overlayActive ? overlay : <></>
  )
}

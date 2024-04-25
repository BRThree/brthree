import {useEffect, useRef} from "react";
import initLive2D from "@/live2dLoader/initLive2D";
import Draggable from 'react-draggable';

const Live2D = () => {
  const initRef = useRef(false);
  const container = useRef<HTMLDivElement | null>(null);

  const init = async () => {
    if (initRef.current) return
    const {live2dContainer} = await initLive2D({
      jsonPath: 'src/assets/live2DModel/ganyu/ganyu.model3.json'
    })
    container.current?.appendChild(live2dContainer)
  }

  useEffect(() => {
    init().then()

    return () => {
      initRef.current = true;
    }
  }, []);

  return (
    <Draggable>
      <div
        className={'size-fit'}
        ref={(r) => container.current = r}
      />
    </Draggable>
  );
};

export default Live2D
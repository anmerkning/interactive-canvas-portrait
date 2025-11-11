import { PerspectiveMesh } from "@pixi/layout/components";
import { Application, useApplication, useExtend, useTick } from "@pixi/react";
import {
  Assets,
  Text,
  Container,
  Graphics,
  MeshPlane,
  Sprite,
  Texture,
} from "pixi.js";
import { useEffect, useRef, useState, type RefObject } from "react";

const DEBUG = false;
const VERTICES = 5;
const SPEED = 2;
const SCALE = 20;

const POINTS = (() => {
  const points = [];
  for (let i = 0; i < VERTICES * VERTICES + VERTICES * VERTICES; i += 2)
    points.push({ x: i, y: i + 1 });
  return points;
})();

const POINT_INDEX = [6, 7, 8, 11, 12, 13, 16, 17, 18];

interface PlaneProps {}

const Plane: React.FC<PlaneProps> = () => {
  useExtend({ Graphics, Text, PerspectiveMesh });
  const containerRef = useRef<Container>(null);
  const planeRef = useRef<MeshPlane>(null);
  const graphicsRef = useRef<Graphics>(null);
  const textRefs = (() => {
    const textRefs: Array<RefObject<Text | null>> = [];
    Array.from({ length: VERTICES * VERTICES }, () =>
      textRefs.push(useRef<Text>(null)),
    );
    return textRefs;
  })();
  const [texture, setTexture] = useState(new Texture(undefined));
  const [isLoading, setLoading] = useState(true);
  const { app } = useApplication();
  const mousePos = useRef({ x: 0, y: 0 });
  const originalPos = useRef<Array<number>>([]);
  const step = useRef(0);

  useEffect(() => {
    Assets.load("http://localhost:5173/pug2.png").then((texture) => {
      setTexture(texture);
      setLoading(false);
    });

    globalThis.window.addEventListener("pointermove", (e) => {
      const width = globalThis.window.innerWidth / 2;
      const height = globalThis.window.innerHeight / 2;
      const x = (e.clientX / width - 1) * SCALE;
      const y = (e.clientY / height - 1) * SCALE;
      mousePos.current = { x, y };
    });
  }, []);

  useTick(() => {
    if (containerRef.current == null || planeRef.current == null) return;

    if (containerRef.current.y != app.canvas.height / 2 - texture.height / 2) {
      containerRef.current.x = 0;
      containerRef.current.y = app.canvas.height / 2 - texture.height / 2;
      containerRef.current.width = texture.width;
      containerRef.current.height = texture.height;
      const data =
        planeRef.current?.geometry.getAttribute("aPosition").buffer.data ?? [];
      for (let i = 0; i < data?.length; i++) {
        originalPos.current.push(data[i]);
      }
    }
    const { buffer } = planeRef.current.geometry.getAttribute("aPosition");
    for (let i = 0; i < POINT_INDEX.length; i++) {
      const index = POINT_INDEX[i];
      const x_index = POINTS[index].x;
      const y_index = POINTS[index].y;
      buffer.data[x_index] =
        originalPos.current[x_index] + mousePos.current.x * SPEED;
      buffer.data[y_index] =
        originalPos.current[y_index] +
        mousePos.current.y * SPEED +
        Math.sin(0.01 * step.current++) * 5;
    }

    if (DEBUG) {
      if (graphicsRef.current == null) return;
      graphicsRef.current.clear();
      let j = 0;
      for (let i = 0; i < buffer.data.length; i += 2) {
        const x = buffer.data[i];
        const y = buffer.data[i + 1];
        graphicsRef.current.moveTo(x, y);
        graphicsRef.current.circle(x, y, 8);
        graphicsRef.current.fill({ color: 0xff0022 });

        const textRef = textRefs[j];
        if (textRef.current == null) return;
        textRef.current.text = j;
        textRef.current.x = x;
        textRef.current.y = y;
        textRef.current.setSize(16);
        j++;
      }
    }

    buffer.update();
  });

  return (
    !isLoading && (
      <pixiContainer ref={containerRef} pivot={{ x: 0, y: 0 }}>
        <pixiMeshPlane
          ref={planeRef}
          verticesX={VERTICES}
          verticesY={VERTICES}
          texture={texture}
        ></pixiMeshPlane>
        <pixiGraphics ref={graphicsRef} draw={() => {}} />
        {Array.from({ length: VERTICES * VERTICES }, (_, i) => (
          <pixiText ref={textRefs[i]} key={i} />
        ))}
      </pixiContainer>
    )
  );
};

const Pug = () => {
  useExtend({ Sprite, MeshPlane, Container });
  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={parentRef} className="w-full h-full">
      <Application
        backgroundAlpha={0}
        autoStart
        sharedTicker
        resizeTo={parentRef}
        eventMode="static"
      >
        <Plane />
      </Application>
    </div>
  );
};

export default Pug;

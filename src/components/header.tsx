import { Application, useApplication, useExtend, useTick } from "@pixi/react";
import { BlurFilter, Container, Graphics, PI_2 } from "pixi.js";
import { useEffect, useRef, useState } from "react";

const MIN_X = 0;
const MIN_Y = 0;
const MIN_R = 1;
const MAX_R = 160;
const MIN_SPEED = 0;
const MAX_SPEED = 0.01;

const randomNumber = (min: number, max: number) => {
  return min + Math.random() * max;
};

const lerp = (a: number, b: number, t: number) => {
  return a * (1 - t) + b * t;
};

interface ParticleContainerProps {
  count: number;
}

const ParticleContainer: React.FC<ParticleContainerProps> = (props) => {
  useExtend({ Container });
  const { count } = props;
  return (
    <pixiContainer>
      {Array.from({ length: count }, (_, i) => (
        <Particle key={i} />
      ))}
    </pixiContainer>
  );
};

interface ParticleProps {}

const Particle: React.FC<ParticleProps> = () => {
  useExtend({ Graphics });
  const { app } = useApplication();
  const graphicsRef = useRef<Graphics | null>(null);
  const [ready, setReady] = useState(false);

  const r = useRef(0);
  const x = useRef(0);
  const y = useRef(0);
  const thickness = useRef(0);
  const p = useRef(0);
  const angle = useRef(PI_2);
  const speed = useRef(randomNumber(MIN_SPEED, MAX_SPEED));

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (app.canvas != null) {
        setReady(true);
        clearInterval(intervalId);
      }
    }, 500);
  }, []);

  useTick(() => {
    if (graphicsRef.current == null || app.canvas == null) return;

    if (angle.current >= PI_2) {
      graphicsRef.current.clear();
      r.current = randomNumber(MIN_R, MAX_R);
      x.current = randomNumber(MIN_X, app.canvas.width);
      y.current = randomNumber(MIN_Y, app.canvas.height);
      thickness.current = randomNumber(4, 12);
      speed.current = randomNumber(MIN_SPEED, MAX_SPEED);
      p.current = 0;
      angle.current = 0;
      graphicsRef.current.position.set(x.current, y.current);
      graphicsRef.current.moveTo(
        r.current * Math.sin(angle.current),
        r.current * Math.cos(angle.current),
      );
    } else {
      graphicsRef.current.clear();
      const sin = Math.sin(angle.current);

      graphicsRef.current?.position.set(
        r.current * sin,
        r.current * Math.cos(angle.current),
      );
      angle.current = lerp(angle.current, angle.current + 1, speed.current);
      graphicsRef.current.alpha = sin;
      graphicsRef.current.circle(x.current, y.current, r.current);
      graphicsRef.current.fill();
    }
  });

  return (
    ready && (
      <pixiGraphics
        ref={graphicsRef}
        filters={[new BlurFilter({ strength: 4 })]}
        draw={(graphics) => {
          graphics.setStrokeStyle({
            width: thickness.current,
            color: "#52616B",
            alpha: 0.2,
            cap: "square",
          });
          graphics.setFillStyle({
            color: "#F0F5F9",
            alpha: 0.2,
          });
          graphics.position.set(x.current, y.current);
          graphics.moveTo(
            r.current * Math.sin(angle.current),
            r.current * Math.cos(angle.current),
          );
        }}
      />
    )
  );
};

const Header = () => {
  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={parentRef} className="w-full h-full">
      <Application
        backgroundAlpha={0}
        autoStart
        sharedTicker
        resizeTo={parentRef}
      >
        <ParticleContainer count={40} />
      </Application>
    </div>
  );
};

export default Header;

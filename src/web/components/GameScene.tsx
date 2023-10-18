import { Stage } from '@pixi/react';
import { CSSProperties, useEffect, useState } from 'react';

export interface GameSceneProps {
  width: number;
  height: number;
  /** Background color, such as 0xffaabb */
  backgroundColor?: number;
  /** Transparency of the background color, value from 0 (fully transparent) to 1 (fully opaque) */
  backgroundAlpha?: number;
  children: React.ReactNode;
  domChildren?: React.ReactNode;
  fitWindow?: boolean;
}

export function GameScene({
  width,
  height,
  backgroundColor = 0,
  backgroundAlpha = 1,
  children,
  domChildren,
  fitWindow,
}: GameSceneProps) {
  const [styles, setStyles] = useState<CSSProperties>({});

  useEffect(() => {
    if (fitWindow) {
      const wScale = Math.round((window.innerWidth * 100) / width) / 100;
      const hScale = Math.round((window.innerHeight * 100) / height) / 100;
      if (wScale > hScale) {
        setStyles({
          transform: `scale(${hScale})`,
          marginLeft: (window.innerWidth - width * hScale) / 2,
        });
      } else {
        setStyles({
          transform: `scale(${wScale})`,
          marginTop: (window.innerHeight - height * wScale) / 2,
        });
      }
    }
  }, []);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor:
          '#' +
          backgroundColor.toString(16).padStart(6, '0') +
          Math.floor(backgroundAlpha * 256 - 1)
            .toString(16)
            .padStart(2, '0'),
        position: 'relative',
        transformOrigin: 'left top',
        ...styles,
      }}
    >
      <Stage
        width={width}
        height={height}
        options={{ backgroundColor, backgroundAlpha }}
      >
        {children}
      </Stage>
      <div
        style={{
          width,
          height,
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      >
        {domChildren}
      </div>
    </div>
  );
}

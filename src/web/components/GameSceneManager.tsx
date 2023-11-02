import { AuthProvider } from '@roxavn/core/web';
import { createContext, createElement, useContext, useState } from 'react';
import { GameScene, GameSceneProps } from './GameScene.js';

export function createSceneManager<
  T extends Record<string, React.ComponentType>,
>(scenes: T) {
  const sceneContext = createContext<{
    scene: keyof T;
    changeScene: (scene: keyof T) => void;
    setDomChildren: (domChildren: React.ReactElement[]) => void;
  }>({} as any);

  return {
    useState: () => useContext(sceneContext),
    Provider: (props: Omit<GameSceneProps, 'domChildren' | 'children'>) => {
      const [scene, changeScene] = useState<keyof T>(Object.keys(scenes)[0]);
      const [domChildren, setDomChildren] = useState<React.ReactElement[]>();

      return (
        <GameScene {...props} domChildren={domChildren}>
          <AuthProvider>
            <sceneContext.Provider
              value={{ scene, changeScene, setDomChildren }}
            >
              {createElement(scenes[scene])}
            </sceneContext.Provider>
          </AuthProvider>
        </GameScene>
      );
    },
  };
}

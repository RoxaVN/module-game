import { AuthProvider } from '@roxavn/core/web';
import { createContext, createElement, useContext, useState } from 'react';
import { GameScene, GameSceneProps } from './GameScene.js';

export function createSceneManager<
  T extends Record<string, React.ComponentType<any>>,
>(scenes: T) {
  const sceneContext = createContext<{
    scene: keyof T;
    changeScene: <K extends keyof T>(
      scene: K,
      params?: T[K] extends React.ComponentType<infer P> ? P : never
    ) => void;
    setDomChildren: (domChildren: React.ReactElement[]) => void;
  }>({} as any);

  return {
    useState: () => useContext(sceneContext),
    Provider: (props: Omit<GameSceneProps, 'domChildren' | 'children'>) => {
      const [sceneData, setSceneData] = useState<{ name: any; params?: any }>({
        name: Object.keys(scenes)[0],
      });
      const [domChildren, setDomChildren] = useState<React.ReactElement[]>();

      return (
        <GameScene {...props} domChildren={domChildren}>
          <AuthProvider>
            <sceneContext.Provider
              value={{
                scene: sceneData.name,
                changeScene: (name, params) => setSceneData({ name, params }),
                setDomChildren,
              }}
            >
              {createElement(scenes[sceneData.name], sceneData.params)}
            </sceneContext.Provider>
          </AuthProvider>
        </GameScene>
      );
    },
  };
}

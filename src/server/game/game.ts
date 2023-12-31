import { Constructor } from '@roxavn/core';
import {
  ContextDecorator,
  ServerModule,
  serviceContainer,
} from '@roxavn/core/server';
import { SocketEvents } from '@roxavn/module-socket/base';
import {
  ServerSocketNamespace,
  makeSocketContextDecorator,
} from '@roxavn/module-socket/server';

import { ServerGameManager } from './manager.js';
import { ServerGameStorage } from './storage.js';
import {
  BaseGame,
  ClientToServerEx,
  GameData,
  ServerToClientEx,
} from '../../base/index.js';

export class ServerGame<
  C extends SocketEvents = SocketEvents,
  S extends SocketEvents = SocketEvents,
  E extends SocketEvents = SocketEvents,
  D = any,
  G extends GameData = GameData,
> extends BaseGame<C, S, G> {
  static games: Record<string, Constructor<ServerGameManager>> = {};
  static storages: Record<string, ServerGameStorage> = {};
  static managers: Record<string, ServerGameManager> = {};

  static async getGameStorage(roomId: string) {
    if (!(roomId in this.storages)) {
      const service = await serviceContainer.getAsync(ServerGameStorage);
      service.roomId = roomId;
      this.storages[roomId] = service;
    }
    return this.storages[roomId];
  }

  static async getGameManager(game: string, roomId: string) {
    if (!(roomId in this.managers)) {
      const service: ServerGameManager = await serviceContainer.getAsync(
        this.games[game]
      );
      service.game = game;
      service.storage = await this.getGameStorage(roomId);
      this.managers[roomId] = service;
    }
    return this.managers[roomId];
  }

  static async closeRoom(roomId: string) {
    const gameStorage = await ServerGame.getGameStorage(roomId);
    await gameStorage.dispose();
    delete this.managers[roomId];
    delete this.storages[roomId];
  }

  static fromBase<
    C extends SocketEvents = SocketEvents,
    S extends SocketEvents = SocketEvents,
    E extends SocketEvents = SocketEvents,
    D = any,
    G extends GameData = GameData,
  >(
    baseGame: BaseGame<C, S, G>,
    serverModule: ServerModule
  ): ServerGame<ClientToServerEx<C, G>, ServerToClientEx<S, G>, E, D, G> {
    return new ServerGame(baseGame.name, serverModule);
  }

  public readonly serverIO: ServerSocketNamespace<C, S, E, D>;

  constructor(
    name: string,
    protected serverModule: ServerModule
  ) {
    super(name);
    this.serverIO = new ServerSocketNamespace(
      name,
      this.baseIO.options,
      serverModule
    );
  }

  broadcastOperator(manager: ServerGameManager) {
    return this.serverIO.namespace.to(manager.storage.roomId);
  }

  useGame() {
    return (
      serviceClass: Constructor<
        ServerGameManager & {
          [key in G['state']]: () => Promise<void>;
        }
      >
    ) => {
      this.serverModule.injectable({ scope: 'Transient' })(serviceClass);
      ServerGame.games[this.name] = serviceClass;
    };
  }

  injectStorage = (options?: {
    /**
     * Throw error if socket didn't join room
     */
    checkSocket?: boolean;
  }) => {
    const result: ContextDecorator<ServerGameStorage> = (
      target,
      propertyKey,
      parameterIndex
    ) => {
      makeSocketContextDecorator(
        target,
        propertyKey,
        parameterIndex,
        async (context) => {
          const roomId = context.request[0]?.roomId;
          if (roomId) {
            if (options?.checkSocket) {
              if (!context.socket.rooms.has(roomId)) {
                throw new Error(
                  `[ServerGame] socket didn't join room ${roomId}`
                );
              }
            }
            const service = await ServerGame.getGameStorage(roomId);
            return service;
          }
          throw new Error(
            '[ServerGame] can get game presence of room undefined'
          );
        }
      );
    };
    return result;
  };
}

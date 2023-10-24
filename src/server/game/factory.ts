import {
  ContextDecorator,
  ServerModule,
  serviceContainer,
} from '@roxavn/core/server';
import { BaseSocketNamespace, SocketEvents } from '@roxavn/module-socket/base';
import {
  ServerSocketNamespace,
  makeSocketContextDecorator,
} from '@roxavn/module-socket/server';

import { ServerGameManager } from './manager.js';
import { ServerGameStorage } from './storage.js';

export class ServerGameFactory<
  C extends SocketEvents = SocketEvents,
  S extends SocketEvents = SocketEvents,
  E extends SocketEvents = SocketEvents,
  D = any,
> extends ServerSocketNamespace<C, S, E, D> {
  static games: Record<string, { new (...args: any[]): ServerGameManager }> =
    {};
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
      service.storage = await this.getGameStorage(roomId);
      this.managers[roomId] = service;
    }
    return this.managers[roomId];
  }

  static async closeRoom(roomId: string) {
    const gameStorage = await ServerGameFactory.getGameStorage(roomId);
    await gameStorage.dispose();
    delete this.managers[roomId];
    delete this.storages[roomId];
  }

  static fromBase<
    E extends SocketEvents = SocketEvents,
    D = any,
    C extends SocketEvents = SocketEvents,
    S extends SocketEvents = SocketEvents,
  >(
    baseSocketNamespace: BaseSocketNamespace<C, S>,
    serverModule: ServerModule
  ): ServerGameFactory<C, S, E, D> {
    return new ServerGameFactory(
      baseSocketNamespace.name,
      baseSocketNamespace.options,
      serverModule
    );
  }

  useGame() {
    return (serviceClass: { new (...args: any[]): ServerGameManager }) => {
      this.serverModule.injectable({ scope: 'Transient' })(serviceClass);
      ServerGameFactory.games[this.name] = serviceClass;
    };
  }

  injectStore = (options?: {
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
                  `[ServerGameFactory] socket didn't join room ${roomId}`
                );
              }
            }
            const service = await ServerGameFactory.getGameStorage(roomId);
            return service;
          }
          throw new Error(
            '[ServerGameFactory] can get game presence of room undefined'
          );
        }
      );
    };
    return result;
  };
}

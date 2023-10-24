import { ContextDecorator, serviceContainer } from '@roxavn/core/server';
import {
  ServerSocketNamespace,
  makeSocketContextDecorator,
} from '@roxavn/module-socket/server';

import { ServerGameManager } from './manager.js';
import { ServerGamePresence } from './presence.js';

export class ServerGameFactory extends ServerSocketNamespace {
  static games: Record<string, { new (...args: any[]): ServerGameManager }> =
    {};
  static presences: Record<string, ServerGamePresence> = {};
  static managers: Record<string, ServerGameManager> = {};

  static async getGamePresence(roomId: string) {
    if (!(roomId in this.presences)) {
      const service = await serviceContainer.getAsync(ServerGamePresence);
      service.roomId = roomId;
      this.presences[roomId] = service;
    }
    return this.presences[roomId];
  }

  static async getGameManager(game: string, roomId: string) {
    if (!(roomId in this.managers)) {
      const service = await serviceContainer.getAsync(this.games[game]);
      service.gamePresence = await this.getGamePresence(roomId);
      this.managers[roomId] = service;
    }
    return this.managers[roomId];
  }

  static async closeRoom(roomId: string) {
    const gamePresence = await ServerGameFactory.getGamePresence(roomId);
    await gamePresence.dispose();
    delete this.managers[roomId];
    delete this.presences[roomId];
  }

  useGame() {
    return (serviceClass: { new (...args: any[]): ServerGameManager }) => {
      this.serverModule.injectable({ scope: 'Transient' })(serviceClass);
      ServerGameFactory.games[this.name] = serviceClass;
    };
  }

  injectPresence = (options?: {
    /**
     * Throw error if socket didn't join room
     */
    checkSocket?: boolean;
  }) => {
    const result: ContextDecorator<ServerGamePresence> = (
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
            const service = await ServerGameFactory.getGamePresence(roomId);
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

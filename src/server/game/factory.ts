import { ContextDecorator, serviceContainer } from '@roxavn/core/server';
import {
  ServerSocketNamespace,
  makeSocketContextDecorator,
} from '@roxavn/module-socket/server';

import { serverModule } from '../module.js';
import { ServerGameManager } from './manager.js';
import { ServerGamePresence } from './presence.js';

@serverModule.injectable()
export class ServerGameFactory extends ServerSocketNamespace {
  static games: Record<string, { new (...args: any[]): ServerGameManager }> =
    {};

  presences: Record<string, ServerGamePresence> = {};
  managers: Record<string, ServerGameManager> = {};

  async getGamePresence(roomId: string) {
    if (!(roomId in this.presences)) {
      const service = await serviceContainer.getAsync(ServerGamePresence);
      service.roomId = roomId;
      this.presences[roomId] = service;
    }
    return this.presences[roomId];
  }

  async getGameManager(roomId: string) {
    if (!(roomId in this.managers)) {
      const service = await serviceContainer.getAsync(ServerGameManager);
      service.gamePresence = await this.getGamePresence(roomId);
      this.managers[roomId] = service;
    }
    return this.managers[roomId];
  }

  useGame() {
    return (serviceClass: { new (...args: any[]): ServerGameManager }) => {
      this.serverModule.injectable()(serviceClass);
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
            const service = await this.getGamePresence(roomId);
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

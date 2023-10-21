import { PresenceService, inject, serviceContainer } from '@roxavn/core/server';
import { ServerSocketNamespace } from '@roxavn/module-socket/server';

import { serverModule } from './module.js';

@serverModule.injectable({ scope: 'Transient' })
export class ServerGamePresence {
  presence: PresenceService['implementer'];
  roomId: string;

  constructor(
    @inject(PresenceService) protected presenceService: PresenceService
  ) {
    this.presence = this.presenceService.implementer;
  }

  getKey(key: string) {
    if (this.roomId) {
      const result = `gameRoom:${this.roomId}:${key}`;
      this.presence.sadd(`gameRoom:${this.roomId}`, key);
      return result;
    }
    throw new Error('[ServerGameData] must set roomId');
  }

  async dispose() {
    if (this.roomId) {
      const keys = await this.presence.smembers(`gameRoom:${this.roomId}`);
      keys.push(`gameRoom:${this.roomId}`);
      await Promise.all(keys.map((k) => this.presence.del(k)));
    }
  }
}

@serverModule.injectable({ scope: 'Transient' })
export abstract class ServerGameManager {
  gamePresence: ServerGamePresence;

  async setState(state: keyof this) {
    await this.gamePresence.presence.set(
      this.gamePresence.getKey('state'),
      state as string
    );
    (this[state] as any)();
  }

  async getCurrentState() {
    const result = await this.gamePresence.presence.get(
      this.gamePresence.getKey('state')
    );
    return result as string;
  }
}

@serverModule.injectable()
export class ServerGameFactory extends ServerSocketNamespace {
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
}

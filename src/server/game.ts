import { PresenceService, inject } from '@roxavn/core/server';

import { serverModule } from './module.js';

@serverModule.injectable()
export abstract class ServerGameRoom {
  presence: PresenceService['implementer'];
  roomId: string;

  constructor(
    @inject(PresenceService) protected presenceService: PresenceService
  ) {
    this.presence = this.presenceService.implementer;
  }

  abstract init(): void;

  getKey(key: string) {
    const result = `gameRoom:${this.roomId}:${key}`;
    this.presence.sadd(`gameRoom:${this.roomId}`, key);
    return result;
  }

  async setState(state: keyof this) {
    await this.presence.set(this.getKey('state'), state as string);
    (this[state] as any)();
  }

  async getCurrentState() {
    const result = await this.presence.get(this.getKey('state'));
    return result as string;
  }

  async dispose() {
    const keys = await this.presence.smembers(`gameRoom:${this.roomId}`);
    keys.push(`gameRoom:${this.roomId}`);
    await Promise.all(keys.map((k) => this.presence.del(k)));
  }
}

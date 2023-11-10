import { PresenceService, inject } from '@roxavn/core/server';
import { serverModule } from '../module.js';

@serverModule.injectable({ scope: 'Transient' })
export class ServerGameStorage {
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
      this.presence.sAdd(`gameRoom:${this.roomId}`, key);
      return result;
    }
    throw new Error('[ServerGameData] must set roomId');
  }

  getGeneralKey() {
    return this.getKey('general');
  }

  async dispose() {
    if (this.roomId) {
      const keys = await this.presence.sMembers(`gameRoom:${this.roomId}`);
      keys.push(`gameRoom:${this.roomId}`);
      await Promise.all(keys.map((k) => this.presence.del(k)));
    }
  }
}

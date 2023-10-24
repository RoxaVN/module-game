import { serverModule } from '../module.js';
import { ServerGamePresence } from './presence.js';

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

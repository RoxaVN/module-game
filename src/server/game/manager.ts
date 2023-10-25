import { serverModule } from '../module.js';
import { ServerGameStorage } from './storage.js';

@serverModule.injectable({ scope: 'Transient' })
export abstract class ServerGameManager {
  storage: ServerGameStorage;

  abstract init(): Promise<void>;

  async setState(state: keyof this) {
    await this.storage.presence.set(
      this.storage.getKey('state'),
      state as string
    );
    return (this[state] as any)();
  }

  async getCurrentState() {
    const result = await this.storage.presence.get(
      this.storage.getKey('state')
    );
    return result as string | undefined;
  }

  async restore() {
    const state = await this.getCurrentState();
    if (state) {
      await this.setState(state as any);
    } else {
      await this.init();
    }
  }
}

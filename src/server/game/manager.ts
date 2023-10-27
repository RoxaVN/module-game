import { SocketIoService } from '@roxavn/module-socket/server';
import { serverModule } from '../module.js';
import { ServerGameStorage } from './storage.js';

@serverModule.injectable({ scope: 'Transient' })
export abstract class ServerGameManager {
  storage: ServerGameStorage;
  game: string;

  abstract init(): Promise<void>;

  async setState(state: keyof this) {
    await this.storage.presence.set(
      this.storage.getKey('__state__'),
      state as string
    );
    SocketIoService.getNamespace(this.game)
      .to(this.storage.roomId)
      .emit('updateState', { state, roomId: this.storage.roomId });
    return (this[state] as any)();
  }

  async getCurrentState() {
    const result = await this.storage.presence.get(
      this.storage.getKey('__state__')
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

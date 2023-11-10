import { SocketIoService } from '@roxavn/module-socket/server';
import { serverModule } from '../module.js';
import { ServerGameStorage } from './storage.js';
import { GameData } from '../../base/index.js';

@serverModule.injectable({ scope: 'Transient' })
export abstract class ServerGameManager<T extends GameData = GameData> {
  storage: ServerGameStorage;
  game: string;

  abstract init(): Promise<void>;

  async setGeneralData(newValue: Partial<T>) {
    await this.storage.presence.jsonMerge(
      this.storage.getGeneralKey(),
      '$',
      newValue
    );
    SocketIoService.getNamespace(this.game)
      .to(this.storage.roomId)
      .emit('updateGeneral', { roomId: this.storage.roomId, ...newValue });
  }

  async setState(state: keyof this, otherGeneralData?: Partial<T>) {
    await this.setGeneralData({
      state,
      ...otherGeneralData,
    } as any);
    return (this[state] as any)();
  }

  async getCurrentState() {
    const result = await this.storage.presence.jsonGet(
      this.storage.getGeneralKey(),
      '$.state'
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

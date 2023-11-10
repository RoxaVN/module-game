import { SocketEvents } from '@roxavn/module-socket/base';
import { WebSocketNamespace } from '@roxavn/module-socket/web';
import { BaseGame, GameData, ServerToClientEx } from '../base/index.js';

export class WebGame<
  C extends SocketEvents,
  S extends SocketEvents,
> extends WebSocketNamespace<C, S> {
  onRoomEvent<K extends keyof S>(event: K, roomId: string) {
    return this.onEvent(event, { filter: (data) => data?.roomId === roomId });
  }

  onGeneralData(roomId: string) {
    return this.onEvent('updateGeneral', {
      filter: (data) => data?.roomId === roomId,
      merge: true,
    });
  }

  static fromBase<
    ClientToServer extends SocketEvents,
    ServerToClient extends SocketEvents,
    Game extends GameData,
  >(
    base: BaseGame<ClientToServer, ServerToClient, Game>
  ): WebGame<ClientToServer, ServerToClientEx<ServerToClient, Game>> {
    return new WebGame(base.name, base.options);
  }
}

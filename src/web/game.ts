import { SocketEvents } from '@roxavn/module-socket/base';
import { WebSocketNamespace } from '@roxavn/module-socket/web';
import { BaseGame, GameState } from '../base/index.js';

export class WebGame<
  C extends SocketEvents,
  S extends SocketEvents,
  G extends GameState,
> extends WebSocketNamespace<C, S> {
  onState(): G | undefined {
    const data = this.onEvent('updateState');
    return data && data[0];
  }

  static fromBase<
    ClientToServer extends SocketEvents,
    ServerToClient extends SocketEvents,
    Game extends GameState,
  >(
    base: BaseGame<ClientToServer, ServerToClient, Game>
  ): WebGame<ClientToServer, ServerToClient, Game> {
    return new WebGame(base.name, base.options);
  }
}

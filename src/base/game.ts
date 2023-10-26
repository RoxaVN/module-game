import { BaseSocketNamespace, SocketEvents } from '@roxavn/module-socket/base';

export interface GameState {
  type: string;
}

export class BaseGame<
  ClientToServer extends SocketEvents,
  ServerToClient extends SocketEvents,
  State extends GameState,
> extends BaseSocketNamespace<
  ClientToServer,
  ServerToClient & {
    updateState: (state: State) => void;
  }
> {}

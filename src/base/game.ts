import { BaseSocketNamespace, SocketEvents } from '@roxavn/module-socket/base';

export class BaseGame<
  ClientToServer extends SocketEvents,
  ServerToClient extends SocketEvents,
  States extends string,
> extends BaseSocketNamespace<
  ClientToServer,
  ServerToClient & {
    updateState: (data: { state: States }) => void;
  }
> {}

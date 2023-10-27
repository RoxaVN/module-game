import { BaseSocketNamespace, SocketEvents } from '@roxavn/module-socket/base';

export type GameState = string;

export type ServerToClientEx<
  T extends SocketEvents,
  State extends GameState,
> = T & {
  updateState: (data: { state: State; roomId: string }) => void;
};

export class BaseGame<
  ClientToServer extends SocketEvents,
  ServerToClient extends SocketEvents,
  State extends GameState,
> extends BaseSocketNamespace<
  ClientToServer,
  ServerToClientEx<ServerToClient, State>
> {}

import { BaseSocketNamespace, SocketEvents } from '@roxavn/module-socket/base';

export type GameData = {
  state: string;
  [key: string]: any;
};

export type ServerToClientEx<
  T extends SocketEvents,
  Generaldata extends GameData,
> = T & {
  updateGeneral: (
    data: Generaldata & {
      roomId: string;
    }
  ) => void;
};

export class BaseGame<
  ClientToServer extends SocketEvents,
  ServerToClient extends SocketEvents,
  Generaldata extends GameData,
> extends BaseSocketNamespace<
  ClientToServer,
  ServerToClientEx<ServerToClient, Generaldata>
> {}

import { FullApiResponse } from '@roxavn/core';
import { BaseSocketNamespace, SocketEvents } from '@roxavn/module-socket/base';

export type GameData = {
  state: string;
  [key: string]: any;
};

export type ClientToServerEx<
  T extends SocketEvents,
  Generaldata extends GameData,
> = T & {
  getGeneral: (
    request: { roomId: string },
    ack: (response: FullApiResponse<Generaldata>) => void
  ) => void;
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
> {
  public readonly baseIO: BaseSocketNamespace<
    ClientToServerEx<ClientToServer, Generaldata>,
    ServerToClientEx<ServerToClient, Generaldata>
  >;

  constructor(public readonly name: string) {
    this.baseIO = new BaseSocketNamespace(name, { needAuth: true });
  }
}

import { SocketEvents } from '@roxavn/module-socket/base';
import { WebSocketNamespace } from '@roxavn/module-socket/web';
import { useEffect } from 'react';

import {
  BaseGame,
  ClientToServerEx,
  GameData,
  ServerToClientEx,
} from '../base/index.js';

export class WebGame<
  C extends SocketEvents,
  S extends SocketEvents,
  G extends GameData,
> extends BaseGame<C, S, G> {
  onRoomEvent<K extends keyof S>(event: K, roomId: string) {
    return this.webIO.onEvent(event, {
      filter: (data) => data?.roomId === roomId,
    });
  }

  onGeneralData(roomId: string) {
    const result = this.webIO.onEvent('updateGeneral', {
      filter: (data) => data?.roomId === roomId,
      merge: true,
    });

    useEffect(() => {
      const socket: any = this.webIO.get();
      socket.emit('getGeneral', { roomId }, (resp: any) => {
        if (resp.data) {
          result[1](resp.data);
        }
      });
    }, []);

    return result;
  }

  public readonly webIO: WebSocketNamespace<C, S>;

  constructor(name: string) {
    super(name);
    this.webIO = new WebSocketNamespace(name, this.baseIO.options);
  }

  static fromBase<
    ClientToServer extends SocketEvents,
    ServerToClient extends SocketEvents,
    Game extends GameData,
  >(
    base: BaseGame<ClientToServer, ServerToClient, Game>
  ): WebGame<
    ClientToServerEx<ClientToServer, Game>,
    ServerToClientEx<ServerToClient, Game>,
    Game
  > {
    return new WebGame(base.name);
  }
}

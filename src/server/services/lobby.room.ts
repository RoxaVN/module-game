import { NotFoundException } from '@roxavn/core';
import {
  BaseService,
  type InferContext,
  inject,
  ServerModule,
} from '@roxavn/core/server';
import { SocketAuthUser } from '@roxavn/module-socket/server';

import { serverModule } from '../module.js';
import { ClientToServerLobbyEvents } from '../../base/socket.js';
import { GetGameRoomsApiService } from './game.room.js';
import { JoinGameRoomService, LeaveGameRoomService } from './user.game.room.js';

@serverModule.injectable()
export abstract class GetGameRoomsSocketService extends BaseService {
  abstract game: string;

  constructor(
    @inject(GetGameRoomsApiService)
    protected getGameRoomsApiService: GetGameRoomsApiService
  ) {
    super();
  }

  async handle([request, ack]: Parameters<
    ClientToServerLobbyEvents['getRooms']
  >) {
    const result = await this.getGameRoomsApiService.handle({
      game: this.game,
      ...request,
    });
    ack({
      code: 200,
      data: result,
    });
  }
}

@serverModule.injectable()
export abstract class GetAvailableGameRoomSocketService extends BaseService {
  abstract game: string;

  constructor(
    @inject(GetGameRoomsApiService)
    protected getGameRoomsApiService: GetGameRoomsApiService
  ) {
    super();
  }

  async handle([request, ack]: Parameters<
    ClientToServerLobbyEvents['getAvailableRoom']
  >) {
    const result = await this.getGameRoomsApiService.handle({
      game: this.game,
      ...request,
      pageSize: 1,
    });
    if (result.pagination.totalItems) {
      ack({
        code: 200,
        data: result.items[0],
      });
    } else {
      const error = new NotFoundException();
      ack({
        code: error.code,
        error: error.toJson(),
      });
    }
  }
}

@serverModule.injectable()
export abstract class JoinGameRoomSocketService extends BaseService {
  abstract game: string;
  abstract beforeJoin?: (roomId: string, userId: string) => Promise<void>;
  abstract afterJoin?: (roomId: string, userId: string) => Promise<void>;

  constructor(
    @inject(JoinGameRoomService)
    protected ioinGameRoomService: JoinGameRoomService
  ) {
    super();
  }

  async handle(
    [request, ack]: Parameters<ClientToServerLobbyEvents['joinRoom']>,
    @SocketAuthUser authUser: InferContext<typeof SocketAuthUser>
  ) {
    try {
      if (this.beforeJoin) {
        await this.beforeJoin(request.gameRoomId, authUser.id);
      }
      await this.ioinGameRoomService.handle({
        userId: authUser.id,
        gameRoomId: request.gameRoomId,
      });
      if (this.afterJoin) {
        await this.afterJoin(request.gameRoomId, authUser.id);
      }
      ack({ code: 200 });
    } catch (e: any) {
      ack(ServerModule.parseError(e));
    }
  }
}

@serverModule.injectable()
export abstract class LeaveGameRoomSocketService extends BaseService {
  abstract game: string;
  abstract afterLeave?: (roomId: string, userId: string) => Promise<void>;

  constructor(
    @inject(LeaveGameRoomService)
    protected leaveGameRoomService: LeaveGameRoomService
  ) {
    super();
  }

  async handle(
    [request, ack]: Parameters<ClientToServerLobbyEvents['leaveRoom']>,
    @SocketAuthUser authUser: InferContext<typeof SocketAuthUser>
  ) {
    try {
      await this.leaveGameRoomService.handle({
        userId: authUser.id,
        gameRoomId: request.gameRoomId,
      });
      if (this.afterLeave) {
        await this.afterLeave(request.gameRoomId, authUser.id);
      }
      ack({ code: 200 });
    } catch (e: any) {
      ack(ServerModule.parseError(e));
    }
  }
}

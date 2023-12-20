import { FullApiResponse, NotFoundException } from '@roxavn/core';
import {
  BaseService,
  type InferContext,
  inject,
  ServerModule,
  databaseUtils,
} from '@roxavn/core/server';
import {
  SocketAuthUser,
  SocketConnection,
  SocketNamespace,
} from '@roxavn/module-socket/server';

import { serverModule } from '../module.js';
import { ClientToServerLobbyEvents, GameData } from '../../base/index.js';
import {
  CreateGameRoomApiService,
  GetGameRoomsApiService,
} from './game.room.js';
import { JoinGameRoomService, LeaveGameRoomService } from './user.game.room.js';
import { GameName, ServerGame } from '../game/index.js';

@serverModule.injectable()
export class GetGameRoomsSocketService extends BaseService {
  constructor(
    @inject(GetGameRoomsApiService)
    protected getGameRoomsApiService: GetGameRoomsApiService
  ) {
    super();
  }

  async handle(
    [request, ack]: Parameters<ClientToServerLobbyEvents['getRooms']>,
    @SocketConnection socket: InferContext<typeof SocketConnection>,
    @GameName game: InferContext<typeof GameName>
  ) {
    const result = await this.getGameRoomsApiService.handle({
      game,
      ...request,
    });
    ack({
      code: 200,
      data: result,
    });
    socket.join('lobby');
  }
}

@serverModule.injectable()
export class GetAvailableGameRoomSocketService extends BaseService {
  constructor(
    @inject(GetGameRoomsApiService)
    protected getGameRoomsApiService: GetGameRoomsApiService
  ) {
    super();
  }

  async handle(
    [request, ack]: Parameters<ClientToServerLobbyEvents['getAvailableRoom']>,
    @GameName game: InferContext<typeof GameName>
  ) {
    const result = await this.getGameRoomsApiService.handle({
      game,
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
export class JoinGameRoomSocketService extends BaseService {
  beforeJoin?: (roomId: string, userId: string) => Promise<void>;
  afterJoin?: (roomId: string, userId: string) => Promise<void>;

  constructor(
    @inject(JoinGameRoomService)
    protected ioinGameRoomService: JoinGameRoomService
  ) {
    super();
  }

  async handle(
    [request, ack]: Parameters<ClientToServerLobbyEvents['joinRoom']>,
    @SocketAuthUser authUser: InferContext<typeof SocketAuthUser>,
    @SocketConnection socket: InferContext<typeof SocketConnection>
  ) {
    try {
      if (this.beforeJoin) {
        await this.beforeJoin(request.roomId, authUser.id);
      }
      try {
        await databaseUtils.runInTransaction(() => {
          return this.ioinGameRoomService.handle({
            userId: authUser.id,
            gameRoomId: request.roomId,
          });
        });
      } catch (e) {
        if (!databaseUtils.isDuplicateKeyError(e)) {
          throw e;
        }
      }
      if (this.afterJoin) {
        await this.afterJoin(request.roomId, authUser.id);
      }
      ack({ code: 200 });
      socket.leave('lobby');
      socket.join(request.roomId);
    } catch (e: any) {
      ack(ServerModule.parseError(e));
    }
  }
}

@serverModule.injectable()
export class LeaveGameRoomSocketService extends BaseService {
  afterLeave?: (roomId: string, userId: string) => Promise<void>;

  constructor(
    @inject(LeaveGameRoomService)
    protected leaveGameRoomService: LeaveGameRoomService
  ) {
    super();
  }

  async handle(
    [request, ack]: Parameters<ClientToServerLobbyEvents['leaveRoom']>,
    @SocketAuthUser authUser: InferContext<typeof SocketAuthUser>,
    @SocketConnection socket: InferContext<typeof SocketConnection>
  ) {
    try {
      await this.leaveGameRoomService.handle({
        userId: authUser.id,
        gameRoomId: request.roomId,
      });
      if (this.afterLeave) {
        await this.afterLeave(request.roomId, authUser.id);
      }
      socket.leave(request.roomId);
      ack({ code: 200 });
    } catch (e: any) {
      ack(ServerModule.parseError(e));
    }
  }
}

@serverModule.injectable()
export class CreateGameRoomSocketService extends BaseService {
  constructor(
    @inject(CreateGameRoomApiService)
    protected createGameRoomApiService: CreateGameRoomApiService
  ) {
    super();
  }

  async handle(
    [request, ack]: Parameters<ClientToServerLobbyEvents['createRoom']>,
    @SocketAuthUser authUser: InferContext<typeof SocketAuthUser>,
    @SocketNamespace socketNamespace: InferContext<typeof SocketNamespace>,
    @GameName game: InferContext<typeof GameName>
  ) {
    try {
      const result = await this.createGameRoomApiService.handle({
        game,
        userId: authUser.id,
        ...request,
      });
      ack({ code: 200, data: result });
      socketNamespace.to('lobby').emit('createRoom', result);
    } catch (e: any) {
      ack(ServerModule.parseError(e));
    }
  }
}

@serverModule.injectable()
export class GetGameRoomGeneralSocketService<
  T extends GameData = GameData,
> extends BaseService {
  parseData?: (
    data: T,
    context: { roomId: string; userId: string }
  ) => Promise<void>;

  async handle(
    [request, ack]: [{ roomId: string }, (resp: FullApiResponse<T>) => void],
    @SocketAuthUser authUser: InferContext<typeof SocketAuthUser>
  ) {
    const storage = await ServerGame.getGameStorage(request.roomId);
    const result = await storage.presence.jsonGet(storage.getGeneralKey(), '$');

    if (this.parseData) {
      await this.parseData(result, {
        roomId: request.roomId,
        userId: authUser.id,
      });
    }

    ack({ code: 200, data: result });
  }
}

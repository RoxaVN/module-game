import { InferApiRequest } from '@roxavn/core';
import { InjectDatabaseService } from '@roxavn/core/server';
import { Raw } from 'typeorm';

import { serverModule } from '../module.js';
import { GameRoom } from '../entities/index.js';
import { gameRoomApi } from '../../base/index.js';

@serverModule.useApi(gameRoomApi.create)
export class CreateGameRoomApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof gameRoomApi.create>) {
    const item = new GameRoom();
    Object.assign(item, request);

    await this.entityManager.getRepository(GameRoom).insert(item);
    return item;
  }
}

@serverModule.useApi(gameRoomApi.update)
export class UpdateGameRoomApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof gameRoomApi.update>) {
    await this.entityManager.getRepository(GameRoom).update(
      { id: request.gameRoomId },
      {
        name: request.name,
        mode: request.mode,
        private: request.private,
        locked: request.locked,
        metadata: request.metadata,
      }
    );
    return {};
  }
}

@serverModule.useApi(gameRoomApi.getMany)
export class GetGameRoomsApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof gameRoomApi.getMany>) {
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;

    const [items, totalItems] = await this.entityManager
      .getRepository(GameRoom)
      .findAndCount({
        where: {
          game: request.game,
          mode: request.mode,
          locked: request.locked,
          private: request.private,
          maxUsers: request.isAvailable
            ? Raw((alias) => `${alias} = 0 OR ${alias} > userCount`)
            : undefined,
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

    return {
      items: items,
      pagination: { page, pageSize, totalItems },
    };
  }
}

@serverModule.useApi(gameRoomApi.delete)
export class DeleteGameRoomApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof gameRoomApi.delete>) {
    await this.entityManager
      .getRepository(GameRoom)
      .delete({ id: request.gameRoomId });
    return {};
  }
}

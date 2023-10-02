import { InjectDatabaseService } from '@roxavn/core/server';
import { Raw } from 'typeorm';

import { serverModule } from '../module.js';
import { GameRoom } from '../entities/game.room.entity.js';

@serverModule.injectable()
export class CreateGameRoomService extends InjectDatabaseService {
  async handle(request: {
    game: string;
    userId?: string;
    name?: string;
    mode?: string;
    private?: boolean;
    locked?: boolean;
    metadata?: Record<string, any>;
  }) {
    const item = new GameRoom();
    Object.assign(item, request);

    await this.entityManager.getRepository(GameRoom).insert(item);
    return { id: item.id };
  }
}

@serverModule.injectable()
export class GetGameRoomSservice extends InjectDatabaseService {
  async handle(request: {
    game: string;
    page?: number;
    pageSize?: number;
    mode?: string;
    private?: boolean;
    locked?: boolean;
    isAvailable?: boolean;
  }) {
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

@serverModule.injectable()
export class UpdateGameRoomservice extends InjectDatabaseService {
  async handle(request: {
    gameRoomId: string;
    name?: string;
    mode?: string;
    private?: boolean;
    locked?: boolean;
    metadata?: Record<string, any>;
  }) {
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

@serverModule.injectable()
export class DeleteGameRoomservice extends InjectDatabaseService {
  async handle(request: { gameRoomId: string }) {
    await this.entityManager.getRepository(GameRoom).delete({
      id: request.gameRoomId,
    });
    return {};
  }
}

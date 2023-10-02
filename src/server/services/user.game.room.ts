import { InjectDatabaseService, transactionUtils } from '@roxavn/core/server';
import { serverModule } from '../module.js';
import { GameRoom, UserGameRoom } from '../entities/index.js';
import {
  AlreadyInGameRoomException,
  FullGameRoomException,
} from '../../base/index.js';

@serverModule.injectable()
export class JoinGameRoomService extends InjectDatabaseService {
  @transactionUtils.Transactional()
  async handle(request: { userId: string; gameRoomId: string }) {
    const result = await this.entityManager
      .getRepository(GameRoom)
      .createQueryBuilder()
      .update(GameRoom)
      .set({
        userCount: () => 'userCount + 1',
      })
      .where('id = :id', { id: request.gameRoomId })
      .andWhere('userCount < maxUsers')
      .returning(['game'])
      .execute();
    if (result.affected) {
      const item = new UserGameRoom();
      item.userId = request.userId;
      item.gameRoomId = request.gameRoomId;
      item.game = result.raw[0].game;
      try {
        await this.entityManager.getRepository(UserGameRoom).insert([]);
      } catch (e) {
        if (transactionUtils.isDuplicateKeyError(e)) {
          throw new AlreadyInGameRoomException();
        } else {
          throw e;
        }
      }
    }
    throw new FullGameRoomException();
  }
}

@serverModule.injectable()
export class LeaveGameRoomService extends InjectDatabaseService {
  async handle(request: { userId: string; gameRoomId: string }) {
    await this.entityManager.getRepository(UserGameRoom).delete({
      userId: request.userId,
      gameRoomId: request.gameRoomId,
    });
    await this.entityManager
      .getRepository(GameRoom)
      .decrement({ id: request.gameRoomId }, 'userCount', 1);
  }
}

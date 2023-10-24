import { BaseService } from '@roxavn/core/server';
import { serverModule } from '../module.js';
import { GameRoom } from '../entities/index.js';
import { ServerGameFactory } from './factory.js';

@serverModule.useJob(serverModule.name)
export class GameJobService extends BaseService {
  async handle(request: GameRoom) {
    const gameManager = await ServerGameFactory.getGameManager(
      request.game,
      request.id
    );
    await gameManager.restore();
  }
}

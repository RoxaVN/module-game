import { BaseService } from '@roxavn/core/server';
import { serverModule } from '../module.js';
import { GameRoom } from '../entities/index.js';
import { ServerGame } from './game.js';

@serverModule.useJob(serverModule.name)
export class GameJobService extends BaseService {
  async handle(request: GameRoom) {
    const gameManager = await ServerGame.getGameManager(
      request.game,
      request.id
    );
    await gameManager.restore();
  }
}

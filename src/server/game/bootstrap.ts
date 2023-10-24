import {
  BaseService,
  DatabaseService,
  JobManager,
  inject,
} from '@roxavn/core/server';
import { serverModule } from '../module.js';
import { GameRoom } from '../entities/index.js';

@serverModule.onApplicationBootstrap()
export class RestoreRoomsService extends BaseService {
  constructor(
    @inject(DatabaseService) protected databaseService: DatabaseService,
    @inject(JobManager) protected jobManager: JobManager
  ) {
    super();
  }

  async handle() {
    const rooms = await this.databaseService.manager
      .getRepository(GameRoom)
      .find();
    rooms.map((room) => {
      this.jobManager.emit(serverModule.name, room);
    });
  }
}

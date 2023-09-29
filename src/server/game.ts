import { PresenceService, inject } from '@roxavn/core/server';

import { serverModule } from './module.js';
import { BaseGameRoom } from '../base/room.js';
import { NotFoundException } from '@roxavn/core';

@serverModule.injectable()
export class ServerGameRoom {
  presence: PresenceService['implementer'];

  constructor(
    @inject(PresenceService) protected presenceService: PresenceService
  ) {
    this.presence = this.presenceService.implementer;
  }
}

@serverModule.injectable()
export abstract class ServerLobbyRoom<T> extends ServerGameRoom {
  abstract gameRoomClass: { new (id: string, state: T): BaseGameRoom<T> };

  onCreate?: (room: BaseGameRoom<T>) => Promise<void>;

  private keys = {
    roomNo: serverModule.name + ':roomNo',
    rooms: serverModule.name + ':rooms',
  };

  async createRoom(initState: T) {
    const roomId = await this.presence.incr(this.keys.roomNo);
    const room = new this.gameRoomClass(roomId.toString(), initState);
    await this.presence.sadd(this.keys.rooms, room);
    if (this.onCreate) {
      await this.onCreate(room);
    }
  }

  async getAvailableRooms(): Promise<Array<BaseGameRoom<T>>> {
    const rooms = await this.getAllRooms();
    return rooms.filter((room) => room.users.length < room.maxUsers);
  }

  async getAvailableRoom(): Promise<BaseGameRoom<T> | undefined> {
    const rooms = await this.getAvailableRooms();
    return rooms[0];
  }

  async getRoomById(roomId: string): Promise<BaseGameRoom<T> | undefined> {
    const rooms = await this.getAllRooms();
    return rooms.find((room) => room.id === roomId);
  }

  async getAllRooms(): Promise<Array<BaseGameRoom<T>>> {
    const data = await this.presence.smembers(this.keys.rooms);
    return data.map((item) => JSON.parse(item));
  }

  async joinRoom(roomId: string) {
    const room = await this.getRoomById(roomId);
    if (room) {
    }
    throw new NotFoundException();
  }

  closeRoom() {
    return {};
  }
}

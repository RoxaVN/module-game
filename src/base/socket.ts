import { FullApiResponse, PaginatedCollection } from '@roxavn/core';

export interface RoomResponse {
  id: string;
  userId?: string;
  game: string;
  maxUsers: number;
  userCount: number;
  name: string;
  mode: string;
  private: boolean;
  locked: boolean;
  metadata?: Record<string, any>;
  createdDate: Date;
  updatedDate: Date;
}

export interface ClientToServerLobbyEvents {
  getRooms: (
    request: {
      page?: number;
      pageSize?: number;
      mode?: string;
    },
    ack: (resp: FullApiResponse<PaginatedCollection<RoomResponse>>) => void
  ) => void;
  getAvailableRoom: (
    request: { mode?: string },
    ack: (resp: FullApiResponse<RoomResponse>) => void
  ) => void;
  joinRoom: (
    request: { gameRoomId: string },
    ack: (resp: FullApiResponse<any>) => void
  ) => void;
  leaveRoom: (
    request: { gameRoomId: string },
    ack: (resp: FullApiResponse<any>) => void
  ) => void;
}

export interface ServerToClientLobbyEvents {
  updateRoom: (room: RoomResponse) => void;
  createRoom: (room: RoomResponse) => void;
}

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
    request: { roomId: string },
    ack: (resp: FullApiResponse<any>) => void
  ) => void;
  leaveRoom: (
    request: { roomId: string },
    ack: (resp: FullApiResponse<any>) => void
  ) => void;
  createRoom: (
    request: {
      name?: string;
      mode?: string;
      private?: boolean;
    },
    ack: (resp: FullApiResponse<{ id: string }>) => void
  ) => void;
  updateRoom: (
    request: {
      roomId: string;
      name?: string;
      mode?: string;
      private?: boolean;
    },
    ack: (resp: FullApiResponse<any>) => void
  ) => void;
}

export interface ServerToClientLobbyEvents {
  updateRoom: (room: RoomResponse) => void;
  createRoom: (room: RoomResponse) => void;
  deleteRoom: (roomId: string) => void;
}

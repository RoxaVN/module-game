import {
  ApiSource,
  ExactProps,
  IsOptional,
  MaxLength,
  MinLength,
  PaginationRequest,
  TransformBoolean,
} from '@roxavn/core/base';

import { baseModule } from '../module.js';
import { permissions, scopes } from '../access.js';

export interface GameRoomResponse {
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

const gameRoomSource = new ApiSource<GameRoomResponse>(
  [scopes.GameRoom],
  baseModule
);

export class CreateGameRoomRequest extends ExactProps<CreateGameRoomRequest> {
  @MinLength(1)
  public readonly game: string;

  @IsOptional()
  userId?: string;

  @MaxLength(256)
  @IsOptional()
  name?: string;

  @IsOptional()
  mode?: string;

  @TransformBoolean()
  @IsOptional()
  private?: boolean;

  @TransformBoolean()
  @IsOptional()
  locked?: boolean;

  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateGameRoomRequest extends ExactProps<UpdateGameRoomRequest> {
  @MinLength(1)
  public readonly gameRoomId: string;

  @MaxLength(256)
  @IsOptional()
  name?: string;

  @IsOptional()
  mode?: string;

  @TransformBoolean()
  @IsOptional()
  private?: boolean;

  @TransformBoolean()
  @IsOptional()
  locked?: boolean;

  @IsOptional()
  metadata?: Record<string, any>;
}

export class GetGameRoomsRequest extends PaginationRequest<GetGameRoomsRequest> {
  @MinLength(1)
  @IsOptional()
  public readonly game?: string;

  @IsOptional()
  mode?: string;

  @TransformBoolean()
  @IsOptional()
  private?: boolean;

  @TransformBoolean()
  @IsOptional()
  locked?: boolean;

  @TransformBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

export class DeleteGameRoomRequest extends ExactProps<DeleteGameRoomRequest> {
  @MinLength(1)
  public readonly gameRoomId: string;
}

export class GetGameRoomRequest extends ExactProps<GetGameRoomRequest> {
  @MinLength(1)
  public readonly gameRoomId: string;
}

export const gameRoomApi = {
  getOne: gameRoomSource.getOne({
    validator: GetGameRoomRequest,
  }),
  delete: gameRoomSource.delete({
    validator: DeleteGameRoomRequest,
    permission: permissions.DeleteGameRoom,
  }),
  getMany: gameRoomSource.getMany({
    validator: GetGameRoomsRequest,
  }),
  update: gameRoomSource.update({
    validator: UpdateGameRoomRequest,
    permission: permissions.UpdateGameRoom,
  }),
  create: gameRoomSource.create({
    validator: CreateGameRoomRequest,
    permission: permissions.CreateGameRoom,
  }),
};

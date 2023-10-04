import {
  ApiSource,
  ExactProps,
  IsOptional,
  Max,
  MaxLength,
  Min,
  MinLength,
  TransformBoolean,
  TransformNumber,
} from '@roxavn/core/base';

import { baseModule } from '../module.js';
import { permissions, scopes } from '../access.js';

export interface GameRoomResponse {}

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

export class GetGameRoomsRequest extends ExactProps<GetGameRoomsRequest> {
  @Min(1)
  @TransformNumber()
  @IsOptional()
  public readonly page?: number;

  @Min(1)
  @Max(100)
  @TransformNumber()
  @IsOptional()
  public readonly pageSize?: number;

  @MinLength(1)
  public readonly game: string;

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

export const gameRoomApi = {
  delete: gameRoomSource.delete({
    validator: DeleteGameRoomRequest,
    permission: permissions.DeleteGameRoom,
  }),
  getMany: gameRoomSource.getMany({
    validator: GetGameRoomsRequest,
    permission: permissions.ReadGameRooms,
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

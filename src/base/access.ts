import { accessManager } from '@roxavn/core/base';

import { baseModule } from './module.js';

export const scopes = accessManager.makeScopes(baseModule, {
  GameRoom: { name: 'gameRoom' },
});

export const permissions = accessManager.makePermissions(scopes, {
  DeleteGameRoom: {},
  ReadGameRooms: {},
  UpdateGameRoom: {},
  CreateGameRoom: {},
});

export const roles = accessManager.makeRoles(scopes, permissions, {});

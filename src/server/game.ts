import { PresenceService, inject } from '@roxavn/core/server';

import { serverModule } from './module.js';

@serverModule.injectable()
export class ServerGame {
  presence: PresenceService['implementer'];

  constructor(
    @inject(PresenceService) protected presenceService: PresenceService
  ) {
    this.presence = this.presenceService.implementer;
  }
}

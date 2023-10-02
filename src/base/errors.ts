import { BadRequestException, I18nErrorField } from '@roxavn/core';
import { baseModule } from './module.js';

export class FullGameRoomException extends BadRequestException {
  i18n = {
    default: {
      key: 'Error.FullGameRoomException',
      ns: baseModule.escapedName,
    } as I18nErrorField,
  };
}

export class AlreadyInGameRoomException extends BadRequestException {
  i18n = {
    default: {
      key: 'Error.AlreadyInGameRoomException',
      ns: baseModule.escapedName,
    } as I18nErrorField,
  };
}

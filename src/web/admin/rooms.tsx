import {
  ApiTable,
  IfCanAccessApi,
  ModuleT,
  PageItem,
  webModule as coreWebModule,
  utils,
} from '@roxavn/core/web';
import { IconDoorEnter, IconLock } from '@tabler/icons-react';

import { gameRoomApi } from '../../base/index.js';
import { webModule } from '../module.js';

const Page = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={gameRoomApi.getMany}
      header={t('rooms')}
      columns={{
        name: { label: tCore('name') },
        game: { label: t('game') },
        mode: { label: t('mode') },
        userCount: {
          label: tCore('members'),
          render: (v, item) => v + ' / ' + item.maxUsers,
        },
        private: { label: tCore('private'), render: utils.Render.boolean },
        locked: { label: <IconLock />, render: utils.Render.boolean },
        updatedDate: {
          label: tCore('updatedDate'),
          render: utils.Render.relativeTime,
        },
      }}
    />
  );
};

export const roomsPage = new PageItem({
  label: <ModuleT module={webModule} k="rooms" />,
  path: 'rooms',
  icon: IconDoorEnter,
  element: (
    <IfCanAccessApi api={gameRoomApi.getMany}>
      <Page />
    </IfCanAccessApi>
  ),
});

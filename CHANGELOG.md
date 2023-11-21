# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.1.1](https://github.com/RoxaVN/roxavn/compare/v0.1.0...v0.1.1) (2023-11-21)

### Features

- add GameName decorator ([71e8095](https://github.com/RoxaVN/roxavn/commit/71e809561ede2c8142f56be23fc267a05f954ca7))
- add GetGameRoomGeneralSocketService ([d443f50](https://github.com/RoxaVN/roxavn/commit/d443f50e7782b5fbf5c516b9d593a2e4270babc4))
- add parseData to GetGameRoomGeneralSocketService ([08d2a24](https://github.com/RoxaVN/roxavn/commit/08d2a2466c889c2d62f472259545cf9fbf3fe1f1))
- create baseIO in BaseGame instead of inherit from BaseSocketNamespace ([c8743d3](https://github.com/RoxaVN/roxavn/commit/c8743d3e0964bb874d9d5b97887959aee4d8ac89))

## 0.1.0 (2023-11-11)

### Features

- add admin rooms page ([b3f11a9](https://github.com/RoxaVN/roxavn/commit/b3f11a92ccf6981ac37bcb1bac2314662723dfac))
- add AlreadyInGameRoomException ([8e22b5a](https://github.com/RoxaVN/roxavn/commit/8e22b5a6af1f793b90ea63fcd8812a63bfc5d166))
- add CreateGameRoomSocketService ([0f0f9a1](https://github.com/RoxaVN/roxavn/commit/0f0f9a1cb5e0f4e08280db0918eeb345b4a87fba))
- add createSceneManager ([dfa0955](https://github.com/RoxaVN/roxavn/commit/dfa09554dac41e814f1f7882132ee7a0a4f813b7))
- add game room service ([db7a51d](https://github.com/RoxaVN/roxavn/commit/db7a51dfc7dbfebaf4e66accc5acc3f8552fabc7))
- add GameJobService ([2a7c29c](https://github.com/RoxaVN/roxavn/commit/2a7c29c19d54787341f45ebbfb0247e2ad064481))
- add GameRoom entity ([1ba2b0d](https://github.com/RoxaVN/roxavn/commit/1ba2b0d5fecf14488ab617fb75c854e64004b39f))
- add gameRoomApi ([1959d54](https://github.com/RoxaVN/roxavn/commit/1959d5447d75951ae5ccbf46814f33cac5d2326a))
- add GameScene ([b49d396](https://github.com/RoxaVN/roxavn/commit/b49d3960d3cfff854c15728fef38914a8b12b2af))
- add GetGameRoomApiService ([4fac861](https://github.com/RoxaVN/roxavn/commit/4fac8611c0a7f10692e38d042b803a36d6bbb5fb))
- add getGeneralKey ([3f15b57](https://github.com/RoxaVN/roxavn/commit/3f15b57a9509bd7dd9fb9b7183491a6a23658951))
- add InstallHook ([4c03b24](https://github.com/RoxaVN/roxavn/commit/4c03b240e2b0f82a24321e0c220c8d4bd8d16631))
- add JoinGameRoomService ([e15e0e0](https://github.com/RoxaVN/roxavn/commit/e15e0e0b150d7a6679a215a091266a90529c3f85))
- add JoinGameRoomSocketService ([6e2e11e](https://github.com/RoxaVN/roxavn/commit/6e2e11e084af6716a403dcccc4070d15275a8b3c))
- add migrations ([5f07448](https://github.com/RoxaVN/roxavn/commit/5f07448db59c9fdcd73770a44dcfff969ae8acd9))
- add onRoomEvent ([530a9af](https://github.com/RoxaVN/roxavn/commit/530a9af2956c07fd4eca1c7f72907f54c3593c79))
- add params to changeScene ([62b951b](https://github.com/RoxaVN/roxavn/commit/62b951b3c14b9ffc47098420b1726ad8b92365ea))
- add ServerGame.broadcastOperator() ([8787341](https://github.com/RoxaVN/roxavn/commit/8787341972ef2a052a73d6c3eb66f29985fa0dfa))
- add ServerGameFactory ([ffcb0d2](https://github.com/RoxaVN/roxavn/commit/ffcb0d29fe0ca3182886fbf61669ec524d07ee23))
- add ServerGameFactory.closeRoom ([cb4d586](https://github.com/RoxaVN/roxavn/commit/cb4d5869dfb6c99d60ae5d83de21ef588edcce05))
- add simple ServerLobbyRoom ([cf9c50a](https://github.com/RoxaVN/roxavn/commit/cf9c50a2241c77080a00bf79e59050d846fc6c61))
- add WebGame ([79ba6ac](https://github.com/RoxaVN/roxavn/commit/79ba6aca3b0c9bac503d3a9bf2e99ec6781aa787))
- broadcast update state event in ServerGameManager ([6467f33](https://github.com/RoxaVN/roxavn/commit/6467f331e339b903681e601290ec5072d5025458))
- change injectStore to injectStorage ([5c3fe6b](https://github.com/RoxaVN/roxavn/commit/5c3fe6bd73622324b4fd41d9c2237c9ebef3e0ff))
- init module ([7776745](https://github.com/RoxaVN/roxavn/commit/777674519ff833656027917c4c5b6e2458485559))
- init ServerGameManager if state is undefined ([a394a80](https://github.com/RoxaVN/roxavn/commit/a394a80b0b9d4d72944d6c52b3ecb202533d341f))
- save state in general data ([b476fb3](https://github.com/RoxaVN/roxavn/commit/b476fb31795d15a62ad201bfefff23cda332e070))

### Bug Fixes

- can't click dom children ([f649964](https://github.com/RoxaVN/roxavn/commit/f649964c59ccbf4a84f3a4536f510f5739b213b4))
- can't join room ([7e8f860](https://github.com/RoxaVN/roxavn/commit/7e8f8602e537f318d0f40d877aa385897d25131d))
- socket doesn't join after request join ([9b59ddd](https://github.com/RoxaVN/roxavn/commit/9b59ddda095327511a8d3e2e9d57a1a715fc08a5))

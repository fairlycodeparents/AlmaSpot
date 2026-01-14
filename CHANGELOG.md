## [1.0.1](https://github.com/fairlycodeparents/AlmaSpot/compare/1.0.0...1.0.1) (2026-01-14)

### Dependency updates

- **deps:** update actions/checkout action to v6 ([#7](https://github.com/fairlycodeparents/AlmaSpot/issues/7)) ([6d41844](https://github.com/fairlycodeparents/AlmaSpot/commit/6d418448a718fc8e6d4a3d87991bc4ac33e66d3f))
- **deps:** update actions/setup-node action to v6 ([#8](https://github.com/fairlycodeparents/AlmaSpot/issues/8)) ([6d90f16](https://github.com/fairlycodeparents/AlmaSpot/commit/6d90f16625a88dc4bfcb2630eb8fe9835837c7e7))
- **deps:** update actions/upload-pages-artifact action to v4 ([62e2330](https://github.com/fairlycodeparents/AlmaSpot/commit/62e23308f2c510560233d80b019780efbda09be1))
- **deps:** update commitlint monorepo to v20.3.1 ([#6](https://github.com/fairlycodeparents/AlmaSpot/issues/6)) ([e9b0d38](https://github.com/fairlycodeparents/AlmaSpot/commit/e9b0d386c006ea5ac099b37a0b76dbc2c1e47bee))
- **deps:** update dependency @types/node to v25.0.5 ([#11](https://github.com/fairlycodeparents/AlmaSpot/issues/11)) ([aed12ed](https://github.com/fairlycodeparents/AlmaSpot/commit/aed12edf030a493b90e920f52a8c272125aa134c))
- **deps:** update dependency @types/node to v25.0.6 ([#12](https://github.com/fairlycodeparents/AlmaSpot/issues/12)) ([8feb920](https://github.com/fairlycodeparents/AlmaSpot/commit/8feb9202eba9f8ef967578b0794f63d5fec06d8f))
- **deps:** update dependency @types/node to v25.0.7 ([#14](https://github.com/fairlycodeparents/AlmaSpot/issues/14)) ([56cff56](https://github.com/fairlycodeparents/AlmaSpot/commit/56cff566a4fcc58b153ff05642d97a8af58b23a8))
- **deps:** update dependency @types/node to v25.0.8 ([#18](https://github.com/fairlycodeparents/AlmaSpot/issues/18)) ([5da01c9](https://github.com/fairlycodeparents/AlmaSpot/commit/5da01c9b5e59d0520b4d66b2467aa6ac87032ace))
- **deps:** update mongo docker tag to v8 ([#15](https://github.com/fairlycodeparents/AlmaSpot/issues/15)) ([1e3762f](https://github.com/fairlycodeparents/AlmaSpot/commit/1e3762f6e816b29041f8515f6bdff436c40cb558))

### Documentation

- **figures:** update mock ups ([#20](https://github.com/fairlycodeparents/AlmaSpot/issues/20)) ([89a9682](https://github.com/fairlycodeparents/AlmaSpot/commit/89a96820e84f3808167aef28cde3d5f5829b60ac))

### Build and continuous integration

- update pr-checks with testing ([21dd001](https://github.com/fairlycodeparents/AlmaSpot/commit/21dd00126976802285dfc23024ab2fe7e2563867))

### General maintenance

- **docker:** add docker-compose configuration for MongoDB service ([50e6398](https://github.com/fairlycodeparents/AlmaSpot/commit/50e639829c774093a7e1d8c06ac38ee85197a10a))
- **docker:** add unibo-provider service and configure network ([5c19b28](https://github.com/fairlycodeparents/AlmaSpot/commit/5c19b28b528ae9a51ece7789441e96b2b44c57fa))
- **renovate:** update schedule configuration ([#19](https://github.com/fairlycodeparents/AlmaSpot/issues/19)) ([bc8c88a](https://github.com/fairlycodeparents/AlmaSpot/commit/bc8c88a7376f836c75d9d507f84ddde6c15eb198))

## [1.0.0](https://github.com/fairlycodeparents/AlmaSpot/compare/0.2.0...1.0.0) (2026-01-09)

### ⚠ BREAKING CHANGES

- force release as APIs are defined

### Features

- force release as APIs are defined ([1745659](https://github.com/fairlycodeparents/AlmaSpot/commit/1745659e877587c165f19943d498ac7734138004))

## [0.2.0](https://github.com/fairlycodeparents/AlmaSpot/compare/0.1.2...0.2.0) (2026-01-09)

### Features

- add .gitattributes for line ending normalization ([ead1386](https://github.com/fairlycodeparents/AlmaSpot/commit/ead1386f13ceb2b7e756e0714a57324157f53a41))
- add Activity and Room models with type definitions ([6cbf8b1](https://github.com/fairlycodeparents/AlmaSpot/commit/6cbf8b1186da3e737ff44250a4e71a390405e90f))
- add ActivityManagementService and RoomSearchService for event management and room availability ([4a3c111](https://github.com/fairlycodeparents/AlmaSpot/commit/4a3c111e20c29a2c62ba15f1f3fdafcdbbe03fac))
- add RoomRepository and ServicePorts interfaces for room and activity management ([c70bac0](https://github.com/fairlycodeparents/AlmaSpot/commit/c70bac0a9d2997e454cf3fd282ecd06b31956e39))
- add shared domain and indexes ([0d120b6](https://github.com/fairlycodeparents/AlmaSpot/commit/0d120b64824cc0ef8f109192b6876146f0c2666e))
- added ActivityAddedEvent to exports ([e27a2c1](https://github.com/fairlycodeparents/AlmaSpot/commit/e27a2c15f9c58c71b84917d3e63775ac67aba3c7))
- **authentication:** add Administrator model and AuthService skeleton ([def2f7a](https://github.com/fairlycodeparents/AlmaSpot/commit/def2f7adb756e62f2b04642e7f45a71d6a56508d))
- **authentication:** add AuthFacade to export ([c58e1f8](https://github.com/fairlycodeparents/AlmaSpot/commit/c58e1f807f640f8c46c88fa14d63e323b8210b5b))
- enhance room availability search by introducing site-based queries and DTOs ([ee95a71](https://github.com/fairlycodeparents/AlmaSpot/commit/ee95a7132f24d8f679d69c754dcbea35043d73db))
- export models and services ([032c546](https://github.com/fairlycodeparents/AlmaSpot/commit/032c546f40d92445c46d7419e5292898ebc2cb08))
- implement dtos and facade, exposed ActivityAddedEvent, changed ts configuration ([fe2836e](https://github.com/fairlycodeparents/AlmaSpot/commit/fe2836efe27ac81eb06b0dd21309e79712b34025))
- **notification:** add notification context domain and service skeleton ([c4c86be](https://github.com/fairlycodeparents/AlmaSpot/commit/c4c86be520167afd6dbd7c714036eebe8d005bcf))
- **search:** define search context entry points ([b52d30d](https://github.com/fairlycodeparents/AlmaSpot/commit/b52d30d3ae1b03a0681d4c458f2326c03e3fa9f2))
- **search:** export DTOs and SearchPlanService ([ce56b6f](https://github.com/fairlycodeparents/AlmaSpot/commit/ce56b6ff22c76d7b239e237fe4c4786547cbfe01))
- **shared:** add Plan first implementation ([c19ad06](https://github.com/fairlycodeparents/AlmaSpot/commit/c19ad06d3e3f3a12940993b030f111165786e81b))
- **shared:** add Plan first implementation ([6523438](https://github.com/fairlycodeparents/AlmaSpot/commit/652343860b0954652d3fd9fdc315984dd5e3f42a))

### Dependency updates

- **deps:** sync package-lock.json with package.json ([7c6bb9d](https://github.com/fairlycodeparents/AlmaSpot/commit/7c6bb9d5200880a7c03633504329e9c14d2a7546))

### General maintenance

- add ts configuration ([8609ef9](https://github.com/fairlycodeparents/AlmaSpot/commit/8609ef957c1ccfdde03df0416fc0d745bf755b97))

### Style improvements

- code formatting ([fe7f382](https://github.com/fairlycodeparents/AlmaSpot/commit/fe7f38227442a33e7d8ce2821000270cc1511069))

### Refactoring

- **search:** use DTOs for external communication ([be5eab1](https://github.com/fairlycodeparents/AlmaSpot/commit/be5eab150ac435cd96b3bd206071d47a75c953d0))

## [0.1.2](https://github.com/fairlycodeparents/AlmaSpot/compare/0.1.1...0.1.2) (2026-01-07)

### Bug Fixes

- docs structure on gh pages ([#2](https://github.com/fairlycodeparents/AlmaSpot/issues/2)) ([c50c003](https://github.com/fairlycodeparents/AlmaSpot/commit/c50c003183835588882de9ac7ef90cbcf1c3a241))

## [0.1.1](https://github.com/fairlycodeparents/AlmaSpot/compare/0.1.0...0.1.1) (2026-01-06)

### Bug Fixes

- release configuration ([38ee964](https://github.com/fairlycodeparents/AlmaSpot/commit/38ee9646b5838947e88bd97dcee4fbb2e5296cc3))

### Documentation

- add architecture example diagram ([6226cd1](https://github.com/fairlycodeparents/AlmaSpot/commit/6226cd13eae8927145d287c76b554c4d078eeda4))
- rename documentation files with numbered prefixes ([d021547](https://github.com/fairlycodeparents/AlmaSpot/commit/d021547ab2039b06be52a9ee1c1ed08d6b303cfd))
- update DVCS workflow to adopt GitHub Flow ([1e948ba](https://github.com/fairlycodeparents/AlmaSpot/commit/1e948bad6ab17c45955480f853106602b4e11bf6))

### Build and continuous integration

- add PR checks workflow to validate code in PRs ([f1f71ef](https://github.com/fairlycodeparents/AlmaSpot/commit/f1f71efd64a28919690d4c8972384037af6fc892))
- add semantic-release workflow ([7cdd1c4](https://github.com/fairlycodeparents/AlmaSpot/commit/7cdd1c47a1dcc6a9e7d7fc372a676992a1f0b2cf))
- add workflows for Jekyll deployment and main release ([0d088c1](https://github.com/fairlycodeparents/AlmaSpot/commit/0d088c1c5eb06d4f66cc5ee6feabfd93b5b7e297))

### General maintenance

- add lint-staged to automate prettier formatting ([c458dc2](https://github.com/fairlycodeparents/AlmaSpot/commit/c458dc23e05af53f7fac4b2d7b906457b426ae0d))
- add Renovate for dependency management ([aefd2da](https://github.com/fairlycodeparents/AlmaSpot/commit/aefd2daf34a47796158b1a6e470d9a0638fe2878))
- setup husky with commitlint ([32852fe](https://github.com/fairlycodeparents/AlmaSpot/commit/32852fedce1f218c5c7799f9095782c0d5fa72a4))
- update README.md ([8a4cea5](https://github.com/fairlycodeparents/AlmaSpot/commit/8a4cea50e3d147d20a8d35c06cb8a3185927f907))

### Style improvements

- standardize code formatting and improve consistency in config files ([558127a](https://github.com/fairlycodeparents/AlmaSpot/commit/558127ab04277eba40a13543bad52fac1ff668f9))

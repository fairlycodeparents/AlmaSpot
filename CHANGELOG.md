## [4.4.0](https://github.com/fairlycodeparents/AlmaSpot/compare/4.3.1...4.4.0) (2026-02-02)

### Features

- **client:** added room name retrieval in scheduled activities and results view ([37d4fec](https://github.com/fairlycodeparents/AlmaSpot/commit/37d4fec2099e266c94fd63154ceb0f7a54ce5344))
- **client:** improved room name retrieval logic in activities ([2dc3d28](https://github.com/fairlycodeparents/AlmaSpot/commit/2dc3d2863cbab72af272e37c46887edf73710376))
- **core:** add endpoint to fetch room details by ID in resultPage ([f4e05bf](https://github.com/fairlycodeparents/AlmaSpot/commit/f4e05bf53993dd85e03e4d5abeee4c8770dd2778))

### Bug Fixes

- **client:** update room name retrieval in results view ([860b255](https://github.com/fairlycodeparents/AlmaSpot/commit/860b2558b802934abe49e4beec6cb03b93020021))

## [4.3.1](https://github.com/fairlycodeparents/AlmaSpot/compare/4.3.0...4.3.1) (2026-02-02)

### Bug Fixes

- **core:** enhance course fetching and cache update logic ([13634fc](https://github.com/fairlycodeparents/AlmaSpot/commit/13634fc4fcc63f5ff8da6994a6c6a638a694b738))
- **core:** improve error message for course fetching and enhance cache handling ([0e3f65a](https://github.com/fairlycodeparents/AlmaSpot/commit/0e3f65adb08bcb75b5e51be3df49ce71cd3b322e))

## [4.3.0](https://github.com/fairlycodeparents/AlmaSpot/compare/4.2.2...4.3.0) (2026-02-02)

### Features

- **core:** implement cache cleanup for provider and added MongoDB indexes ([61400e1](https://github.com/fairlycodeparents/AlmaSpot/commit/61400e1402f9cb93be82bf6e29a7eddc34c20887))

### Dependency updates

- **deps:** update commitlint monorepo to v20.4.0 ([#68](https://github.com/fairlycodeparents/AlmaSpot/issues/68)) ([d39de17](https://github.com/fairlycodeparents/AlmaSpot/commit/d39de175b7748df9748252a9ba89a8bc5bb90556))
- **deps:** update dependency @types/node to v25.2.0 ([#53](https://github.com/fairlycodeparents/AlmaSpot/issues/53)) ([5a86505](https://github.com/fairlycodeparents/AlmaSpot/commit/5a865051fe7154614651438aee1b36a621a15ab1))
- **deps:** update dependency playwright to v1.58.1 ([#56](https://github.com/fairlycodeparents/AlmaSpot/issues/56)) ([fde83e8](https://github.com/fairlycodeparents/AlmaSpot/commit/fde83e8fe8b04e3169412cf992fe12773e9d4fa9))

### Bug Fixes

- **core:** improve error logging for sync failures ([c51926d](https://github.com/fairlycodeparents/AlmaSpot/commit/c51926da463bf68cfc13cf62129e1dc1dfed1ded))
- **core:** refactor repeated code for room retrieve and sync ([8225d13](https://github.com/fairlycodeparents/AlmaSpot/commit/8225d1358d9c47fdfd2905b2cdd5e8930f9cb878))
- **core:** update room availability search logic to include overlapping slots ([21b9312](https://github.com/fairlycodeparents/AlmaSpot/commit/21b93125453f1a956c4a2f9119edd4c1d3f2067a))

## <small>4.2.2 (2026-01-31)</small>

- fix(datetime): adjust date handling for plan activation (#74) ([7bdbe4f](https://github.com/fairlycodeparents/AlmaSpot/commit/7bdbe4f)), closes [#74](https://github.com/fairlycodeparents/AlmaSpot/issues/74)

## <small>4.2.1 (2026-01-31)</small>

- refactor: remove console log ([c320176](https://github.com/fairlycodeparents/AlmaSpot/commit/c320176))
- refactor(ui): rename pages to use View suffix and update router imports ([78d89fa](https://github.com/fairlycodeparents/AlmaSpot/commit/78d89fa))
- refactor(ui): replace native button with Button component in RoomCard ([1917534](https://github.com/fairlycodeparents/AlmaSpot/commit/1917534))
- refactor(ui): standardize border-radius using theme variables ([c7d6f2d](https://github.com/fairlycodeparents/AlmaSpot/commit/c7d6f2d))
- refactor(ui): standardize width and color using theme variables ([1ad1b14](https://github.com/fairlycodeparents/AlmaSpot/commit/1ad1b14))
- refactor(ui): unify AI request button with Button component and update styling ([5ab8ae9](https://github.com/fairlycodeparents/AlmaSpot/commit/5ab8ae9))
- fix: resolve navigation flow and token handling ([75d6dbf](https://github.com/fairlycodeparents/AlmaSpot/commit/75d6dbf))
- fix(auth): remove replace navigation when redirecting authenticated users ([b56411f](https://github.com/fairlycodeparents/AlmaSpot/commit/b56411f))
- fix(auth): use router.replace for navigation to prevent back navigation to auth pages ([56ed427](https://github.com/fairlycodeparents/AlmaSpot/commit/56ed427))
- fix(auth): wrap LoginCard in form element and handle submit via form event ([b8e2e48](https://github.com/fairlycodeparents/AlmaSpot/commit/b8e2e48))
- fix(ui): center ResultsPage content and constrain max width ([44750fc](https://github.com/fairlycodeparents/AlmaSpot/commit/44750fc))
- fix(ui): disable button action in LoginCard ([2ceb8e4](https://github.com/fairlycodeparents/AlmaSpot/commit/2ceb8e4))
- fix(ui): enhance button interactions ([387a08f](https://github.com/fairlycodeparents/AlmaSpot/commit/387a08f))
- fix(ui): hide AI button in admin page ([471e706](https://github.com/fairlycodeparents/AlmaSpot/commit/471e706))
- fix(ui): improve DurationSelector button hover feedback ([4fa582a](https://github.com/fairlycodeparents/AlmaSpot/commit/4fa582a))
- fix(ui): improve HomeView layout spacing and vertical alignment ([bf9dadd](https://github.com/fairlycodeparents/AlmaSpot/commit/bf9dadd))
- fix(ui): improve layout and styling in PlanView and ScheduleCard components ([05258b6](https://github.com/fairlycodeparents/AlmaSpot/commit/05258b6))
- fix(ui): prevent vertical scroll on admin dashboard ([0e9f129](https://github.com/fairlycodeparents/AlmaSpot/commit/0e9f129))
- fix(ui): remove disabled state handling from textarea ([3d5d57b](https://github.com/fairlycodeparents/AlmaSpot/commit/3d5d57b))
- fix(ui): resolve navigation flow ([1b49896](https://github.com/fairlycodeparents/AlmaSpot/commit/1b49896))
- fix(ui): update date options and duration limits in ActionPanel ([50d19f6](https://github.com/fairlycodeparents/AlmaSpot/commit/50d19f6))

## 4.2.0 (2026-01-31)

- feat(pwa): add manifest file and service worker registration for PWA support ([f19d889](https://github.com/fairlycodeparents/AlmaSpot/commit/f19d889))
- feat(pwa): implement standalone back navigation and update app title ([78ea8f1](https://github.com/fairlycodeparents/AlmaSpot/commit/78ea8f1))

## <small>4.1.1 (2026-01-31)</small>

- chore(core-deps): update dependency @google/genai to v1.39.0 (#71) ([24d022c](https://github.com/fairlycodeparents/AlmaSpot/commit/24d022c)), closes [#71](https://github.com/fairlycodeparents/AlmaSpot/issues/71)
- chore(deps): update dependency autoprefixer to v10.4.24 (#70) ([f6b3af3](https://github.com/fairlycodeparents/AlmaSpot/commit/f6b3af3)), closes [#70](https://github.com/fairlycodeparents/AlmaSpot/issues/70)

## 4.1.0 (2026-01-30)

- fix(activity): update activity identifiers to use \_id for consistency ([8e6c12a](https://github.com/fairlycodeparents/AlmaSpot/commit/8e6c12a))
- fix(core): updated test ([b8dfcd1](https://github.com/fairlycodeparents/AlmaSpot/commit/b8dfcd1))
- fix(core): updated test mongo repository ([10e590f](https://github.com/fairlycodeparents/AlmaSpot/commit/10e590f))
- fix(go): removed exams fetching (not working) ([c6d6c02](https://github.com/fairlycodeparents/AlmaSpot/commit/c6d6c02))
- fix(test): update getActivityById to use \_id for activity lookup ([1a7b784](https://github.com/fairlycodeparents/AlmaSpot/commit/1a7b784))
- feat(exams): integrate exam fetching logic into activity response ([e16d3a4](https://github.com/fairlycodeparents/AlmaSpot/commit/e16d3a4))
- feat(go): implement activity caching in provider with daily updates ([45fb8df](https://github.com/fairlycodeparents/AlmaSpot/commit/45fb8df))
- feat(sync): update sync thresholds to improve event synchronization logic ([28637ad](https://github.com/fairlycodeparents/AlmaSpot/commit/28637ad))
- refactor(search): update Suggestion to use optional plan (#67) ([7304d0c](https://github.com/fairlycodeparents/AlmaSpot/commit/7304d0c)), closes [#67](https://github.com/fairlycodeparents/AlmaSpot/issues/67)

## <small>4.0.1 (2026-01-30)</small>

- fix(deps): update github.com/vaiton/unibocalendar digest to 1b81211 (#64) ([4ec04f4](https://github.com/fairlycodeparents/AlmaSpot/commit/4ec04f4)), closes [#64](https://github.com/fairlycodeparents/AlmaSpot/issues/64)

## 4.0.0 (2026-01-29)

- fix(assistant): await scrollToBottom to ensure proper scroll behavior after updates ([bb0c21a](https://github.com/fairlycodeparents/AlmaSpot/commit/bb0c21a))
- refactor(search): refactor(search): improve plan and chat history handling in assistant service ([563ed19](https://github.com/fairlycodeparents/AlmaSpot/commit/563ed19))
- refactor(search)!: migrate userMessages to structured chat history in DTOs and services ([80cb11d](https://github.com/fairlycodeparents/AlmaSpot/commit/80cb11d))
- refactor(search)!: update SuggestionDTO to use optional plan ([e068e84](https://github.com/fairlycodeparents/AlmaSpot/commit/e068e84))

### BREAKING CHANGE

- migrate userMessages to structured chat history in DTOs and services
- SuggestionDTO now include an optional plan property

## 3.4.0 (2026-01-29)

- feat(calendar): add calendar export functionality and button in PlanView (#63) ([aa87bda](https://github.com/fairlycodeparents/AlmaSpot/commit/aa87bda)), closes [#63](https://github.com/fairlycodeparents/AlmaSpot/issues/63)
- ci(release): update release workflow (#62) ([8e8d265](https://github.com/fairlycodeparents/AlmaSpot/commit/8e8d265)), closes [#62](https://github.com/fairlycodeparents/AlmaSpot/issues/62)
- chore(deps): update dependency vue-tsc to v3.2.4 (#54) ([4e6722c](https://github.com/fairlycodeparents/AlmaSpot/commit/4e6722c)), closes [#54](https://github.com/fairlycodeparents/AlmaSpot/issues/54)
- chore(deps): update vitest monorepo to v4.0.18 (#55) ([d699f2c](https://github.com/fairlycodeparents/AlmaSpot/commit/d699f2c)), closes [#55](https://github.com/fairlycodeparents/AlmaSpot/issues/55)
- refactor(plan): enhance plan subscription/unsubscription management and user experience (#61) ([7ef92dd](https://github.com/fairlycodeparents/AlmaSpot/commit/7ef92dd)), closes [#61](https://github.com/fairlycodeparents/AlmaSpot/issues/61)

## 3.3.0 (2026-01-28)

- feat(ui): improve error handling ([670e5ef](https://github.com/fairlycodeparents/AlmaSpot/commit/670e5ef))

## <small>3.2.1 (2026-01-28)</small>

- chore(core-deps): update dependency axios to v1.13.4 (#52) ([ff0d2be](https://github.com/fairlycodeparents/AlmaSpot/commit/ff0d2be)), closes [#52](https://github.com/fairlycodeparents/AlmaSpot/issues/52)

## 3.2.0 (2026-01-27)

- chore: extend lint-staged config to support yml, yaml, html, and vue files ([add320a](https://github.com/fairlycodeparents/AlmaSpot/commit/add320a))
- chore: update .gitignore ([7b71f62](https://github.com/fairlycodeparents/AlmaSpot/commit/7b71f62))
- chore: update CHANGELOG formatting ([f1005b8](https://github.com/fairlycodeparents/AlmaSpot/commit/f1005b8))
- chore: update CHANGELOG formatting ([0a218ad](https://github.com/fairlycodeparents/AlmaSpot/commit/0a218ad))
- fix(core): fixed tests for new changes ([d5a6cc0](https://github.com/fairlycodeparents/AlmaSpot/commit/d5a6cc0))
- fix(core): improve data synchronization logic ([290457a](https://github.com/fairlycodeparents/AlmaSpot/commit/290457a))
- fix(core): refactored room id, roomId and activityId generation, removed description ([10dea96](https://github.com/fairlycodeparents/AlmaSpot/commit/10dea96))
- fix(core): tests updated after id refactor ([b29e876](https://github.com/fairlycodeparents/AlmaSpot/commit/b29e876))
- fix(deps): add peer dependencies in package-lock.json ([f0f6e6d](https://github.com/fairlycodeparents/AlmaSpot/commit/f0f6e6d))
- fix(docs): re-add mockups ([9d9b9c5](https://github.com/fairlycodeparents/AlmaSpot/commit/9d9b9c5))
- fix(notification): update plan structure in push notification payload ([2bab0dd](https://github.com/fairlycodeparents/AlmaSpot/commit/2bab0dd))
- fix(plan): enhance date handling and store parameters in ActionPanel ([d69bd17](https://github.com/fairlycodeparents/AlmaSpot/commit/d69bd17))
- fix(ui): add filter reset button in AdminActivitiesPage ([47e38f9](https://github.com/fairlycodeparents/AlmaSpot/commit/47e38f9))
- fix(ui): change room list ([6fb8bb1](https://github.com/fairlycodeparents/AlmaSpot/commit/6fb8bb1))
- fix(ui): correct activity time filtering logic in admin dashboard ([6bc5316](https://github.com/fairlycodeparents/AlmaSpot/commit/6bc5316))
- fix(ui): enhance Dropdown component ([91b1825](https://github.com/fairlycodeparents/AlmaSpot/commit/91b1825))
- fix(ui): enhance StudentHomePage layout ([c075206](https://github.com/fairlycodeparents/AlmaSpot/commit/c075206))
- fix(ui): fixed durationselector and search button width ([6a9e706](https://github.com/fairlycodeparents/AlmaSpot/commit/6a9e706))
- fix(ui): fixed room find in activities admin ([eec9300](https://github.com/fairlycodeparents/AlmaSpot/commit/eec9300))
- fix(ui): fixed ui style parameters ([1d66f71](https://github.com/fairlycodeparents/AlmaSpot/commit/1d66f71))
- fix(ui): merged Action Panel for student and admin dashboard ([0879454](https://github.com/fairlycodeparents/AlmaSpot/commit/0879454))
- fix(ui): refactor room result with only one page for both student and admin ([fffcf4e](https://github.com/fairlycodeparents/AlmaSpot/commit/fffcf4e))
- fix(ui): removed unused icon ([277fe5c](https://github.com/fairlycodeparents/AlmaSpot/commit/277fe5c))
- fix(ui): resolve TS error in ResultPage ([ece8247](https://github.com/fairlycodeparents/AlmaSpot/commit/ece8247))
- fix(ui): room filtering logic for deleteActivity in ResultPage ([c59555b](https://github.com/fairlycodeparents/AlmaSpot/commit/c59555b))
- fix(ui): update AdminActivitiesPage to redirect to ResultsPage after activity deletion ([051f015](https://github.com/fairlycodeparents/AlmaSpot/commit/051f015))
- fix(ui): update endpoint for fetching exact free rooms ([c9dab3b](https://github.com/fairlycodeparents/AlmaSpot/commit/c9dab3b))
- fix(ui): update ResultsPage ([dd981ef](https://github.com/fairlycodeparents/AlmaSpot/commit/dd981ef))
- fix(ui): update ResultsPage and AssistantView to use url params ([cf6d675](https://github.com/fairlycodeparents/AlmaSpot/commit/cf6d675))
- fix(ui): update RoomCard colors according to palette ([8199b5e](https://github.com/fairlycodeparents/AlmaSpot/commit/8199b5e))
- fix(ui): update SegmentedButton colors according to palette ([794d7be](https://github.com/fairlycodeparents/AlmaSpot/commit/794d7be))
- feat(core): add CLI test command ([38cb654](https://github.com/fairlycodeparents/AlmaSpot/commit/38cb654))
- feat(core): add endpoint for finding exact free slots ([3be991d](https://github.com/fairlycodeparents/AlmaSpot/commit/3be991d))
- feat(core): add endpoints for retrieving campuses and sites, enhance CoreFacade with roomRepository ([100576b](https://github.com/fairlycodeparents/AlmaSpot/commit/100576b))
- feat(notification): add unsubscribe functionality and refactor notification routing ([a9c40c1](https://github.com/fairlycodeparents/AlmaSpot/commit/a9c40c1))
- feat(notification): enhance notification message and update tests ([277cf55](https://github.com/fairlycodeparents/AlmaSpot/commit/277cf55))
- feat(notification): enhance push notification handling and add time slot parameters ([dcee40b](https://github.com/fairlycodeparents/AlmaSpot/commit/dcee40b))
- feat(notification): implement PlanView and update push notification subscription logic ([addee74](https://github.com/fairlycodeparents/AlmaSpot/commit/addee74))
- feat(plan): add plan route/store and handle unsubscribe and save in AssistantView ([87b6c50](https://github.com/fairlycodeparents/AlmaSpot/commit/87b6c50))
- feat(plan): integrate usePlanSession composable in ResultsPage ([49a7f03](https://github.com/fairlycodeparents/AlmaSpot/commit/49a7f03))
- feat(plan): update plan structure and visualization in PlanView ([b1c5181](https://github.com/fairlycodeparents/AlmaSpot/commit/b1c5181))
- feat(storybook): integrate accessibility testing ([e4fb87a](https://github.com/fairlycodeparents/AlmaSpot/commit/e4fb87a))
- feat(ui): add admin dashboard and result pages ([21e3208](https://github.com/fairlycodeparents/AlmaSpot/commit/21e3208))
- feat(ui): add AdminActionPanel component ([bdcade2](https://github.com/fairlycodeparents/AlmaSpot/commit/bdcade2))
- feat(ui): add AlertCard component ([1d276ab](https://github.com/fairlycodeparents/AlmaSpot/commit/1d276ab))
- feat(ui): add ChatInput component ([90cfb92](https://github.com/fairlycodeparents/AlmaSpot/commit/90cfb92))
- feat(ui): add ChatMessage component ([60b9e0d](https://github.com/fairlycodeparents/AlmaSpot/commit/60b9e0d))
- feat(ui): add Dropdown component ([8bf9974](https://github.com/fairlycodeparents/AlmaSpot/commit/8bf9974))
- feat(ui): add DurationSelector component with increment/decrement functionality ([b060970](https://github.com/fairlycodeparents/AlmaSpot/commit/b060970))
- feat(ui): add dynamic time selection in student page ([285b064](https://github.com/fairlycodeparents/AlmaSpot/commit/285b064))
- feat(ui): add FilterPanel component ([81a8d30](https://github.com/fairlycodeparents/AlmaSpot/commit/81a8d30))
- feat(ui): add full width variant to Button component ([48929ef](https://github.com/fairlycodeparents/AlmaSpot/commit/48929ef))
- feat(ui): add InputText component ([3532535](https://github.com/fairlycodeparents/AlmaSpot/commit/3532535))
- feat(ui): add LoginCard component ([5591d3a](https://github.com/fairlycodeparents/AlmaSpot/commit/5591d3a))
- feat(ui): add RoomCard component ([057b88a](https://github.com/fairlycodeparents/AlmaSpot/commit/057b88a))
- feat(ui): add ScheduleCard component ([650b130](https://github.com/fairlycodeparents/AlmaSpot/commit/650b130))
- feat(ui): add Segmented button component ([00308fb](https://github.com/fairlycodeparents/AlmaSpot/commit/00308fb))
- feat(ui): add signup option in LoginCard component ([b64df58](https://github.com/fairlycodeparents/AlmaSpot/commit/b64df58))
- feat(ui): add student home and results pages with search functionality ([2c99c32](https://github.com/fairlycodeparents/AlmaSpot/commit/2c99c32))
- feat(ui): added data passing to assistantAI via queryURL ([27f53a1](https://github.com/fairlycodeparents/AlmaSpot/commit/27f53a1))
- feat(ui): auto-generate assistant query from URL params in AssistantView ([1c245f1](https://github.com/fairlycodeparents/AlmaSpot/commit/1c245f1))
- feat(ui): change the language of the login component to italian ([fccf7aa](https://github.com/fairlycodeparents/AlmaSpot/commit/fccf7aa))
- feat(ui): enhance student home page with error handling and UI improvements ([393da22](https://github.com/fairlycodeparents/AlmaSpot/commit/393da22))
- feat(ui): handle error message in login and register page ([f689460](https://github.com/fairlycodeparents/AlmaSpot/commit/f689460))
- feat(ui): implement addActivity in admin dashboard ([9db61de](https://github.com/fairlycodeparents/AlmaSpot/commit/9db61de))
- feat(ui): implement AssistantView and assistant service for chat functionality ([c68298b](https://github.com/fairlycodeparents/AlmaSpot/commit/c68298b))
- feat(ui): implement deleteActivity in admin dashboard ([ede6a07](https://github.com/fairlycodeparents/AlmaSpot/commit/ede6a07))
- feat(ui): implement dynamic time selection based on date ([d4552af](https://github.com/fairlycodeparents/AlmaSpot/commit/d4552af))
- feat(ui): implement registration and login page ([566a43b](https://github.com/fairlycodeparents/AlmaSpot/commit/566a43b))
- feat(ui): implement room search functionality with loading and error handling ([9d6de3d](https://github.com/fairlycodeparents/AlmaSpot/commit/9d6de3d))
- feat(ui): set avatar as optional in ChatMessage component ([b34669c](https://github.com/fairlycodeparents/AlmaSpot/commit/b34669c))
- feat(ui): update assistant data to include info on plan ([082dc4b](https://github.com/fairlycodeparents/AlmaSpot/commit/082dc4b))
- feat(ui): update font family to Merriweather ([3690d27](https://github.com/fairlycodeparents/AlmaSpot/commit/3690d27))
- feat(ui): update navigation and enhance UI elements on student pages ([13b4d67](https://github.com/fairlycodeparents/AlmaSpot/commit/13b4d67))
- feat(ui): updated DropDown ([45be2fe](https://github.com/fairlycodeparents/AlmaSpot/commit/45be2fe))
- refactor: removed unnecessary console log and translated test to English ([2d6fac6](https://github.com/fairlycodeparents/AlmaSpot/commit/2d6fac6))
- refactor(plan): add usePlanSession composable ([61929a3](https://github.com/fairlycodeparents/AlmaSpot/commit/61929a3))
- refactor(stories): move stories components into a dedicated directory ([ecb4297](https://github.com/fairlycodeparents/AlmaSpot/commit/ecb4297))
- refactor(ui): adjust padding and border radius in ChatInput component ([2707cde](https://github.com/fairlycodeparents/AlmaSpot/commit/2707cde))
- refactor(ui): button usage in LoginCard ([bf4af8b](https://github.com/fairlycodeparents/AlmaSpot/commit/bf4af8b))
- refactor(ui): clean up Dropdown component ([bb31e70](https://github.com/fairlycodeparents/AlmaSpot/commit/bb31e70))
- refactor(ui): clean up text styles ([8185809](https://github.com/fairlycodeparents/AlmaSpot/commit/8185809))
- refactor(ui): define interface for type safety ([b1eb572](https://github.com/fairlycodeparents/AlmaSpot/commit/b1eb572))
- refactor(ui): enforce strict typing ([166f62b](https://github.com/fairlycodeparents/AlmaSpot/commit/166f62b))
- refactor(ui): remove max-width constraint from Button component ([e54793e](https://github.com/fairlycodeparents/AlmaSpot/commit/e54793e))
- refactor(ui): remove min-width constraint from Dropdown component ([b1d0953](https://github.com/fairlycodeparents/AlmaSpot/commit/b1d0953))
- refactor(ui): remove unnecessary min-height from AdminActionPanel stories ([d0213e8](https://github.com/fairlycodeparents/AlmaSpot/commit/d0213e8))
- refactor(ui): remove unnecessary stories in ActionPanel component ([bb23682](https://github.com/fairlycodeparents/AlmaSpot/commit/bb23682))
- refactor(ui): simplify time formatting in assistant query generation ([9ac77a6](https://github.com/fairlycodeparents/AlmaSpot/commit/9ac77a6))
- refactor(ui): update border radius styles across multiple components ([bd961bb](https://github.com/fairlycodeparents/AlmaSpot/commit/bd961bb))
- style: fix code formatting ([47b93cc](https://github.com/fairlycodeparents/AlmaSpot/commit/47b93cc))
- ci(pr-checks): add client ci and update root ci with prettier ([bef2b6e](https://github.com/fairlycodeparents/AlmaSpot/commit/bef2b6e))
- ci(release): add client image build to docker-release workflow ([667d946](https://github.com/fairlycodeparents/AlmaSpot/commit/667d946))
- docs: update mockups ([ec01b8e](https://github.com/fairlycodeparents/AlmaSpot/commit/ec01b8e))
- docs: update mockups ([0a2ce6b](https://github.com/fairlycodeparents/AlmaSpot/commit/0a2ce6b))

## [3.1.0](https://github.com/fairlycodeparents/AlmaSpot/compare/3.0.1...3.1.0) (2026-01-27)

### Features

- feat: initialize Vue 3 project with Vite ([633e16c](https://github.com/fairlycodeparents/AlmaSpot/commit/633e16c))
- feat(core): implement room seeding functionality ([807c27d](https://github.com/fairlycodeparents/AlmaSpot/commit/807c27d))
- feat(notification): add push notifications composable and VAPID key configuration ([8029c49](https://github.com/fairlycodeparents/AlmaSpot/commit/8029c49))
- feat(notification): implement service worker for push notifications and notification click handling ([3735a42](https://github.com/fairlycodeparents/AlmaSpot/commit/3735a42))
- feat(ui): add Button component ([4bc9323](https://github.com/fairlycodeparents/AlmaSpot/commit/4bc9323))
- feat(ui): enhance Button component with icon support and accessibility update ([94b23a8](https://github.com/fairlycodeparents/AlmaSpot/commit/94b23a8))
- feat(ui): update Button stories for icon support ([adae077](https://github.com/fairlycodeparents/AlmaSpot/commit/adae077))

### Bug Fixes

- fix: include Storybook config files in tsconfig ([b0be26c](https://github.com/fairlycodeparents/AlmaSpot/commit/b0be26c))
- fix: tailwind v4 setup ([4011888](https://github.com/fairlycodeparents/AlmaSpot/commit/4011888))
- fix(notification): update subscription handling to use details object and adjust time comparison ([17e5997](https://github.com/fairlycodeparents/AlmaSpot/commit/17e5997))
- fix(ui): remove unnecessary attribute from Button ([ca10ffc](https://github.com/fairlycodeparents/AlmaSpot/commit/ca10ffc))

### Dependency updates

- chore(deps): add @tailwindcss/postcss ([03328a4](https://github.com/fairlycodeparents/AlmaSpot/commit/03328a4))
- chore(deps): update dependency @types/uuid to v11 ([#22](https://github.com/fairlycodeparents/AlmaSpot/issues/22)) ([87b663b](https://github.com/fairlycodeparents/AlmaSpot/commit/87b663b))
- chore(deps): update docker/build-push-action action to v6 (#41) ([a603ce5](https://github.com/fairlycodeparents/AlmaSpot/commit/a603ce5)), closes [#41](https://github.com/fairlycodeparents/AlmaSpot/issues/41)

### Build and continuous integration

- build(client): install dependencies pinia, router, axios, lucide ([de0d3e2](https://github.com/fairlycodeparents/AlmaSpot/commit/de0d3e2))
- build(client): setup frontend (vite, tailwind, postcss) ([2eaf5be](https://github.com/fairlycodeparents/AlmaSpot/commit/2eaf5be))
- build(docker): add container configuration ([c0f3bf5](https://github.com/fairlycodeparents/AlmaSpot/commit/c0f3bf5))
- ci(release): update semantic release step to use RELEASE_PAT token ([3f1eead](https://github.com/fairlycodeparents/AlmaSpot/commit/3f1eead))

### Refactoring

- refactor(ui): button component icon positioning ([8d8bef3](https://github.com/fairlycodeparents/AlmaSpot/commit/8d8bef3))

### General maintenance

- chore: integrate Storybook with Vite and add testing support ([94d0f68](https://github.com/fairlycodeparents/AlmaSpot/commit/94d0f68))
- chore: remove .vite ([b7e1b9e](https://github.com/fairlycodeparents/AlmaSpot/commit/b7e1b9e))
- chore(client): add color palette Tailwind CSS config ([682b5ab](https://github.com/fairlycodeparents/AlmaSpot/commit/682b5ab))
- chore(renovate): add add prHourlyLimit to configuration ([2f9fc7e](https://github.com/fairlycodeparents/AlmaSpot/commit/2f9fc7e))
- chore(renovate): remove auto-merge schedule and timezone settings ([fd3cc4f](https://github.com/fairlycodeparents/AlmaSpot/commit/fd3cc4f))
- chore(renovate): update automerge settings ([5989020](https://github.com/fairlycodeparents/AlmaSpot/commit/5989020))

## [3.0.1](https://github.com/fairlycodeparents/AlmaSpot/compare/3.0.0...3.0.1) (2026-01-26)

### Build and continuous integration

- **core-deps:** update dependency @google/genai to v1.38.0 ([#26](https://github.com/fairlycodeparents/AlmaSpot/issues/26)) ([62b6c1b](https://github.com/fairlycodeparents/AlmaSpot/commit/62b6c1b))

## [3.0.0](https://github.com/fairlycodeparents/AlmaSpot/compare/2.1.0...3.0.0) (2026-01-25)

### ⚠ BREAKING CHANGES

- edit search context API

### Features

- **search:** add room information to search context output ([#48](https://github.com/fairlycodeparents/AlmaSpot/issues/48)) ([969dcfd](https://github.com/fairlycodeparents/AlmaSpot/commit/969dcfd))

### Dependency updates

- **deps:** update dependency prettier to v3.8.1 ([#27](https://github.com/fairlycodeparents/AlmaSpot/issues/27)) ([2324bc0](https://github.com/fairlycodeparents/AlmaSpot/commit/2324bc0))

### Build and continuous integration

- **docker:** update workflow for Docker publishing ([#47](https://github.com/fairlycodeparents/AlmaSpot/issues/47)) ([ae1823b](https://github.com/fairlycodeparents/AlmaSpot/commit/ae1823b))

## [2.1.0](https://github.com/fairlycodeparents/AlmaSpot/compare/2.0.3...2.1.0) (2026-01-24)

### Features

- **search:** update AvailableRoom to include names and improve AIAdapter prompt handling ([#46](https://github.com/fairlycodeparents/AlmaSpot/issues/46)) ([1968831](https://github.com/fairlycodeparents/AlmaSpot/commit/1968831))

### Dependency updates

- **deps:** update dependency @types/node to v25.0.10 ([#44](https://github.com/fairlycodeparents/AlmaSpot/issues/44)) ([6c7f8f8](https://github.com/fairlycodeparents/AlmaSpot/commit/6c7f8f8))

## [2.0.3](https://github.com/fairlycodeparents/AlmaSpot/compare/2.0.2...2.0.3) (2026-01-23)

### Dependency updates

- **core-deps:** update dependency zod to v4.3.6 ([#45](https://github.com/fairlycodeparents/AlmaSpot/issues/45)) ([e9a1aca](https://github.com/fairlycodeparents/AlmaSpot/commit/e9a1aca))

## [2.0.2](https://github.com/fairlycodeparents/AlmaSpot/compare/2.0.1...2.0.2) (2026-01-22)

### Bug Fixes

- **deps:** update github.com/vaiton/unibocalendar digest to 2d2a972 ([#43](https://github.com/fairlycodeparents/AlmaSpot/issues/43)) ([f6a436d](https://github.com/fairlycodeparents/AlmaSpot/commit/f6a436d))

## [2.0.1](https://github.com/fairlycodeparents/AlmaSpot/compare/2.0.0...2.0.1) (2026-01-21)

### Dependency updates

- **core-deps:** update dependency mongoose to v9.1.5 ([#42](https://github.com/fairlycodeparents/AlmaSpot/issues/42)) ([4f4c905](https://github.com/fairlycodeparents/AlmaSpot/commit/4f4c905))
- **deps:** update golang docker tag to v1.25 ([#32](https://github.com/fairlycodeparents/AlmaSpot/issues/32)) ([f7adeb0](https://github.com/fairlycodeparents/AlmaSpot/commit/f7adeb0))

### Build and continuous integration

- add GHA workflow for Docker release ([#39](https://github.com/fairlycodeparents/AlmaSpot/issues/39)) ([288daa2](https://github.com/fairlycodeparents/AlmaSpot/commit/288daa2))

## [2.0.0](https://github.com/fairlycodeparents/AlmaSpot/compare/1.4.1...2.0.0) (2026-01-19)

### ⚠ BREAKING CHANGES

- backend API are now exposed using HTTP

### Features

- restructure architecture to client-server and expose HTTP API ([#37](https://github.com/fairlycodeparents/AlmaSpot/issues/37)) ([d6c22c1](https://github.com/fairlycodeparents/AlmaSpot/commit/d6c22c1))

### Dependency updates

- deps: update dependency @types/node to v25.0.9 ([#30](https://github.com/fairlycodeparents/AlmaSpot/issues/30)) ([6b9c4ce](https://github.com/fairlycodeparents/AlmaSpot/commit/6b9c4ce))

## [1.4.3](https://github.com/fairlycodeparents/AlmaSpot/compare/1.4.2...1.4.3) (2026-01-18)

### Bug Fixes

- **deps:** update github.com/vaiton/unibocalendar digest to 198546b ([#36](https://github.com/fairlycodeparents/AlmaSpot/issues/36)) ([2c6faab](https://github.com/fairlycodeparents/AlmaSpot/commit/2c6faab2b8722263422230fe6711856344784d07))

## [1.4.2](https://github.com/fairlycodeparents/AlmaSpot/compare/1.4.1...1.4.2) (2026-01-17)

### Dependency updates

- **core-deps:** update dependency mongoose to v9.1.4 ([#31](https://github.com/fairlycodeparents/AlmaSpot/issues/31)) ([1e5c54f](https://github.com/fairlycodeparents/AlmaSpot/commit/1e5c54fe436da647ae61f9a20f627ad7f8219dbc))

## [1.4.1](https://github.com/fairlycodeparents/AlmaSpot/compare/1.4.0...1.4.1) (2026-01-16)

### Bug Fixes

- **search:** integrate AI tests in GH workflow ([a747f0e](https://github.com/fairlycodeparents/AlmaSpot/commit/a747f0e79e247f6e97451c02735a4f43fa26a441))
- **search:** update AIAdapter model version ([3a2670a](https://github.com/fairlycodeparents/AlmaSpot/commit/3a2670ac40e2fb78b305391cb4c7d03690f3a052))
- **tests:** update test command for CI environment ([2333203](https://github.com/fairlycodeparents/AlmaSpot/commit/233320352cd53f61243a0947a82def05758f17d2))

### Build and continuous integration

- conditionally set GEMINI_API_KEY based on PR title ([afbc3d1](https://github.com/fairlycodeparents/AlmaSpot/commit/afbc3d1f127582fcba6978cd8f4e7f7331f785be))

### General maintenance

- **env:** add VAPID key and Mongo configuration to .env.example ([#33](https://github.com/fairlycodeparents/AlmaSpot/issues/33)) ([863e63a](https://github.com/fairlycodeparents/AlmaSpot/commit/863e63ac7d2a58e839a73dc3fe7b57cf49bcc596))
- update .gitignore ([5e1933f](https://github.com/fairlycodeparents/AlmaSpot/commit/5e1933fa3efe67754f0307cf71276c5076d9ef45))

### Refactoring

- **search:** enhance AIAdapter to handle errors ([bbccbb9](https://github.com/fairlycodeparents/AlmaSpot/commit/bbccbb9d3e432ab7b86a802a83694226f037ca25))

## [1.4.0](https://github.com/fairlycodeparents/AlmaSpot/compare/1.3.0...1.4.0) (2026-01-16)

### Features

- add implementation for Unibo Provider (Go) ([500cdf1](https://github.com/fairlycodeparents/AlmaSpot/commit/500cdf1b291c42c2d1ef302835c5a050e65dce33))
- add mongodb as a dependency in package.json and update package-lock.json ([35d4495](https://github.com/fairlycodeparents/AlmaSpot/commit/35d4495337103bfd0191620348f0fca44d2fb8eb))
- add unibo-go dependency ([88f38c3](https://github.com/fairlycodeparents/AlmaSpot/commit/88f38c3fab88c5ece350dd5b3c28a971cbfcbb7d))
- added rooms data for populate db ([22ef490](https://github.com/fairlycodeparents/AlmaSpot/commit/22ef4908215e6305b691262c22f5b0175d7ab773))
- **core:** add adapter for token validation ([dd8ce18](https://github.com/fairlycodeparents/AlmaSpot/commit/dd8ce18964c764e31d712cbb0c05883aab363602))
- enhance ActivityManagementService with synchronization and event handling improvements ([9c42ecf](https://github.com/fairlycodeparents/AlmaSpot/commit/9c42ecf71adabcc014bdc1d765101b3750de49e7))
- fixed go unibo-provider for room and activity search ([ec7e2c5](https://github.com/fairlycodeparents/AlmaSpot/commit/ec7e2c5321ef3b2af138edf6ce6f98c46adeca71))
- implement deleteExternalActivity functionality with validation checks ([312fb84](https://github.com/fairlycodeparents/AlmaSpot/commit/312fb8487502fc28c88c03dc18c73135e406fdf7))
- implement RoomRepositoryMongo and UniboProviderHTTP for room and activity management ([736b409](https://github.com/fairlycodeparents/AlmaSpot/commit/736b4097e8030f24d5c619c3d9817cc5c1d80746))

### Bug Fixes

- **docker-compose:** downgrade MongoDB version and restore network configuration ([a6de5e8](https://github.com/fairlycodeparents/AlmaSpot/commit/a6de5e8443e87a0d85f3028b60cfef1b3d7b39e6))
- **docker-compose:** update port mapping syntax for mongo-express ([1de42c6](https://github.com/fairlycodeparents/AlmaSpot/commit/1de42c6f112932f34e65a510e4894b80003fcb86))
- **UniboProvider:** enhance error handling for fetch failures ([dfdb9a8](https://github.com/fairlycodeparents/AlmaSpot/commit/dfdb9a830d86043c6da5b668ee7609b842750c00))

### Tests

- add integration tests for MongoRoomRepository and UniboProvider ([0a4d74c](https://github.com/fairlycodeparents/AlmaSpot/commit/0a4d74cb526f5a878f01566909387d1731bb961c))
- add unit tests for core context ([eb8ef7f](https://github.com/fairlycodeparents/AlmaSpot/commit/eb8ef7f9d90548888163e8b265eb77decba71733))
- update MongoAdminRepository integration tests to use dbName option ([540f1c2](https://github.com/fairlycodeparents/AlmaSpot/commit/540f1c2b3586cfecef3ea25f9bae0e21460d3d23))

### General maintenance

- **Go:** remove unneeded unibo-go dependency from go.mod ([c73218c](https://github.com/fairlycodeparents/AlmaSpot/commit/c73218c9d241372bd3a3e75887308c2dea904359))
- **renovate:** add package rules ([#28](https://github.com/fairlycodeparents/AlmaSpot/issues/28)) ([d2f05e6](https://github.com/fairlycodeparents/AlmaSpot/commit/d2f05e6944e334baa14bb66d1be230da4f52ac00))

### Refactoring

- improved querying and error handling ([76285f9](https://github.com/fairlycodeparents/AlmaSpot/commit/76285f9e3ff40cec9d814009f403bfd79dd64908))
- minor changes for pr ([ffaf925](https://github.com/fairlycodeparents/AlmaSpot/commit/ffaf925c1d41ccd9e7dc795d6f7a4fc7be1613d3))
- remove unused NotificationService interface from ServicePorts ([b4997cc](https://github.com/fairlycodeparents/AlmaSpot/commit/b4997cc1ce1ce1d527c8fc350fd30e105e5c61b6))
- rename RoomRepositoryMongo to MongoRoomRepository and update imports ([e0b6479](https://github.com/fairlycodeparents/AlmaSpot/commit/e0b6479ab40aa1b978e7f5099f8aa4bfc7fd55bb))
- update database name environment variable ([8351589](https://github.com/fairlycodeparents/AlmaSpot/commit/8351589cc08da349ca94a925ebe1ef1b297739c6))
- update RoomRepository interface and enhance RoomRepositoryMongo type definitions ([c6bfc6e](https://github.com/fairlycodeparents/AlmaSpot/commit/c6bfc6e4a9af87366ee9537a6c90a43c76023209))
- update RoomSearchService to use RoomRepositoryMongo ([ac218a3](https://github.com/fairlycodeparents/AlmaSpot/commit/ac218a3ff3def91d918839569f45ae40aad1d02f))

## [1.3.0](https://github.com/fairlycodeparents/AlmaSpot/compare/1.2.0...1.3.0) (2026-01-14)

### Features

- **search:** add entities and external ports ([1987527](https://github.com/fairlycodeparents/AlmaSpot/commit/1987527f03fbe6e868f8b5ca8ed24350a8603681))
- **search:** impl plan finder in AIAdapter ([d17781a](https://github.com/fairlycodeparents/AlmaSpot/commit/d17781ad1e7d52eff18fa45567f2b3528362e572))
- **search:** impl query extraction in AIAdapter ([f107f5e](https://github.com/fairlycodeparents/AlmaSpot/commit/f107f5ef464be4fb2e5de0507e524da00afa6efb))
- **search:** impl RoomAvailabilityAdapter ([b87ae3d](https://github.com/fairlycodeparents/AlmaSpot/commit/b87ae3d67c888938db990b32939a028d59571b43))
- **search:** impl SearchPlanService ([27de920](https://github.com/fairlycodeparents/AlmaSpot/commit/27de920fd0cbc59f0cd62821d7927f25ac274653))

### Bug Fixes

- **search:** enhance user input with detailed time reference ([d2ad8b2](https://github.com/fairlycodeparents/AlmaSpot/commit/d2ad8b2f44dda910c1adee73e4f8a2771a4582c6))
- **search:** update AIAdapter to use correct AI version ([487a2c2](https://github.com/fairlycodeparents/AlmaSpot/commit/487a2c294dafc4fc2d3cb8ab9723a74ba8097809))
- **tests:** remove unnecessary flag from test script ([a1e9c8c](https://github.com/fairlycodeparents/AlmaSpot/commit/a1e9c8c2b9a12b8973d9aa71fb2ff33233ece4c4))

### Tests

- **search:** refactor to improve reusability ([c6b9886](https://github.com/fairlycodeparents/AlmaSpot/commit/c6b9886d2ec3a55bee09ddb215e847ba2ef6f221))

### General maintenance

- **env:** add Gemini API key configuration to .env.example ([45400b8](https://github.com/fairlycodeparents/AlmaSpot/commit/45400b8bb0e398fef73697125a9749cc2bd5b39f))

### Refactoring

- **search:** rename entities/methods for clarity ([aa524e8](https://github.com/fairlycodeparents/AlmaSpot/commit/aa524e87790fc986b03d50d4af0067238485b4de))
- **search:** update AIAdapter to use RoomAvailable ([a74b604](https://github.com/fairlycodeparents/AlmaSpot/commit/a74b60479f1338de15db3d738478285bc75fcf6f))

## [1.2.0](https://github.com/fairlycodeparents/AlmaSpot/compare/1.1.0...1.2.0) (2026-01-14)

### Features

- add handleActivityAdded implementation and test ([f8d6a26](https://github.com/fairlycodeparents/AlmaSpot/commit/f8d6a2601d6e7f0345f6becdc767764dac824f8f))
- **notification:** add controller and subscribe methods ([79c1ca9](https://github.com/fairlycodeparents/AlmaSpot/commit/79c1ca9cd6577336e7c102a110b5333d4bf166c6))
- **notification:** add data in notification payload ([bf1766d](https://github.com/fairlycodeparents/AlmaSpot/commit/bf1766d26a71dafb7ae7a4cabf546174146ca9f4))
- **notification:** add findByRoomAndPeriod, typed schema and indexing for efficient queries ([bfa4494](https://github.com/fairlycodeparents/AlmaSpot/commit/bfa4494b1e6086d1cc42067e7b6cde319e3f5518))
- **notification:** add urgency headers and TTL to web push notifications ([9ab7a86](https://github.com/fairlycodeparents/AlmaSpot/commit/9ab7a86041d2d5aa44f2d925e3eb39dd23c8502c))
- **notification:** implement and test ActivityAddedListener and InMemoryEventBus for event handling ([bb8525b](https://github.com/fairlycodeparents/AlmaSpot/commit/bb8525b2da8ff7c9d3a0d46fd5df951138d557d6))
- **notification:** implement and test MongoSubscriptionRepository ([66786a5](https://github.com/fairlycodeparents/AlmaSpot/commit/66786a50f7ac85324a349a5437803ad4d2ed02cf))
- **notification:** implement WebPushAdapter for browser notifications ([bc7b313](https://github.com/fairlycodeparents/AlmaSpot/commit/bc7b313a3682459f71f60cf22355ca76bfe00f78))

### Bug Fixes

- **notification:** add endpoint field to subscription model and update related tests ([5863c03](https://github.com/fairlycodeparents/AlmaSpot/commit/5863c03d46d54f09063e38910bb35ef3d357a771))
- **notification:** simplify notification filtering logic and remove redundant date check ([9237629](https://github.com/fairlycodeparents/AlmaSpot/commit/9237629b5a887ea881d0fe487e4a47f70cee1652))
- **notification:** update test to use findByRoomAndPeriod method instead of findAll ([5bd46f3](https://github.com/fairlycodeparents/AlmaSpot/commit/5bd46f3ba16ec484dde79ca6a58576424a892f1e))

### Documentation

- add Subscription and Plan documentation ([9427ebc](https://github.com/fairlycodeparents/AlmaSpot/commit/9427ebcc414538d85cc72258241958093baf68e5))

### Tests

- **notification:** add unit tests for WebPushAdapter functionality ([35d341d](https://github.com/fairlycodeparents/AlmaSpot/commit/35d341d35aa46e82b3d10323ce993fd1212f83a0))
- **notification:** relocate unit tests to dedicated directory ([fa6050c](https://github.com/fairlycodeparents/AlmaSpot/commit/fa6050c99046176659339ddc1f897131d043f1fd))

### Build and continuous integration

- **deps:** add express ([4af4bb9](https://github.com/fairlycodeparents/AlmaSpot/commit/4af4bb973db1adbe28e7fb6c0cc43538b25dea21))

### Refactoring

- **notification:** decouple delivery details from domain entity ([e7b405f](https://github.com/fairlycodeparents/AlmaSpot/commit/e7b405f0248626c40046141425575d1f343412db))

## [1.1.0](https://github.com/fairlycodeparents/AlmaSpot/compare/1.0.1...1.1.0) (2026-01-14)

### Features

- **authentication:** implement login and signup flow ([d9bdb06](https://github.com/fairlycodeparents/AlmaSpot/commit/d9bdb0669e79a786a7914fa707837d9e54dbfb4d))
- **authentication:** implement mongodb persistence ([f55d5d2](https://github.com/fairlycodeparents/AlmaSpot/commit/f55d5d22485ea830ecab5b34c3c79af976a7e048))

### Bug Fixes

- **authentication:** correct export syntax for AuthFacade ([e736dd3](https://github.com/fairlycodeparents/AlmaSpot/commit/e736dd32634be82bf871b0cefd4668ac69d820ca))

### Tests

- **authentication:** add integration tests for MongoAdminRepository ([ce309b9](https://github.com/fairlycodeparents/AlmaSpot/commit/ce309b963612de5efa23159b7ce7b60e4a370660))
- **authentication:** add unit tests for AuthSchemas ([9c004ca](https://github.com/fairlycodeparents/AlmaSpot/commit/9c004cad8b8dd7eab29221a7c5f2b68d099f3655))
- **authentication:** add unit tests for AuthService ([1c0eac5](https://github.com/fairlycodeparents/AlmaSpot/commit/1c0eac590ad8bbed30b4f0f3f60623c03730c3f1))

### Build and continuous integration

- **deps:** add express, zod, jwt, argon2, uuid and dotenv ([24ae5be](https://github.com/fairlycodeparents/AlmaSpot/commit/24ae5be6e02fe1ae2ca8760ab30d595e622ad640))
- **deps:** add mongoose and setup mongo ([358569c](https://github.com/fairlycodeparents/AlmaSpot/commit/358569c097eb5af9248039ad2bbd3877ad30766e))
- **deps:** add web-push and google genai dependencies ([7ec85db](https://github.com/fairlycodeparents/AlmaSpot/commit/7ec85dbeab1ea9d503c0a268d74d3051e08766e4))
- **pr-checks:** add MongoDB service for CI testing ([af02a17](https://github.com/fairlycodeparents/AlmaSpot/commit/af02a17456f20ab90a72783aadf243f5923cd1b6))

### General maintenance

- **config:** add zod validation for environment variables and update env example ([24961c1](https://github.com/fairlycodeparents/AlmaSpot/commit/24961c1cf45d69484682f081a05116bb1cfe1c2c))
- **config:** update .gitignore and add .env.example for auth setup ([96d6870](https://github.com/fairlycodeparents/AlmaSpot/commit/96d687098c094c9704e3e3a5f587423a43dbd2a1))
- **config:** update .gitignore and add test coverage configuration ([94bfc27](https://github.com/fairlycodeparents/AlmaSpot/commit/94bfc27117a47e308f5542e7975684a0304769a2))

### Refactoring

- **authentication:** update repository structure ([3b34e62](https://github.com/fairlycodeparents/AlmaSpot/commit/3b34e6262feaac24d061580330bbd572d062b468))

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

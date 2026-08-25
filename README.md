### Hexlet tests and linter status:
[![Actions Status](https://github.com/novidee/ai-for-developers-project-386/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/novidee/ai-for-developers-project-386/actions)

# Календарь бронирования

Фронтенд находится в `ui/` и реализован на React, TypeScript, Vite и Mantine. Он работает только через API, описанный в `main.tsp`.

## Установка

```bash
npm install
npm run backend:install
npm run ui:install
```

## Запуск с Prism

В первом терминале запустите mock API на `http://localhost:4010`:

```bash
npm run mock
```

Во втором терминале запустите Vite на `http://localhost:3000`:

```bash
npm run ui:dev
```

## Запуск с backend

В первом терминале запустите TypeScript-бэкенд на `http://localhost:4010`:

```bash
npm run backend
```

Во втором терминале запустите UI:

```bash
npm run ui:dev
```

Бэкенд хранит данные в памяти и сбрасывает их после перезапуска. Для каждого типа встречи он автоматически создаёт доступные слоты на 14 дней. По умолчанию UI отправляет запросы на `http://localhost:4010`. Для другого адреса создайте `ui/.env`:

```dotenv
VITE_API_BASE_URL=http://localhost:4010
```

Бэкенд реализует контракт из `main.tsp` и разрешает CORS для отдельного фронтенд-клиента.

## Проверка сборки

```bash
npm run compile
npm run backend:build
npm run ui:build
```

## Интеграционные сценарии

Playwright-проверки фиксируют три пользовательских сценария:

1. `guest-books-slot.spec.ts`: гость выбирает формат и свободный слот, подтверждает бронирование, после чего владелец видит созданную запись.
2. `owner-creates-event-type.spec.ts`: владелец создаёт тип встречи и видит его в таблице.
3. `new-event-type-has-slots.spec.ts`: созданный владельцем тип появляется у гостя с автоматически сгенерированными доступными слотами.

Playwright запускает реальные backend и frontend из `playwright.config.ts`. Перед первым локальным запуском установите Chromium:

```bash
npx playwright install chromium
npm run test:e2e
```

Для отладки теста в интерактивном режиме используйте `npm run test:e2e:ui`. В CI сценарий запускается workflow `.github/workflows/e2e.yml` для pull request и изменений в `main`; HTML-отчёт сохраняется как artifact.

## Коммиты и релизы

Все коммиты, включая созданные AI-агентами, должны соответствовать [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

- `feat: add booking reminder` — новая функциональность, следующая minor-версия;
- `fix: prevent duplicate booking` — исправление, следующая patch-версия;
- `feat!: change booking API` — несовместимое изменение, следующая major-версия;
- `docs:`, `test:`, `ci:`, `chore:` и другие стандартные типы — изменения без автоматического повышения версии.

Workflow `.github/workflows/release-please.yml` анализирует коммиты после каждого push в `main`. Он создаёт или обновляет release-PR с новой версией в `package.json` и `package-lock.json` и с автоматически сформированным `CHANGELOG.md`. После слияния release-PR создаются тег и GitHub Release.

Чтобы workflow мог открыть release-PR через `GITHUB_TOKEN`, включите в репозитории настройку `Settings → Actions → General → Workflow permissions → Allow GitHub Actions to create and approve pull requests`. После слияния первого Conventional Commit в `main` проверьте запуск `release-please` во вкладке Actions и появление release-PR.

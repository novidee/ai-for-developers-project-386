### Hexlet tests and linter status:
[![Actions Status](https://github.com/novidee/ai-for-developers-project-386/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/novidee/ai-for-developers-project-386/actions)

# Календарь бронирования

Фронтенд находится в `ui/` и реализован на React, TypeScript, Vite и Mantine. Он работает только через API, описанный в `main.tsp`.

## Установка

```bash
npm install
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

По умолчанию UI отправляет запросы на `http://localhost:4010`. Для другого адреса создайте `ui/.env`:

```dotenv
VITE_API_BASE_URL=http://localhost:4010
```

Backend должен реализовывать контракт из `main.tsp` и разрешать CORS для dev-сервера `http://localhost:3000`.

## Проверка сборки

```bash
npm run compile
npm run ui:build
```

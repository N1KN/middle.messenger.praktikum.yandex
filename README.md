## Проект: Messenger

[![Netlify Status](https://api.netlify.com/api/v1/badges/00b510bd-079e-4bd1-9330-ac96adcaf53a/deploy-status)](https://app.netlify.com/sites/monumental-mochi-0d05b9/deploys)

* Макет в Figma(базовый от практикума): [Ссылка на макет](https://www.figma.com/file/mmGHWplanO1npWUlObLBfc/)
* Ссылки на развёрнутое приложение:
  * Netlify: [Ссылка для ветки deploy](https://monumental-mochi-0d05b9.netlify.app/)
  * Netlify: [Ссылка для ветки sprint_2](https://vocal-caramel-a649ff.netlify.app/)
  * Netlify: [Ссылка для ветки sprint_3](https://storied-horse-795083.netlify.app/)
  * Netlify: [Ссылка для ветки sprint_3](https://hilarious-banoffee-e6731a.netlify.app/)

---

Тренировочный проект курса Яндекс.Практикум "Мидл фронтенд-разработчик"

## Скрипты

- `npm inatall` - Установка зависимостей
- `npm run build` - Сборка проекта в директорию `/dist`
- `npm run dev` - Запуск сервера в режиме разработки (порт: `1234`)

### Текущий этап

Спринт 3 из 4

### Спринт №1
https://github.com/N1KN/middle.messenger.praktikum.yandex/pull/2

* Настроил сборку с использованием [Parcel](https://parceljs.org/) и раздачу статических файлов с помощью NodeJS Express
* Приложение автоматически деплоится на [Netlify](https://www.netlify.com/) из ветки `deploy`. [Ссылка на приложение](https://monumental-mochi-0d05b9.netlify.app/)
* Писал приложение сразу используя TypeScript
* Добавил проверку кодстиля Eslint, Prttier, EditorConfig
* Использовал процессор для работы со стилями PostCSS
* Реализовал базовый роутер на паре функий

### Спринт №2
https://github.com/N1KN/middle.messenger.praktikum.yandex/pull/3

* Реализовал шину событий (`lib/event-bus.ts`)
* Реализация компонента (`lib/block.ts`) с собственными пропсами, жизненным циклом и реактивным ререндером при изменении пропсов (использованы `Proxy`)
* Реализовал обработчик форм (`lib/form-handler.ts`) на основе EventBus
* Реализовал клиентскую валидацию на основе валидаторов(`utils/validators.ts`) и `FormHandler`
* Приложение переписано с учётом новых компонентов

### Спринт №3
https://github.com/N1KN/middle.messenger.praktikum.yandex/pull/4

* Доработал клиентский роутер (`utils/route.ts`, `utils/route.ts`)
* Добавлен слой `api` с реалзицие запросов
* Добавлен слой `controllers` с реализацией логики связывающей компоненты и "ручки"
* Реализовал и подключил к компонентам центральное хранилище. Реализация (`/lib/state-manager/index.ts`) и использование (`/store/index.ts`)
* Использован `WebSocket` для сообщений чата
* В приложении реализованы следующее возможности:
  * Регистрация
  * Авторизация
  * Выход
  * Обновление данных профиля
  * Изменение пароля
  * Изменение аватара
  * Создание и удаление чата
  * Добавление и удаление пользователей в чате, отправка сообщений
  * Отправка и получение текстовых сообщений

### Спринт №4

*В ПРОЦЕССЕ*
https://github.com/N1KN/middle.messenger.praktikum.yandex/pull/5

# BankHUB

> Курсова робота — банківський веб-застосунок.

## Опис

BankHUB імітує базові функції банку: реєстрацію та авторизацію користувача, управління балансом, перекази між користувачами, історію транзакцій та збереження даних між сесіями. Застосунок побудований на клієнт-серверній архітектурі з JWT авторизацією.

## Технології

- **Frontend:** Vanilla JS (ES Modules), HTML, CSS
- **Backend:** Node.js, Express
- **Авторизація:** JWT + bcrypt
- **Зберігання даних:** localStorage (клієнт), JSON файли (сервер)

## Команда та розподіл роботи

| Учасник                        | Роль               | Відповідальність                                                                                                                       |
| ------------------------------ | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Варенко Катерина _(тім-лідер)_ | Fullstack (core)   | `storage.js`, `api.js`, `eventBus.js`, `memoize.js`, `logger.js`, `server/index.js`, `server/middleware/auth.js`, налаштування проєкту |
| Лобода Аліна                   | Fullstack          | `src/account.js`, `src/transactions.js`, `server/routes/accounts.js`, `server/routes/transactions.js`                                  |
| Євмененко Дмитро               | Fullstack          | `src/auth.js`, `src/validation.js`, `server/routes/auth.js`                                                                            |
| Поліщук Анна                   | Frontend           | `src/ui.js`, `src/index.js`                                                                                                            |
| Сітковська Аліна               | Frontend + верстка | `account.html`, `index.html`, `src/style.css`                                                                                          |

## Структура проєкту

bank-app/
├── server/
│ ├── middleware/
│ │ └── auth.js  
│ ├── routes/
│ │ ├── accounts.js  
│ │ ├── auth.js  
│ │ └── transactions.js  
│ └── index.js  
├── src/
│ ├── http/
│ │ ├── apiService.js  
│ │ ├── authProxy.js  
│ │ └── baseClient.js  
│ ├── account.js  
│ ├── api.js  
│ ├── auth.js  
│ ├── eventBus.js  
│ ├── index.js  
│ ├── logger.js  
│ ├── memoize.js  
│ ├── storage.js  
│ ├── style.css  
│ ├── transactions.js  
│ ├── ui.js  
│ └── validation.js  
├── .gitignore  
├── LICENSE
├── README.md  
├── account.html  
├── index.html
├── package-lock.json
└── package.json

## Архітектура сервера

Сервер розбитий на незалежні модулі — кожен роут в окремому файлі. Це дозволило розподілити роботу між учасниками без конфліктів.

**Нестандартні рішення:**

- **JWT з прив'язкою до User-Agent** — токен містить `user-agent` браузера і перевіряється при кожному запиті. Якщо токен вкрадено і використовується з іншого браузера — він не спрацює.
- **Захист `/init-data`** — при логіні сервер повертає тільки дані поточного користувача, відфільтровані по `userId`. Інші користувачі не бачать чужих транзакцій.
- **Читання `data.json` при кожному запиті** — замість кешування через `require`, сервер завжди читає актуальні дані з файлу через `fs.readFileSync`.
- **Logger як декоратор** — `log({ level: "INFO" })` огортає будь-який роут і логує вхідні дані, час виконання та помилки не змінюючи логіку роута.

## Інтегровані концепції з лабораторних

| Лаба   | Концепція                                                           | Файл              |
| ------ | ------------------------------------------------------------------- | ----------------- |
| Лаба 3 | Memoization з LRU/FIFO та TTL                                       | `src/memoize.js`  |
| Лаба 7 | EventEmitter з `subscribe`, `unsubscribe`, `once`, обробкою помилок | `src/eventBus.js` |
| Лаба 8 | Proxy патерн + Dependency Injection                                 | `src/http/`       |
| Лаба 9 | Logging Decorator з рівнями INFO/DEBUG/ERROR                        | `src/logger.js`   |

## Як запустити

```bash
# 1. Клонувати репозиторій
git clone https://github.com/linamalina238/bank-app.git
cd bank-app

# 2. Встановити залежності
npm install

# 3. Створити .env файл в папці server/
JWT_SECRET=your_secret_key
PORT=3000

# 4. Запустити сервер
cd server
node index.js
```

Після цього відкрити `index.html` у браузері або через Live Server у VS Code.
Сервер працює на `http://localhost:3000`.

## Ліцензія

MIT — переглянути файл [LICENSE](./LICENSE)

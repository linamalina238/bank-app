# Bank App

> Курсова робота — банківський веб-застосунок.

## Команда та розподіл роботи

| Файл                  | Функціонал                                | Відповідальний |
| --------------------- | ----------------------------------------- | -------------- |
| `src/auth.js`         | Реєстрація, вхід, перевірка логіна/пароля | Teammate 1     |
| `src/account.js`      | Рахунок, баланс, поповнення, списання     | Teammate 2     |
| `src/transactions.js` | Перекази, історія, категорії витрат       | Teammate 3     |
| `src/ui.js`           | DOM, кнопки, форми, динамічне оновлення   | Teammate 4     |
| `src/storage.js`      | localStorage, збереження всіх даних       | Teammate 5     |

## Структура проєкту

```
bank-app/
  src/
    auth.js
    account.js
    transactions.js
    ui.js
    storage.js
    index.js          ← підключає всі модулі разом
  index.html          ← головна сторінка
  package.json
  .gitignore
  LICENSE
  README.md
  server/
   index.js
   users.json
   data.json
  node_modules/
   express/

bank-app-example/     ← окремий проєкт з прикладами використання
  index.js
  package.json
```

## Як запустити

```bash
git clone https://github.com/linamalina238/bank-app.git
cd bank-app
npm run dev
```

Відкрити `index.html` у браузері — або використати `npm run dev` якщо встановлено `live-server`.

## Як працювати з Git (для кожного учасника)

```bash
# 1. Клонувати репозиторій
git clone https://github.com/linamalina238/bank-app.git
cd bank-app

# 2. Створити свою гілку
git checkout -b feature/storage   # або auth, account, тощо

# 3. Робити зміни у своєму файлі, потім:
git add src/storage.js
git commit -m "feat: add saveUser and getBalance functions"
git push origin feature/storage

# 4. Створити Pull Request на GitHub → main
```

## Правила для команди

- Кожен працює **лише у своєму файлі** (`src/твій-файл.js`)
- Гілки називати: `feature/auth`, `feature/storage`, тощо
- Коміти писати зрозуміло: `feat:`, `fix:`, `docs:`
- Перед злиттям — обов'язково Pull Request

## Ліцензія

MIT — дивись файл [LICENSE](./LICENSE)

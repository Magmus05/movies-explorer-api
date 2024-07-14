# Используем образ дистрибутив линукс Alpine с версией Node -14 Node.js
FROM node:18

# Указываем нашу рабочую дерикторию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json внутрь контейнера
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install
RUN npm install -g pm2
# Копируем оставшееся приложение в контейнер
COPY . .


# Открываем порт 3001 в нашем контейнере
EXPOSE 3001

# Запускаем сервер
CMD ["pm2-runtime", "start", "app.js"]
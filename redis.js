// Подключаем библиотеку Redis
const redis = require('redis');

// Создаем Redis-клиент
const client = redis.createClient();

// Срабатывает при успешном подключении
client.on('connect', () => {
  console.log('Подключено к Redis');
});

// Срабатывает при ошибке Redis
client.on('error', (err) => {
  console.error('Ошибка Redis:', err);
});

// Подключаемся к Redis
client.connect();

// Экспортируем клиент для использования в других файлах
module.exports = client;

// Подключаем библиотеку WebSocket
const WebSocket = require('ws');

// Подключаем Redis-клиент
const redisClient = require('./redis');

// Создаем WebSocket-сервер
const server = new WebSocket.Server({ port: 9000 });

// Событие подключения клиента
server.on('connection', (ws) => {
  console.log('Клиент подключился');

  // Получение сообщений от клиента
  ws.on('message', async (message) => {
    try {
      // Преобразуем сообщение в строку
      const textMessage = message.toString();

      console.log('Получено сообщение:', textMessage);

      // Попытка преобразовать JSON
      const data = JSON.parse(textMessage);

      // CRUD-операции для TODO
      switch (data.command) {
        // Создание задачи
        case 'create':
          await redisClient.hSet('todos', data.id, data.title);

          ws.send(
            JSON.stringify({
              message: 'TODO создано',
            })
          );
          break;

        // Получение всех задач
        case 'read':
          const todos = await redisClient.hGetAll('todos');

          ws.send(JSON.stringify(todos));
          break;

        // Обновление задачи
        case 'update':
          const exists = await redisClient.hExists('todos', data.id);

          if (!exists) {
            ws.send(
              JSON.stringify({
                error: 'TODO не найдено',
              })
            );
            break;
          }

          await redisClient.hSet('todos', data.id, data.title);

          ws.send(
            JSON.stringify({
              message: 'TODO обновлено',
            })
          );
          break;

        // Удаление задачи
        case 'delete':
          await redisClient.hDel('todos', data.id);

          ws.send(
            JSON.stringify({
              message: 'TODO удалено',
            })
          );
          break;

        // Неизвестная команда
        default:
          ws.send(
            JSON.stringify({
              error: 'Неизвестная команда',
            })
          );
      }
    } catch (error) {
      // Если сообщение не JSON —
      // отправляем перевернутую строку
      const reversedMessage = message
        .toString()
        .split('')
        .reverse()
        .join('');

      ws.send(reversedMessage);
    }
  });

  // Событие отключения клиента
  ws.on('close', () => {
    console.log('Клиент отключился');
  });
});

console.log('WebSocket-сервер запущен на порту 9000');

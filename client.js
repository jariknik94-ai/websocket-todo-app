// Подключаем библиотеку WebSocket
const WebSocket = require('ws');

// Подключаемся к серверу
const client = new WebSocket('ws://localhost:9000');

// Срабатывает после подключения
client.on('open', () => {
  console.log('Подключено к серверу WebSocket');

  // Отправка обычного текста каждые 3 секунды
  // для проверки переворачивания строки
  setInterval(() => {
    const currentDate = new Date().toISOString();

    client.send(currentDate);
  }, 3000);

  // CRUD ЗАПРОСЫ
  // Создание задачи
  setTimeout(() => {
    client.send(
      JSON.stringify({
        command: 'create',
        id: '1',
        title: 'Купить продукты',
      })
    );
  }, 1000);

  // Получение списка задач
  setTimeout(() => {
    client.send(
      JSON.stringify({
        command: 'read',
      })
    );
  }, 2000);

  // Обновление задачи
  setTimeout(() => {
    client.send(
      JSON.stringify({
        command: 'update',
        id: '1',
        title: 'Купить хлеб',
      })
    );
  }, 4000);

  // Удаление задачи
  setTimeout(() => {
    client.send(
      JSON.stringify({
        command: 'delete',
        id: '1',
      })
    );
  }, 6000);
});

// Получение сообщений от сервера
client.on('message', (message) => {
  console.log('Ответ от сервера:', message.toString());
});

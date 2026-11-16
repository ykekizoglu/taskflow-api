import express from 'express';
import { fileURLToPath } from 'node:url';
import { createStore } from './store.js';
import { logger } from './middleware/logger.js';
import { taskRoutes } from './routes/tasks.js';

export function createApp({ dataFile = fileURLToPath(new URL('../data/tasks.json', import.meta.url)) } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(logger);
  app.use(express.json());
  app.use('/tasks', taskRoutes(createStore(dataFile)));
  app.use((req, res) => res.status(404).json({ error: 'Endpoint bulunamadı.' }));
  app.use((error, req, res, next) => {
    if (error.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Geçerli bir JSON gönderilmelidir.' });
    }
    if (error.status === 413) {
      return res.status(413).json({ error: 'İstek gövdesi çok büyük.' });
    }
    console.error(error);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  });
  return app;
}

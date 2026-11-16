import { Router } from 'express';
import { randomUUID } from 'node:crypto';

const statuses = ['pending', 'in_progress', 'completed'];
const priorities = ['low', 'medium', 'high'];

// Küçük alan kontrolleri route içinde tutulur; ayrı validation katmanı yoktur.
function checkInput(body, creating = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'JSON nesnesi gönderilmelidir.';
  }
  if (creating || 'title' in body) {
    if (typeof body.title !== 'string' || !body.title.trim()) {
      return 'title boş olmayan bir metin olmalıdır.';
    }
  }
  for (const field of ['description', 'assignee']) {
    if (field in body && typeof body[field] !== 'string') {
      return `${field} metin olmalıdır.`;
    }
  }
  if ('status' in body && !statuses.includes(body.status)) {
    return `status şu değerlerden biri olmalıdır: ${statuses.join(', ')}.`;
  }
  if ('priority' in body && !priorities.includes(body.priority)) {
    return `priority şu değerlerden biri olmalıdır: ${priorities.join(', ')}.`;
  }
}

export function taskRoutes(store) {
  const router = Router();

  router.get('/', (req, res) => res.json(store.read()));

  router.get('/:id', (req, res) => {
    const task = store.read().find(task => task.id === req.params.id);
    if (!task) return res.status(404).json({ error: 'Görev bulunamadı.' });
    res.json(task);
  });

  router.post('/', (req, res) => {
    const error = checkInput(req.body, true);
    if (error) return res.status(400).json({ error });
    const now = new Date().toISOString();
    const task = {
      id: randomUUID(),
      title: req.body.title.trim(),
      description: req.body.description ?? '',
      assignee: req.body.assignee ?? '',
      status: req.body.status ?? 'pending',
      priority: req.body.priority ?? 'medium',
      createdAt: now,
      updatedAt: now,
    };
    const tasks = store.read();
    tasks.push(task);
    store.write(tasks);
    res.status(201).location(`/tasks/${task.id}`).json(task);
  });

  router.patch('/:id', (req, res) => {
    const tasks = store.read();
    const task = tasks.find(task => task.id === req.params.id);
    if (!task) return res.status(404).json({ error: 'Görev bulunamadı.' });
    const error = checkInput(req.body);
    if (error) return res.status(400).json({ error });
    const fields = ['title', 'description', 'assignee', 'status', 'priority'];
    if (!fields.some(field => field in req.body)) {
      return res.status(400).json({ error: 'Güncellenecek en az bir görev alanı gönderilmelidir.' });
    }
    for (const field of fields) {
      if (field in req.body) task[field] = field === 'title' ? req.body[field].trim() : req.body[field];
    }
    task.updatedAt = new Date().toISOString();
    store.write(tasks);
    res.json(task);
  });

  router.delete('/:id', (req, res) => {
    const tasks = store.read();
    const index = tasks.findIndex(task => task.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Görev bulunamadı.' });
    tasks.splice(index, 1);
    store.write(tasks);
    res.status(204).end();
  });

  return router;
}

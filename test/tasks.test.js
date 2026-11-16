import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { createApp } from '../src/app.js';

test('CRUD, kalıcı kayıt ve hatalı istekler', async t => {
  const directory = mkdtempSync(join(tmpdir(), 'taskflow-'));
  const dataFile = join(directory, 'tasks.json');
  const servers = [];
  t.after(async () => {
    await Promise.all(servers.map(server => new Promise(resolve => server.close(resolve))));
    rmSync(directory, { recursive: true, force: true });
  });
  async function start() {
    const server = createApp({ dataFile }).listen(0, '127.0.0.1');
    servers.push(server);
    await once(server, 'listening');
    return `http://127.0.0.1:${server.address().port}`;
  }
  const base = await start();
  const send = (path, method = 'GET', body) => fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  assert.deepEqual(await (await send('/tasks')).json(), []);
  assert.equal((await send('/tasks', 'POST', { title: ' ' })).status, 400);
  assert.equal((await fetch(base + '/tasks', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{',
  })).status, 400);
  const response = await send('/tasks', 'POST', { title: ' API geliştir ', assignee: 'Yusuf', priority: 'high' });
  assert.equal(response.status, 201);
  const task = await response.json();
  assert.equal(task.title, 'API geliştir');
  assert.equal(task.status, 'pending');
  assert.equal(response.headers.get('location'), `/tasks/${task.id}`);
  assert.equal((await (await send('/tasks')).json()).length, 1);
  assert.deepEqual(await (await send(`/tasks/${task.id}`)).json(), task);

  const reopened = await start();
  assert.deepEqual(await (await fetch(`${reopened}/tasks/${task.id}`)).json(), task);
  assert.equal((await send(`/tasks/${task.id}`, 'PATCH', { status: 'wrong' })).status, 400);
  assert.equal((await send(`/tasks/${task.id}`, 'PATCH', {})).status, 400);
  const updated = await send(`/tasks/${task.id}`, 'PATCH', { status: 'completed', id: 'changed' });
  assert.equal(updated.status, 200);
  const result = await updated.json();
  assert.equal(result.status, 'completed');
  assert.equal(result.id, task.id);
  assert.equal(result.title, task.title);
  assert.equal((await (await fetch(`${reopened}/tasks/${task.id}`)).json()).status, 'completed');

  const deleted = await send(`/tasks/${task.id}`, 'DELETE');
  assert.equal(deleted.status, 204);
  assert.equal(await deleted.text(), '');
  assert.equal((await send(`/tasks/${task.id}`)).status, 404);
  assert.equal((await send(`/tasks/${task.id}`, 'PATCH', { title: 'Yok' })).status, 404);
  assert.equal((await send(`/tasks/${task.id}`, 'DELETE')).status, 404);
  assert.deepEqual(await (await fetch(reopened + '/tasks')).json(), []);
  assert.equal((await send('/unknown')).status, 404);
});

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export function createStore(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
  if (!existsSync(filePath)) writeFileSync(filePath, '[]\n');

  return {
    read() {
      return JSON.parse(readFileSync(filePath, 'utf8'));
    },
    write(tasks) {
      writeFileSync(filePath, JSON.stringify(tasks, null, 2) + '\n');
    },
  };
}

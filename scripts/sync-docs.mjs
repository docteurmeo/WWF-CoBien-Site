import { cpSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('.');
const dist = resolve('dist');
const docs = resolve('docs');

if (!existsSync(dist)) throw new Error('dist does not exist. Run npm run build first.');
if (!dist.startsWith(root) || !docs.startsWith(root)) throw new Error('Refusing to sync outside repo.');

rmSync(docs, { recursive: true, force: true });
cpSync(dist, docs, { recursive: true });
console.log('Synced dist -> docs');

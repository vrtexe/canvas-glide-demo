// Builds every app in apps/ and assembles the site in dist/: the shell at the root, each app under /<id>/.
import { execSync } from 'node:child_process';
import { cpSync, existsSync, rmSync } from 'node:fs';
import { frameworks } from './public/frameworks.js';

const only = process.argv.slice(2);
const selected = only.length ? frameworks.filter(({ id }) => only.includes(id)) : frameworks;

if (!only.length) rmSync('dist', { recursive: true, force: true });
cpSync('public', 'dist', { recursive: true });

for (const { id, file } of selected) {
  const app = `apps/${id}`;
  console.log(`\n${id}`);
  if (!existsSync(`${app}/node_modules`)) execSync('npm ci', { cwd: app, stdio: 'inherit' });
  execSync('npm run build', { cwd: app, stdio: 'inherit' });
  rmSync(`dist/${id}`, { recursive: true, force: true });
  cpSync(`${app}/dist`, `dist/${id}`, { recursive: true });
  cpSync(`${app}/${file}`, `dist/${id}/source.txt`);
}

// The header stores the image with the same localforage build the apps bundle.
const localforage = frameworks.map(({ id }) => `apps/${id}/node_modules/localforage/dist/localforage.min.js`).find(existsSync);
cpSync(localforage, 'dist/localforage.min.js');

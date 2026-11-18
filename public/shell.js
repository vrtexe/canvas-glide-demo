// The shell is a header over one framework demo in an iframe. The image and the theme are picked here and kept in the
// origin's storage, where every demo reads them: the image with localforage under `file`, the theme in localStorage.
import { frameworks } from './frameworks.js';

const tabs = document.querySelector('.tabs');
const frame = document.querySelector('#frame');
const sourceButton = document.querySelector('#source');
const code = document.querySelector('#code');

const fileInput = document.querySelector('#file');
const clearButton = document.querySelector('#clear');
const themeButton = document.querySelector('#theme');
const themeMenu = document.querySelector('#theme-menu');

const icon = (body) =>
  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const themes = [
  { value: 'auto', label: 'Auto', icon: icon('<rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />') },
  { value: 'light', label: 'Light', icon: icon('<circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />') },
  { value: 'dark', label: 'Dark', icon: icon('<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />') },
];

let current = null;

function applyTheme(value) {
  const theme = themes.find((entry) => entry.value === value) ?? themes[0];
  if (theme.value === 'auto') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme.value;
  themeButton.querySelector('.dropdown-value').innerHTML = `${theme.icon}<span class="dropdown-label">${theme.label}</span>`;
  themeButton.setAttribute('aria-label', `Theme: ${theme.label}`);
  for (const option of themeMenu.querySelectorAll('[role="option"]')) {
    const selected = option.dataset.value === theme.value;
    option.setAttribute('aria-selected', String(selected));
    option.classList.toggle('dropdown-item--active', selected);
  }
}

function setThemeMenu(open) {
  themeMenu.hidden = !open;
  themeButton.setAttribute('aria-expanded', String(open));
}

function chooseTheme(value) {
  localStorage.setItem('theme', value);
  applyTheme(value);
  setThemeMenu(false);
  themeButton.focus();
}

/** A labelled grid, so panning and zooming show where you are and how sharp the image stays. */
async function sampleImage() {
  const width = 3000;
  const height = 2000;
  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext('2d');
  context.fillStyle = '#faf9fb';
  context.fillRect(0, 0, width, height);
  for (let x = 0; x <= width; x += 25) {
    context.fillStyle = x % 250 === 0 ? '#8b84a0' : '#dcd8e4';
    context.fillRect(x, 0, x % 250 === 0 ? 2 : 1, height);
  }
  for (let y = 0; y <= height; y += 25) {
    context.fillStyle = y % 250 === 0 ? '#8b84a0' : '#dcd8e4';
    context.fillRect(0, y, width, y % 250 === 0 ? 2 : 1);
  }
  context.fillStyle = '#3b3548';
  context.font = '500 18px ui-monospace, Consolas, monospace';
  for (let x = 0; x < width; x += 250) {
    for (let y = 0; y < height; y += 250) context.fillText(`${x},${y}`, x + 8, y + 24);
  }
  context.fillStyle = '#aa3bff';
  context.font = '600 220px system-ui, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('canvas-glide', width / 2, height / 2);
  return canvas.convertToBlob({ type: 'image/png' });
}

/** Stores the image every demo shows and reloads the open one, because IndexedDB tells other documents nothing. */
async function storeImage(image) {
  await localforage.setItem('file', image);
  frame.contentWindow?.location.reload();
}

async function showSource(framework) {
  document.querySelector('#code-file').textContent = `${framework.name} · ${framework.file}`;
  document.querySelector('#code-repo').href = `https://github.com/vrtexe/canvas-glide-${framework.id}`;
  const text = document.querySelector('#code-text');
  try {
    const response = await fetch(`./${framework.id}/source.txt`);
    text.textContent = response.ok ? await response.text() : 'The source of this demo is not in the build.';
  } catch {
    text.textContent = 'The source of this demo could not be loaded.';
  }
}

function select(id, focus = false) {
  const framework = frameworks.find((entry) => entry.id === id) ?? frameworks[0];
  if (current === framework.id) return;
  current = framework.id;

  for (const tab of tabs.children) {
    const selected = tab.dataset.id === framework.id;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focus) tab.focus();
  }
  frame.title = `${framework.name} demo`;
  frame.setAttribute('aria-labelledby', `tab-${framework.id}`);
  frame.src = `./${framework.id}/`;
  history.replaceState(null, '', `#${framework.id}`);
  if (!code.hidden) showSource(framework);
}

for (const framework of frameworks) {
  const tab = document.createElement('button');
  tab.type = 'button';
  tab.role = 'tab';
  tab.id = `tab-${framework.id}`;
  tab.className = 'tab';
  tab.dataset.id = framework.id;
  tab.setAttribute('aria-controls', 'frame');
  tab.textContent = framework.name;
  tab.addEventListener('click', () => select(framework.id));
  tabs.append(tab);
}

tabs.addEventListener('keydown', (event) => {
  const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
  if (!step) return;
  const index = frameworks.findIndex((entry) => entry.id === current);
  select(frameworks[(index + step + frameworks.length) % frameworks.length].id, true);
  event.preventDefault();
});

sourceButton.addEventListener('click', () => {
  code.hidden = !code.hidden;
  sourceButton.setAttribute('aria-pressed', String(!code.hidden));
  if (!code.hidden) showSource(frameworks.find((entry) => entry.id === current));
});

for (const theme of themes) {
  const item = document.createElement('li');
  item.role = 'none';
  item.innerHTML = `<button type="button" role="option" class="button dropdown-item" data-value="${theme.value}">${theme.icon}${theme.label}</button>`;
  item.firstElementChild.addEventListener('click', () => chooseTheme(theme.value));
  themeMenu.append(item);
}

fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0];
  if (file) storeImage(file);
});

clearButton.addEventListener('click', () => {
  fileInput.value = '';
  storeImage(null);
});

themeButton.addEventListener('click', () => setThemeMenu(themeMenu.hidden));
document.addEventListener('click', (event) => {
  if (!themeMenu.hidden && !event.target.closest('.dropdown')) setThemeMenu(false);
});
// A click in the demo frame does not reach this document, but it takes the focus from this window.
window.addEventListener('blur', () => setThemeMenu(false));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !themeMenu.hidden) {
    setThemeMenu(false);
    themeButton.focus();
  }
});
// A theme changed in another tab of the browser.
window.addEventListener('storage', (event) => event.key === 'theme' && applyTheme(event.newValue));
window.addEventListener('hashchange', () => select(location.hash.slice(1)));

applyTheme(localStorage.getItem('theme'));
// The first visit gets a sample; a removed image is stored as null, so it stays removed.
if (!(await localforage.keys()).includes('file')) await localforage.setItem('file', await sampleImage());
select(location.hash.slice(1));

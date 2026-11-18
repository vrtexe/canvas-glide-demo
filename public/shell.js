// The shell is a header over one framework demo in an iframe. The demos keep the image and the theme in the same
// origin's storage, so switching frameworks keeps both.
import { frameworks } from './frameworks.js';

const tabs = document.querySelector('.tabs');
const frame = document.querySelector('#frame');
const sourceButton = document.querySelector('#source');
const code = document.querySelector('#code');

let current = null;

function applyTheme(theme) {
  if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
  else delete document.documentElement.dataset.theme;
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

// A theme picked inside a demo is written to localStorage, which fires `storage` here.
window.addEventListener('storage', (event) => event.key === 'theme' && applyTheme(event.newValue));
window.addEventListener('hashchange', () => select(location.hash.slice(1)));

applyTheme(localStorage.getItem('theme'));
select(location.hash.slice(1));

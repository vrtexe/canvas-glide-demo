// The shell owns the image and the renderer and sends both to the framework app in the frame; see shared/README.md.
import { frameworks } from './frameworks.js';

const tabs = document.querySelector('.tabs');
const frame = document.querySelector('#frame');
const fileInput = document.querySelector('#file');
const rendererSelect = document.querySelector('#renderer');
const sourceButton = document.querySelector('#source');
const code = document.querySelector('#code');

let image = null;
let current = null;

/** A labelled grid, so panning and zooming show where you are and how sharp it stays. */
async function sampleImage() {
  const width = 3000;
  const height = 2000;
  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext('2d');
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f4efe6');
  gradient.addColorStop(1, '#dfe7ef');
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  for (let x = 0; x <= width; x += 25) {
    context.fillStyle = x % 250 === 0 ? '#5b6b7d' : '#b9c3cd';
    context.fillRect(x, 0, x % 250 === 0 ? 2 : 1, height);
  }
  for (let y = 0; y <= height; y += 25) {
    context.fillStyle = y % 250 === 0 ? '#5b6b7d' : '#b9c3cd';
    context.fillRect(0, y, width, y % 250 === 0 ? 2 : 1);
  }

  context.fillStyle = '#2f3a46';
  context.font = '500 18px "IBM Plex Mono", ui-monospace, monospace';
  for (let x = 0; x < width; x += 250) {
    for (let y = 0; y < height; y += 250) context.fillText(`${x},${y}`, x + 8, y + 24);
  }

  context.fillStyle = '#c2410c';
  context.font = '600 220px "IBM Plex Sans", system-ui, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('canvas-glide', width / 2, height / 2);
  return canvas.convertToBlob({ type: 'image/png' });
}

function send() {
  frame.contentWindow?.postMessage(
    { type: 'canvas-glide-demo', image, renderer: rendererSelect.value },
    location.origin,
  );
}

async function showSource(framework) {
  document.querySelector('#code-file').textContent = `${framework.name} · ${framework.file}`;
  const repo = document.querySelector('#code-repo');
  repo.href = framework.id === 'fiore'
    ? 'https://github.com/vrtexe/canvas-glide-fiore'
    : `https://github.com/vrtexe/canvas-glide-${framework.id}`;
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

// A new app asks for the state once it listens; that also covers a reload inside the frame.
window.addEventListener('message', (event) => {
  if (event.origin === location.origin && event.source === frame.contentWindow && event.data?.type === 'canvas-glide-demo-ready') send();
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  image = file;
  send();
});

rendererSelect.addEventListener('change', send);

sourceButton.addEventListener('click', () => {
  code.hidden = !code.hidden;
  sourceButton.setAttribute('aria-pressed', String(!code.hidden));
  if (!code.hidden) showSource(frameworks.find((entry) => entry.id === current));
});

window.addEventListener('hashchange', () => select(location.hash.slice(1)));

image = await sampleImage();
select(location.hash.slice(1));
send();

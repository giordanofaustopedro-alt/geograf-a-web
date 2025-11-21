const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

// Cerrar el menú al hacer click en un enlace (móvil)
navLinks.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// Scroll suave para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const targetId = a.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', `#${targetId}`);
    }
  });
});

// Año dinámico en el footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Inyección dinámica de videos (si existen en assets/videos)
async function loadFrontierVideos() {
  const grid = document.getElementById('videos-grid');
  if (!grid) return;
  const createCard = (src) => {
    const card = document.createElement('article');
    card.className = 'card video-card';
    const title = document.createElement('h3');
    title.textContent = src.split('/').pop();
    const video = document.createElement('video');
    video.className = 'video';
    video.controls = true;
    video.preload = 'none';
    video.poster = 'assets/frontier.svg';
    const source = document.createElement('source');
    source.src = src;
    source.type = 'video/mp4';
    video.appendChild(source);
    card.appendChild(title);
    card.appendChild(video);
    return card;
  };
  try {
    const res = await fetch('assets/videos/');
    if (!res.ok) return;
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = Array.from(doc.querySelectorAll('a'))
      .map(a => a.getAttribute('href'))
      .filter(href => href && href.toLowerCase().endsWith('.mp4'))
      .map(href => href.startsWith('assets/videos/') ? href : `assets/videos/${href}`);
    const videos = links.slice(0, 6);
    if (videos.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = 'No se encontraron videos en assets/videos/. Coloca tus archivos MP4 y recarga.';
      grid.appendChild(empty);
      return;
    }
    videos.forEach(v => grid.appendChild(createCard(v)));
  } catch (e) {
    // Si no se puede listar, dejamos una nota
    const note = document.createElement('p');
    note.textContent = 'No se pudo listar la carpeta de videos. Asegúrate de crear assets/videos/ con tus MP4.';
    grid.appendChild(note);
  }
}

loadFrontierVideos();

// Previsualización de YouTube
function getYouTubeId(url) {
  try {
    const u = new URL(url);
    // youtu.be/<id>
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.replace('/', '');
    }
    // youtube.com/watch?v=<id>
    if (u.searchParams.has('v')) {
      return u.searchParams.get('v');
    }
    // youtube.com/embed/<id>
    if (u.pathname.includes('/embed/')) {
      return u.pathname.split('/embed/')[1];
    }
  } catch (_) {}
  return null;
}

function loadYouTubeVideos() {
  const grid = document.getElementById('videos-grid');
  if (!grid) return;
  const links = [
    'https://www.youtube.com/watch?v=hKNYkGHSILM&authuser=0',
    'https://www.youtube.com/watch?v=hKNYkGHSILM&authuser=0',
    'https://www.youtube.com/watch?v=NHIEVKD0dUA&authuser=0',
    'https://www.youtube.com/watch?v=MKS5T9vGBgA&authuser=0'
  ];
  const ids = Array.from(new Set(links.map(getYouTubeId).filter(Boolean)));
  ids.forEach((id) => {
    const card = document.createElement('article');
    card.className = 'card video-card';
    const title = document.createElement('h3');
    title.textContent = 'Video de YouTube';
    const wrap = document.createElement('div');
    wrap.className = 'video-embed';
    const iframe = document.createElement('iframe');
    iframe.loading = 'lazy';
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
    iframe.title = 'Video de YouTube';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    wrap.appendChild(iframe);
    card.appendChild(title);
    card.appendChild(wrap);
    grid.appendChild(card);
  });
}

loadYouTubeVideos();

const argHotspot = document.querySelector('.arg-hotspot');
if (argHotspot) {
  argHotspot.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById('bicontinental');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
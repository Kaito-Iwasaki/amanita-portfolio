document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('copy-discord').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try { await navigator.clipboard.writeText('kinoko1241'); status.textContent = 'Discordユーザー名をコピーしました。'; }
  catch { status.textContent = 'コピーできませんでした。ユーザー名: kinoko1241'; }
});


// Project content is local data; links to repositories or demos are optional.
const projectData = Array.isArray(window.portfolioProjects) ? window.portfolioProjects : [];
const projectGrid = document.getElementById('project-grid');
const projectDialog = document.getElementById('project-modal');
const makeElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};
const projectNumber = (index) => 'PROJECT / ' + String(index + 1).padStart(2, '0');
const setProjectButton = (button, title) => {
  button.type = 'button';
  button.setAttribute('aria-label', title + 'の詳細を見る');
  button.setAttribute('aria-haspopup', 'dialog');
  button.setAttribute('aria-controls', 'project-modal');
};
let selectedProject = null;
let selectedImage = 0;
let projectOpener = null;

if (projectGrid && projectDialog) {
  projectGrid.replaceChildren();
  projectData.forEach((project, index) => {
    const card = makeElement('article', 'work-card');
    card.dataset.projectIndex = index;
    if (projectData.length > 1 && projectData.length % 2 === 1 && index === projectData.length - 1) card.classList.add('wide');
    const visual = makeElement('button', 'work-art work-open');
    setProjectButton(visual, project.title);
    visual.append(makeElement('span', 'project-no', projectNumber(index)));
    const cover = (project.screenshots || [])[0];
    if (cover) {
      const image = makeElement('img', 'project-image');
      image.src = cover.src;
      image.alt = cover.alt || project.title;
      image.loading = 'lazy';
      visual.append(image);
    }
    const arrow = makeElement('span', 'round-arrow', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    visual.append(arrow);
    const info = makeElement('div', 'work-info');
    info.append(
      makeElement('p', 'tags', (project.tags || []).join(' · ')),
      makeElement('h3', '', project.title),
      makeElement('p', '', project.summary || '')
    );
    const details = makeElement('button', 'text-link project-card-detail', '作品の詳細を見る ↗');
    setProjectButton(details, project.title);
    info.append(details);
    card.append(visual, info);
    projectGrid.append(card);
  });
  if (!projectData.length) projectGrid.append(makeElement('p', 'modal-empty', '作品を準備中です。'));

  const modalImage = document.getElementById('project-modal-image');
  const imageCaption = document.getElementById('project-modal-caption');
  const controls = document.getElementById('project-gallery-controls');
  const updateProjectImage = () => {
    const images = selectedProject.screenshots || [];
    const screenshot = images[selectedImage];
    modalImage.closest('figure').hidden = !screenshot;
    document.getElementById('project-images-empty').hidden = !!screenshot;
    controls.hidden = images.length < 2;
    if (screenshot) {
      modalImage.src = screenshot.src;
      modalImage.alt = screenshot.alt || selectedProject.title;
      imageCaption.textContent = screenshot.caption || '';
      imageCaption.hidden = !screenshot.caption;
    } else {
      modalImage.removeAttribute('src');
      modalImage.alt = '';
    }
    document.getElementById('project-image-counter').textContent = images.length ? (selectedImage + 1) + ' / ' + images.length : '';
  };
  const openProject = (index, opener) => {
    const project = projectData[index];
    if (!project) return;
    projectOpener = opener;
    selectedProject = project;
    selectedImage = 0;
    document.getElementById('project-modal-number').textContent = projectNumber(index);
    document.getElementById('project-modal-title').textContent = project.title;
    document.getElementById('project-modal-tags').textContent = (project.tags || []).join(' · ');
    document.getElementById('project-modal-summary').textContent = project.summary || '';
    const description = document.getElementById('project-modal-description');
    const paragraphs = Array.isArray(project.description) ? project.description : [project.description];
    description.replaceChildren(...paragraphs.filter(Boolean).map(text => makeElement('p', '', text)));
    if (!description.childElementCount) description.append(makeElement('p', 'modal-empty', '詳細を準備中です。'));
    const highlights = document.getElementById('project-modal-highlights');
    highlights.replaceChildren(...(project.highlights || []).map(text => makeElement('li', '', text)));
    highlights.hidden = !highlights.childElementCount;
    document.getElementById('project-highlights-empty').hidden = !!highlights.childElementCount;
    const links = document.getElementById('project-modal-links');
    links.replaceChildren();
    (project.links || []).forEach(link => {
      let url;
      try { url = new URL(link.url, window.location.href); } catch { return; }
      if (!['https:', 'http:'].includes(url.protocol)) return;
      const anchor = makeElement('a', 'text-link', link.label + ' ↗');
      anchor.href = url.href;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      links.append(anchor);
    });
    document.getElementById('project-modal-links-section').hidden = !links.childElementCount;
    updateProjectImage();
    document.body.classList.add('project-modal-open');
    projectDialog.showModal();
    projectDialog.scrollTop = 0;
  };
  projectGrid.addEventListener('click', (event) => {
    const card = event.target.closest('.work-card');
    if (!card || !projectGrid.contains(card)) return;
    const opener = event.target.closest('button') || card.querySelector('button');
    openProject(Number(card.dataset.projectIndex), opener);
  });
  document.getElementById('project-modal-close').addEventListener('click', () => projectDialog.close());
  projectDialog.addEventListener('close', () => {
    document.body.classList.remove('project-modal-open');
    if (projectOpener && projectOpener.isConnected) projectOpener.focus({ preventScroll: true });
  });
  let backdropPointerDown = false;
  const outsideDialog = (event) => {
    const bounds = projectDialog.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  };
  projectDialog.addEventListener('pointerdown', (event) => { backdropPointerDown = event.target === projectDialog && outsideDialog(event); });
  projectDialog.addEventListener('click', (event) => {
    if (backdropPointerDown && event.target === projectDialog && outsideDialog(event)) projectDialog.close();
    backdropPointerDown = false;
  });
  const changeImage = (direction) => {
    const images = selectedProject ? selectedProject.screenshots || [] : [];
    if (images.length < 2) return;
    selectedImage = (selectedImage + direction + images.length) % images.length;
    updateProjectImage();
  };
  document.getElementById('project-image-prev').addEventListener('click', () => changeImage(-1));
  document.getElementById('project-image-next').addEventListener('click', () => changeImage(1));
  projectDialog.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      const focusable = [...projectDialog.querySelectorAll('button:not([disabled]), a[href]')].filter(element => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !projectDialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      changeImage(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
}

// Reveal each block once as it enters the viewport.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && 'animate' in Element.prototype && !reducedMotion.matches) {
  const activeAnimations = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (reducedMotion.matches || entry.target.contains(document.activeElement)) return;
      const animation = entry.target.animate(
        [
          { opacity: 0, transform: 'translateY(28px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        { duration: 760, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      );
      activeAnimations.add(animation);
      const remove = () => activeAnimations.delete(animation);
      animation.onfinish = remove;
      animation.oncancel = remove;
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });

  document.querySelectorAll(
    '.hero-copy, .hero-art, .section-top, .skill-list article, .work-card, .works-foot, .contact-heading, .contact-links'
  ).forEach((element) => observer.observe(element));

  // Keep keyboard navigation and motion preferences responsive during playback.
  document.addEventListener('focusin', (event) => {
    activeAnimations.forEach((animation) => {
      if (animation.effect.target.contains(event.target)) animation.cancel();
    });
  });
  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) {
      observer.disconnect();
      activeAnimations.forEach((animation) => animation.cancel());
    }
  });
}

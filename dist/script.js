document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('copy-discord').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try { await navigator.clipboard.writeText('kinoko1241'); status.textContent = 'Discordユーザー名をコピーしました。'; }
  catch { status.textContent = 'コピーできませんでした。ユーザー名: kinoko1241'; }
});

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

// Hi?u ?ng trý?t mý?t mà cho n?i dung và h?nh ?nh
function animateSections() {
  const sections = document.querySelectorAll('.about-section');
  sections.forEach(section => {
    const content = section.querySelector('.about-content');
    const image = section.querySelector('.about-image');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          content.style.opacity = 1;
          content.style.transform = 'translateX(0)';
          image.style.opacity = 1;
          image.style.transform = 'translateX(0)';
        }
      });
    }, {threshold: 0.3});
    observer.observe(section);
  });
}
document.addEventListener('DOMContentLoaded', animateSections);
function animateTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.3 });
  items.forEach(item => observer.observe(item));
}

document.addEventListener('DOMContentLoaded', () => {
  animateSections(); // hiệu ứng about-section cũ
  animateTimeline(); // thêm hiệu ứng cho timeline-item
});

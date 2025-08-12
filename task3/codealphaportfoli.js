document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll('.section');
  const reveal = () => {
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        section.classList.add('show');
      }
    });
  };
  window.addEventListener('scroll', reveal);
  reveal();
});

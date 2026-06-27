export default {
  mounted(el, binding) {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    // Default duration and delay classes
    let duration = 'duration-700';
    let delay = '';
    
    if (binding.value && typeof binding.value === 'object') {
      if (binding.value.delay) {
        el.style.transitionDelay = `${binding.value.delay}ms`;
      }
    }

    // Add initial state classes
    el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'ease-out', duration);

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add visible state classes
          el.classList.remove('opacity-0', 'translate-y-8');
          el.classList.add('opacity-100', 'translate-y-0');
          // Stop observing once animated
          observer.unobserve(el);
        }
      });
    }, options);

    observer.observe(el);
  }
};

/**
 * Simple, accessible tooltip directive.
 * Usage: v-tooltip:[position]="'Tooltip Text'"
 * e.g., v-tooltip:top="'Hello World'"
 */
export default {
  mounted(el, binding) {
    const text = binding.value;
    if (!text) return;

    const position = binding.arg || 'top';
    let timeoutId = null;
    let tooltipEl = null;

    const createTooltip = () => {
      // Create element
      tooltipEl = document.createElement('div');
      tooltipEl.className = `fixed z-50 px-3 py-1.5 text-[13px] text-[#FFFFFF] bg-[#1A1A1A] max-w-[200px] border border-slate-750 rounded-none shadow-md pointer-events-none transition-all duration-200 opacity-0 transform translate-y-1 scale-95`;
      tooltipEl.textContent = text;
      tooltipEl.setAttribute('role', 'tooltip');
      
      // Append to body to bypass relative parents constraints
      document.body.appendChild(tooltipEl);

      // Positioning Math
      const rect = el.getBoundingClientRect();
      let left = 0;
      let top = 0;

      // Ensure relative positions
      if (position === 'top') {
        left = rect.left + rect.width / 2 - tooltipEl.offsetWidth / 2;
        top = rect.top - tooltipEl.offsetHeight - 6;
      } else if (position === 'bottom') {
        left = rect.left + rect.width / 2 - tooltipEl.offsetWidth / 2;
        top = rect.bottom + 6;
      } else if (position === 'left') {
        left = rect.left - tooltipEl.offsetWidth - 6;
        top = rect.top + rect.height / 2 - tooltipEl.offsetHeight / 2;
      } else if (position === 'right') {
        left = rect.right + 6;
        top = rect.top + rect.height / 2 - tooltipEl.offsetHeight / 2;
      }

      tooltipEl.style.left = `${Math.max(4, left)}px`;
      tooltipEl.style.top = `${Math.max(4, top)}px`;

      // Trigger animation frame show
      requestAnimationFrame(() => {
        if (tooltipEl) {
          tooltipEl.classList.remove('opacity-0', 'translate-y-1', 'scale-95');
          tooltipEl.classList.add('opacity-100', 'translate-y-0', 'scale-100');
        }
      });
    };

    const handleMouseEnter = () => {
      // Clear any pending remove timeouts
      if (timeoutId) clearTimeout(timeoutId);
      
      // Delay tooltips for B2B dashboards to avoid noise
      timeoutId = setTimeout(() => {
        createTooltip();
      }, 400);
    };

    const handleMouseLeave = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (tooltipEl) {
        const target = tooltipEl;
        tooltipEl = null;
        target.classList.add('opacity-0');
        setTimeout(() => {
          if (target.parentNode) {
            target.parentNode.removeChild(target);
          }
        }, 200);
      }
    };

    // Accessibility attributes
    el.setAttribute('aria-label', el.getAttribute('aria-label') || text);

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('click', handleMouseLeave);

    // Save callbacks for unmounting cleanup
    el._cleanupTooltip = () => {
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('click', handleMouseLeave);
      handleMouseLeave();
    };
  },
  unmounted(el) {
    if (el._cleanupTooltip) {
      el._cleanupTooltip();
    }
  }
};

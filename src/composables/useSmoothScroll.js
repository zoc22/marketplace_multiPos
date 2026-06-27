import { gsap } from 'gsap';

/**
 * Hook to scroll smoothly to a specific height or DOM Element using GSAP
 */
export function useSmoothScroll() {
  /**
   * Scroll smoothly to target height, selector, or element ref
   * @param {number|string|HTMLElement} target
   * @param {Object} options
   * @param {number} options.duration
   * @param {number} options.offset
   * @param {string} options.ease
   */
  const scrollTo = (target, options = {}) => {
    const { duration = 0.8, offset = 0, ease = 'power3.out' } = options;
    let targetY = 0;

    if (typeof target === 'number') {
      targetY = target;
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) {
        const rect = el.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        targetY = rect.top + scrollTop + offset;
      } else {
        return;
      }
    }

    const scrollObj = { y: window.pageYOffset || document.documentElement.scrollTop };
    
    gsap.to(scrollObj, {
      y: targetY,
      duration,
      ease,
      force3D: true,
      onUpdate: () => {
        window.scrollTo(0, scrollObj.y);
      },
    });
  };

  return {
    scrollTo,
  };
}

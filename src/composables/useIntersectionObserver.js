import { ref, watch } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import { gsap } from 'gsap';

/**
 * Hook to trigger GSAP animations when elements enter the viewport
 * @param {Object} options
 * @param {string} options.animationType - 'fade' | 'slide-up' | 'scale'
 * @param {number} options.duration
 * @param {number} options.delay
 * @param {number} options.threshold
 */
export function useElementVisibilityAnimation(options = {}) {
  const targetRef = ref(null);
  const hasAnimated = ref(false);

  const {
    animationType = 'slide-up',
    duration = 0.6,
    delay = 0,
    threshold = 0.1,
    rootMargin = '0px',
  } = options;

  const { stop } = useIntersectionObserver(
    targetRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting && !hasAnimated.value) {
        hasAnimated.value = true;
        
        let fromVars = { opacity: 0 };
        let toVars = {
          opacity: 1,
          duration,
          delay,
          ease: 'power2.out',
          force3D: true,
        };

        if (animationType === 'slide-up') {
          fromVars.y = 40;
          toVars.y = 0;
        } else if (animationType === 'scale') {
          fromVars.scale = 0.92;
          toVars.scale = 1;
          toVars.ease = 'back.out(1.2)';
        }

        gsap.fromTo(targetRef.value, fromVars, toVars);
        stop(); // stop observing once animated
      }
    },
    { threshold, rootMargin }
  );

  return {
    targetRef,
    hasAnimated,
  };
}
export { useIntersectionObserver };

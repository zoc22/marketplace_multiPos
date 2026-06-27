import { onMounted, nextTick } from 'vue';
import { gsap } from 'gsap';

export function useAnimation() {
  /**
   * Fade in an element or array of elements
   * @param {string|Element|Element[]} target 
   * @param {gsap.TweenVars} options 
   */
  const fadeIn = (target, options = {}) => {
    return gsap.fromTo(
      target,
      { opacity: 0, ...options.from },
      {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
        force3D: true,
        ...options,
      }
    );
  };

  /**
   * Slide up animation (ideal for modals, cards, drawers)
   * @param {string|Element|Element[]} target 
   * @param {gsap.TweenVars} options 
   */
  const slideUp = (target, options = {}) => {
    return gsap.fromTo(
      target,
      { opacity: 0, y: 30, ...options.from },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        force3D: true,
        ...options,
      }
    );
  };

  /**
   * Scale up or down animation
   * @param {string|Element|Element[]} target 
   * @param {gsap.TweenVars} options 
   */
  const scale = (target, options = {}) => {
    return gsap.fromTo(
      target,
      { opacity: 0, scale: 0.9, ...options.from },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'back.out(1.5)',
        force3D: true,
        ...options,
      }
    );
  };

  /**
   * Staggered animation for list elements
   * @param {string|Element[]} targets 
   * @param {number} staggerAmount 
   * @param {gsap.TweenVars} options 
   */
  const stagger = (targets, staggerAmount = 0.08, options = {}) => {
    return gsap.fromTo(
      targets,
      { opacity: 0, y: 15, ...options.from },
      {
        opacity: 1,
        y: 0,
        stagger: staggerAmount,
        duration: 0.4,
        ease: 'power2.out',
        force3D: true,
        ...options,
      }
    );
  };

  return {
    fadeIn,
    slideUp,
    scale,
    stagger,
  };
}

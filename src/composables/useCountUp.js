import { ref } from 'vue';
import { gsap } from 'gsap';

/**
 * Hook to count up numbers using GSAP tweens
 */
export function useCountUp() {
  const count = ref(0);

  /**
   * Start counting animation
   * @param {number} endValue - Number to count up to
   * @param {number} duration - Animation duration in seconds
   * @param {number} startValue - Starting number
   * @param {Object} options - Custom GSAP options
   */
  const startCount = (endValue, duration = 1.5, startValue = 0, options = {}) => {
    const valObj = { val: startValue };
    count.value = startValue;

    gsap.to(valObj, {
      val: endValue,
      duration,
      ease: 'power2.out',
      force3D: true,
      onUpdate: () => {
        count.value = Math.round(valObj.val);
      },
      ...options,
    });
  };

  return {
    count,
    startCount,
  };
}

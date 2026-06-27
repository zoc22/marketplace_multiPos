import { ref, onMounted, onUnmounted } from 'vue';
import { useMouseInElement } from '@vueuse/core';
import { gsap } from 'gsap';

/**
 * Creates mouse-movement-based parallax or scroll-based parallax.
 * @param {Object} options
 * @param {number} options.intensity - Parallax intensity factor
 * @param {boolean} options.useScroll - Whether to base parallax on window scroll instead of mouse
 */
export function useParallax(options = {}) {
  const targetRef = ref(null);
  const { intensity = 20, useScroll = false } = options;

  let mouseInElementObj = null;

  const handleScroll = () => {
    if (!targetRef.value) return;
    const rect = targetRef.value.getBoundingClientRect();
    const scrollPos = window.scrollY;
    // Calculate scroll percentage/offset
    const offset = (window.innerHeight - rect.top) * (intensity / 100);
    
    gsap.to(targetRef.value, {
      y: offset,
      duration: 0.1,
      overwrite: 'auto',
      ease: 'none',
    });
  };

  onMounted(() => {
    if (useScroll) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Init position
    } else {
      mouseInElementObj = useMouseInElement(targetRef);
      
      // Watch coordinates and apply movement smoothly with GSAP
      const stopWatch = watchEffect(() => {
        if (!targetRef.value || !mouseInElementObj.isOutside.value) {
          const x = mouseInElementObj.elementX.value - mouseInElementObj.elementWidth.value / 2;
          const y = mouseInElementObj.elementY.value - mouseInElementObj.elementHeight.value / 2;
          
          const moveX = (x / (mouseInElementObj.elementWidth.value / 2)) * intensity;
          const moveY = (y / (mouseInElementObj.elementHeight.value / 2)) * intensity;

          gsap.to(targetRef.value, {
            x: moveX,
            y: moveY,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        } else {
          // Reset when mouse leaves
          gsap.to(targetRef.value, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      });

      targetRef.value._stopWatchParallax = stopWatch;
    }
  });

  onUnmounted(() => {
    if (useScroll) {
      window.removeEventListener('scroll', handleScroll);
    } else if (targetRef.value && targetRef.value._stopWatchParallax) {
      targetRef.value._stopWatchParallax();
    }
  });

  return {
    targetRef,
  };
}

// Watch effect import wrapper if not globally declared
import { watchEffect } from 'vue';

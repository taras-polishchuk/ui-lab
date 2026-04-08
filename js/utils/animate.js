/**
 * Animation utilities using requestAnimationFrame
 */

/**
 * Smooth counter animation
 */
const animateCounter = (el, from, to, duration = 1200, formatter = v => v) => {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(from + (to - from) * eased);
    el.textContent = formatter(current);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
};

/**
 * Spring-based lerp for smooth following
 */
const spring = (current, target, stiffness = 0.12) => {
  return current + (target - current) * stiffness;
};

/**
 * Map a value from one range to another
 */
const mapRange = (val, inMin, inMax, outMin, outMax) => {
  return outMin + ((val - inMin) / (inMax - inMin)) * (outMax - outMin);
};

/**
 * Clamp a value between min and max
 */
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

window.UI = window.UI || {};
Object.assign(window.UI, { animateCounter, spring, mapRange, clamp });

/**
 * DOM utilities — querySelector helpers
 */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const on = (el, event, handler, options) => {
  if (!el) return;
  el.addEventListener(event, handler, options);
};

const off = (el, event, handler) => {
  if (!el) return;
  el.removeEventListener(event, handler);
};

/**
 * Delegate events to a parent element
 */
const delegate = (parent, selector, event, handler) => {
  on(parent, event, (e) => {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) {
      handler(e, target);
    }
  });
};

/**
 * Toggle class on element
 */
const toggleClass = (el, cls, force) => {
  if (!el) return;
  el.classList.toggle(cls, force);
};

/**
 * Simple debounce
 */
const debounce = (fn, delay = 200) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Create element shorthand
 */
const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'html')  node.innerHTML = v;
    else if (k === 'text')  node.textContent = v;
    else node.setAttribute(k, v);
  });
  children.forEach(child => {
    if (typeof child === 'string') node.insertAdjacentHTML('beforeend', child);
    else if (child) node.appendChild(child);
  });
  return node;
};

window.UI = window.UI || {};
Object.assign(window.UI, { $, $$, on, off, delegate, toggleClass, debounce, el });

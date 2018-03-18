(() => {
  'use strict';

  function debounce(fn, delay) {
    let timeout;
    return function(...params) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...params), delay);
    };
  }
  module.exports.debounce = debounce;

  function delayBy(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
  module.exports.delayBy = delayBy;
})();

/* Three small jobs: entrances, the held work preview, the current section in the bar. The page reads fully without this file. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Entrances: each part rises once as its section arrives, siblings 80ms apart.
  var parts = document.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    parts.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var group = Array.prototype.filter.call(e.target.parentNode.children, function (c) { return c.hasAttribute('data-reveal'); });
        e.target.style.setProperty('--d', Math.max(0, group.indexOf(e.target)) * 80 + 'ms');
        e.target.classList.add('is-in');
        seen.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    parts.forEach(function (el) { seen.observe(el); });
  }

  // Work: the project nearest the middle of the screen is current, and its picture is held on the right.
  var jobs = Array.prototype.slice.call(document.querySelectorAll('.job'));
  var held = document.querySelector('.work__preview img');
  var current = null;
  function show(job) {
    if (job === current || !held) return;
    current && current.classList.remove('is-current');
    job.classList.add('is-current');
    current = job;
    var src = job.getAttribute('data-img');
    if (held.getAttribute('src') === src) return;
    held.classList.add('is-swapping');
    setTimeout(function () {
      held.src = src;
      held.classList.toggle('is-contain', job.hasAttribute('data-contain'));
      held.classList.remove('is-swapping');
    }, reduce ? 0 : 200);
  }
  if (jobs.length) {
    show(jobs[0]);
    var mid = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) show(e.target); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    jobs.forEach(function (j) {
      mid.observe(j);
      j.addEventListener('mouseenter', function () { show(j); });
      j.addEventListener('focusin', function () { show(j); });
    });
  }

  // Checks: the questions become tabs; arrow keys move between them.
  var tablist = document.querySelector('.checks__tabs');
  if (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var pick = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab, panel = document.getElementById(t.getAttribute('aria-controls'));
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        panel.hidden = !on;
        if (on && !reduce) { panel.classList.remove('is-entering'); void panel.offsetWidth; panel.classList.add('is-entering'); }
      });
      if (focus) tab.focus();
    };
    tablist.hidden = false;
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { pick(t); });
      t.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (e.key === 'Home') { e.preventDefault(); pick(tabs[0], true); }
        else if (e.key === 'End') { e.preventDefault(); pick(tabs[tabs.length - 1], true); }
        else if (n) { e.preventDefault(); pick(tabs[(i + n + tabs.length) % tabs.length], true); }
      });
    });
    pick(tabs[0]);
  }

  // The bar marks the section being read.
  var links = Array.prototype.slice.call(document.querySelectorAll('.bar__nav a'));
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) { a.setAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id ? 'true' : 'false'); });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  links.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });
})();

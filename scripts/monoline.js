/* @ds-bundle: {"format":4,"namespace":"Monoline","components":[{"name":"Button"},{"name":"ArrowLink"},{"name":"CopyButton"},{"name":"ThemeToggle"},{"name":"NavBar"},{"name":"SegmentedControl"},{"name":"CommandPalette"},{"name":"Tooltip"},{"name":"ProjectCard"},{"name":"Tag"},{"name":"SectionHeading"},{"name":"Timeline"},{"name":"Typewriter"},{"name":"Reveal"}]} */
(function () {
  var React = window.React, h = React.createElement;
  var useState = React.useState, useEffect = React.useEffect, useRef = React.useRef,
      useLayoutEffect = React.useLayoutEffect, useCallback = React.useCallback, useId = React.useId;

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function omit(o, keys) { var r = {}; for (var k in o) if (keys.indexOf(k) < 0) r[k] = o[k]; return r; }
  function reducedMotion() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  // Pointer position as --mx/--my on the element, for the spotlight glow.
  function trackPointer(e) {
    var el = e.currentTarget, r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }

  // ---- icons: 1.5px stroke, round caps, currentColor ----
  function Icon(d, size) {
    return h('svg', { className: 'ml-ico', width: size || 16, height: size || 16, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
      h('path', { d: d, stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }));
  }
  var ARROW = 'M3 8h9.5M8.5 4l4 4-4 4';
  var ARROW_UP = 'M5 11l6-6M6 5h5v5';
  var COPY = 'M5.5 5.5V3.75c0-.69.56-1.25 1.25-1.25h5.5c.69 0 1.25.56 1.25 1.25v5.5c0 .69-.56 1.25-1.25 1.25H10.5M3.75 5.5h5.5c.69 0 1.25.56 1.25 1.25v5.5c0 .69-.56 1.25-1.25 1.25h-5.5c-.69 0-1.25-.56-1.25-1.25v-5.5c0-.69.56-1.25 1.25-1.25z';
  var CHECK = 'M3.5 8.5l3 3 6-7';
  var SEARCH = 'M7 12A5 5 0 107 2a5 5 0 000 10zM10.6 10.6L14 14';

  // ---- Button ----
  function Button(p) {
    var variant = p.variant || 'primary', size = p.size || 'md';
    var rest = omit(p, ['variant', 'size', 'arrow', 'className', 'children', 'onPointerMove']);
    var tag = p.href ? 'a' : 'button';
    if (tag === 'button' && !rest.type) rest.type = 'button';
    return h(tag, Object.assign(rest, {
      className: cx('ml-btn', 'ml-btn--' + variant, 'ml-btn--' + size, p.className),
      onPointerMove: function (e) { trackPointer(e); if (p.onPointerMove) p.onPointerMove(e); }
    }), h('span', null, p.children), p.arrow ? Icon(ARROW, 16) : null);
  }

  // ---- ArrowLink ----
  function ArrowLink(p) {
    var rest = omit(p, ['external', 'className', 'children']);
    if (p.external) { rest.target = rest.target || '_blank'; rest.rel = rest.rel || 'noopener noreferrer'; }
    return h('a', Object.assign(rest, { className: cx('ml-link', p.external && 'ml-link--ext', p.className) }),
      h('span', { className: 'ml-link__text' }, p.children), Icon(p.external ? ARROW_UP : ARROW, 14));
  }

  // ---- CopyButton ----
  function CopyButton(p) {
    var st = useState('idle'), state = st[0], setState = st[1];
    var timer = useRef(0);
    useEffect(function () { return function () { clearTimeout(timer.current); }; }, []);
    function fallback(text) {
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta); return ok;
    }
    function done(ok) {
      setState(ok ? 'copied' : 'failed'); clearTimeout(timer.current);
      timer.current = setTimeout(function () { setState('idle'); }, 1600);
      if (ok && p.onCopy) p.onCopy(p.value);
    }
    function copy() {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(p.value).then(function () { done(true); }, function () { done(fallback(p.value)); });
      else done(fallback(p.value));
    }
    var label = state === 'copied' ? (p.copiedLabel || '복사됨') : state === 'failed' ? '복사 실패' : (p.label || p.value);
    return h('button', { type: 'button', className: cx('ml-copy', 'is-' + state, p.className), onClick: copy, 'aria-label': (p.label || p.value) + ' 복사' },
      h('span', { className: 'ml-copy__icons' }, h('span', { className: 'ml-copy__i ml-copy__i--copy' }, Icon(COPY, 16)), h('span', { className: 'ml-copy__i ml-copy__i--check' }, Icon(CHECK, 16))),
      h('span', { className: 'ml-copy__label', 'aria-live': 'polite' }, label));
  }

  // ---- ThemeToggle ----
  function currentTheme() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t === 'light' || t === 'dark') return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function ThemeToggle(p) {
    var st = useState(currentTheme), theme = st[0], setTheme = st[1];
    var id = useId().replace(/:/g, '');
    var dark = theme === 'dark';
    function toggle() {
      var next = dark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next); setTheme(next);
      if (p.onChange) p.onChange(next);
    }
    var rays = [];
    for (var i = 0; i < 8; i++) {
      var a = i * Math.PI / 4;
      rays.push(h('line', { key: i, x1: 12 + Math.cos(a) * 8, y1: 12 + Math.sin(a) * 8, x2: 12 + Math.cos(a) * 10, y2: 12 + Math.sin(a) * 10 }));
    }
    return h('button', { type: 'button', className: cx('ml-theme', dark && 'is-dark', p.className), onClick: toggle, 'aria-label': dark ? '라이트 모드로 전환' : '다크 모드로 전환', 'aria-pressed': dark },
      h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', 'aria-hidden': true },
        h('mask', { id: 'm' + id }, h('rect', { x: 0, y: 0, width: 24, height: 24, fill: '#fff' }), h('circle', { className: 'ml-theme__cut', cx: 24, cy: 4, r: 6, fill: '#000' })),
        h('circle', { className: 'ml-theme__core', cx: 12, cy: 12, r: 4.5, fill: 'currentColor', mask: 'url(#m' + id + ')' }),
        h('g', { className: 'ml-theme__rays', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' }, rays)));
  }

  // ---- sliding indicator shared by NavBar and SegmentedControl ----
  function useIndicator(listRef, index) {
    var st = useState(null), box = st[0], setBox = st[1];
    var measure = useCallback(function (i) {
      var list = listRef.current; if (!list) return;
      var el = list.querySelectorAll('[data-ml-item]')[i];
      if (!el) { setBox(null); return; }
      setBox({ x: el.offsetLeft, w: el.offsetWidth });
    }, [listRef]);
    useLayoutEffect(function () {
      measure(index);
      function onResize() { measure(index); }
      window.addEventListener('resize', onResize);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(onResize);
      return function () { window.removeEventListener('resize', onResize); };
    }, [index, measure]);
    return [box, measure];
  }

  // ---- NavBar ----
  function NavBar(p) {
    var items = p.items || [];
    var active = p.activeIndex == null ? 0 : p.activeIndex;
    var listRef = useRef(null);
    var ind = useIndicator(listRef, active), box = ind[0], measure = ind[1];
    var sc = useState(false), scrolled = sc[0], setScrolled = sc[1];
    useEffect(function () {
      function onScroll() { setScrolled(window.scrollY > 8); }
      onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
      return function () { window.removeEventListener('scroll', onScroll); };
    }, []);
    return h('header', { className: cx('ml-nav', scrolled && 'is-scrolled', p.className) },
      h('a', { className: 'ml-nav__brand', href: p.brandHref || '#' }, p.brand || 'portfolio', h('b', null, '.'), h('span', { className: 'ml-caret ml-caret--thin', 'aria-hidden': true })),
      h('nav', { 'aria-label': '주요 메뉴' },
        h('ul', { className: 'ml-nav__list', ref: listRef, onMouseLeave: function () { measure(active); } },
          box ? h('li', { className: 'ml-nav__pill', 'aria-hidden': true, style: { transform: 'translateX(' + box.x + 'px)', width: box.w + 'px' } }) : null,
          items.map(function (it, i) {
            return h('li', { key: it.href || i },
              h('a', {
                className: 'ml-nav__link', href: it.href, 'data-ml-item': '', 'aria-current': i === active ? 'page' : undefined,
                onMouseEnter: function () { measure(i); }, onFocus: function () { measure(i); }, onBlur: function () { measure(active); },
                onClick: function (e) { if (p.onNavigate) p.onNavigate(i, e); }
              }, it.label));
          }))),
      h('div', { className: 'ml-nav__actions' }, p.actions));
  }

  // ---- SegmentedControl ----
  function SegmentedControl(p) {
    var opts = p.options || [];
    var controlled = p.value !== undefined;
    var st = useState(p.defaultValue !== undefined ? p.defaultValue : (opts[0] && opts[0].value)), inner = st[0], setInner = st[1];
    var value = controlled ? p.value : inner;
    var index = Math.max(0, opts.findIndex(function (o) { return o.value === value; }));
    var listRef = useRef(null);
    var box = useIndicator(listRef, index)[0];
    function select(i) {
      var v = opts[i].value; if (!controlled) setInner(v); if (p.onChange) p.onChange(v);
      var el = listRef.current && listRef.current.querySelectorAll('[data-ml-item]')[i]; if (el) el.focus();
    }
    function onKey(e) {
      var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (!d) return; e.preventDefault(); select((index + d + opts.length) % opts.length);
    }
    return h('div', { className: cx('ml-seg', p.className), role: 'radiogroup', 'aria-label': p.label, ref: listRef, onKeyDown: onKey },
      box ? h('span', { className: 'ml-seg__thumb', 'aria-hidden': true, style: { transform: 'translateX(' + box.x + 'px)', width: box.w + 'px' } }) : null,
      opts.map(function (o, i) {
        var on = i === index;
        return h('button', { key: o.value, type: 'button', role: 'radio', 'aria-checked': on, tabIndex: on ? 0 : -1, 'data-ml-item': '', className: 'ml-seg__opt', onClick: function () { select(i); } },
          o.label, o.count != null ? h('span', { className: 'ml-seg__count' }, o.count) : null);
      }));
  }

  // ---- CommandPalette ----
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  function CommandPalette(p) {
    var items = p.items || [];
    var os = useState(!!p.defaultOpen), open = os[0], setOpen = os[1];
    var qs = useState(''), q = qs[0], setQ = qs[1];
    var as = useState(0), act = as[0], setAct = as[1];
    var inputRef = useRef(null), triggerRef = useRef(null), listRef = useRef(null);
    var listId = useId();
    var shown = items.filter(function (it) {
      var s = q.trim().toLowerCase(); if (!s) return true;
      return (it.label + ' ' + (it.group || '') + ' ' + (it.keywords || '')).toLowerCase().indexOf(s) >= 0;
    });
    function close() { setOpen(false); setQ(''); setAct(0); if (triggerRef.current) triggerRef.current.focus(); }
    function run(it) { if (!it) return; if (it.onSelect) it.onSelect(); else if (it.href) window.location.href = it.href; if (p.onSelect) p.onSelect(it); close(); }
    useEffect(function () {
      if (p.hotkey === false) return;
      function onKey(e) { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(function (o) { return !o; }); } }
      window.addEventListener('keydown', onKey); return function () { window.removeEventListener('keydown', onKey); };
    }, [p.hotkey]);
    useEffect(function () { if (open && inputRef.current) inputRef.current.focus(); }, [open]);
    useEffect(function () {
      var el = listRef.current && listRef.current.querySelector('[aria-selected="true"]');
      if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
    }, [act]);
    function onKey(e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setAct(function (a) { return Math.min(a + 1, shown.length - 1); }); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setAct(function (a) { return Math.max(a - 1, 0); }); }
      else if (e.key === 'Enter') { e.preventDefault(); run(shown[act]); }
      else if (e.key === 'Escape') { e.preventDefault(); close(); }
    }
    var lastGroup = null, rows = [];
    shown.forEach(function (it, i) {
      if (it.group && it.group !== lastGroup) { rows.push(h('li', { key: 'g' + i, className: 'ml-kbar__group', role: 'presentation' }, it.group)); lastGroup = it.group; }
      rows.push(h('li', {
        key: i, id: listId + '-' + i, role: 'option', 'aria-selected': i === act, className: 'ml-kbar__item',
        onMouseMove: function () { if (act !== i) setAct(i); }, onClick: function () { run(it); }
      }, h('span', null, it.label), it.hint ? h('span', { className: 'ml-kbar__hint' }, it.hint) : null, h('span', { className: 'ml-kbar__enter', 'aria-hidden': true }, '↵')));
    });
    return h(React.Fragment, null,
      h('button', { type: 'button', ref: triggerRef, className: cx('ml-kbar-trigger', p.className), onClick: function () { setOpen(true); }, 'aria-haspopup': 'dialog' },
        Icon(SEARCH, 14), h('span', null, p.triggerLabel || '빠른 이동'), h('kbd', { className: 'ml-kbd' }, isMac ? '⌘K' : 'Ctrl K')),
      open ? h('div', { className: 'ml-kbar', onMouseDown: function (e) { if (e.target === e.currentTarget) close(); } },
        h('div', { className: 'ml-kbar__panel', role: 'dialog', 'aria-modal': true, 'aria-label': p.triggerLabel || '빠른 이동' },
          h('div', { className: 'ml-kbar__search' }, Icon(SEARCH, 16),
            h('input', {
              ref: inputRef, className: 'ml-kbar__input', placeholder: p.placeholder || '프로젝트, 섹션, 링크 검색…', value: q,
              onChange: function (e) { setQ(e.target.value); setAct(0); }, onKeyDown: onKey,
              role: 'combobox', 'aria-expanded': true, 'aria-controls': listId, 'aria-activedescendant': shown.length ? listId + '-' + act : undefined
            }),
            h('kbd', { className: 'ml-kbd' }, 'esc')),
          h('ul', { className: 'ml-kbar__list', id: listId, role: 'listbox', ref: listRef },
            rows.length ? rows : h('li', { className: 'ml-kbar__empty' }, '“' + q + '”에 맞는 항목이 없습니다.')))) : null);
  }

  // ---- Tooltip ----
  function Tooltip(p) {
    var id = useId();
    var child = React.Children.only(p.children);
    return h('span', { className: cx('ml-tip', 'ml-tip--' + (p.side || 'top'), p.className) },
      React.cloneElement(child, { 'aria-describedby': id }),
      h('span', { role: 'tooltip', id: id, className: 'ml-tip__bubble' }, p.content));
  }

  // ---- Tag ----
  function Tag(p) {
    var tone = p.tone || 'neutral';
    var cls = cx('ml-tag', 'ml-tag--' + tone, p.live && 'ml-tag--live', p.className);
    var kids = [p.live || p.dot ? h('span', { key: 'd', className: 'ml-tag__dot', 'aria-hidden': true }) : null, h('span', { key: 't' }, p.children)];
    if (p.onClick || p.selected !== undefined)
      return h('button', { type: 'button', className: cls, 'aria-pressed': !!p.selected, onClick: p.onClick }, kids);
    return h('span', { className: cls }, kids);
  }

  // ---- ProjectCard ----
  function ProjectCard(p) {
    var tag = p.href ? 'a' : 'article';
    var media = p.image ? h('img', { src: p.image, alt: p.imageAlt || '', loading: 'lazy', decoding: 'async' })
      : (p.media || h('div', { className: 'ml-card__art', 'aria-hidden': true }, h('span', null, p.index || '')));
    return h(tag, {
      className: cx('ml-card', p.className), href: p.href, onPointerMove: trackPointer,
      target: p.href && p.external ? '_blank' : undefined, rel: p.href && p.external ? 'noopener noreferrer' : undefined
    },
      h('div', { className: cx('ml-card__media', p.image && p.imageFit === 'contain' && 'ml-card__media--contain') }, media),
      h('div', { className: 'ml-card__body' },
        h('div', { className: 'ml-card__meta' }, h('span', null, p.meta), p.status ? h(Tag, { tone: p.status.tone || 'neutral', live: p.status.live }, p.status.label) : null),
        h('h3', { className: 'ml-card__title' }, h('span', null, p.title), Icon(p.external ? ARROW_UP : ARROW, 16)),
        p.summary ? h('p', { className: 'ml-card__summary' }, p.summary) : null,
        p.tags && p.tags.length ? h('div', { className: 'ml-card__tags' }, p.tags.map(function (t) { return h(Tag, { key: t }, t); })) : null));
  }

  // ---- SectionHeading ----
  function SectionHeading(p) {
    return h('div', { className: cx('ml-sh', p.className) },
      h('p', { className: 'ml-sh__eyebrow' }, p.index ? h('span', { className: 'ml-sh__index' }, p.index) : null, p.index ? ' / ' : null, p.eyebrow),
      h(p.as || 'h2', { className: 'ml-sh__title' }, p.title),
      p.description ? h('p', { className: 'ml-sh__desc' }, p.description) : null,
      p.actions ? h('div', { className: 'ml-sh__actions' }, p.actions) : null);
  }

  // ---- in-view hook shared by Reveal and Timeline ----
  function observe(el, cb, opts) {
    if (!el) return function () {};
    if (!('IntersectionObserver' in window)) { cb(true); return function () {}; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { cb(e.isIntersecting, e); }); }, opts || { rootMargin: '0px 0px -10% 0px' });
    io.observe(el); return function () { io.disconnect(); };
  }

  // ---- Reveal ----
  function Reveal(p) {
    var ref = useRef(null);
    var st = useState(false), shown = st[0], setShown = st[1];
    useEffect(function () {
      if (reducedMotion()) { setShown(true); return; }
      var stop = observe(ref.current, function (inView) { if (inView) { setShown(true); if (p.once !== false) stop(); } else if (p.once === false) setShown(false); });
      return stop;
    }, [p.once]);
    var kids = p.stagger ? React.Children.map(p.children, function (c, i) {
      return h('div', { className: 'ml-reveal__item', style: { '--ml-delay': ((p.delay || 0) + i * p.stagger) + 'ms' } }, c);
    }) : p.children;
    return h(p.as || 'div', {
      ref: ref, className: cx('ml-reveal', p.stagger && 'ml-reveal--stagger', shown && 'is-in', p.className),
      style: Object.assign({ '--ml-delay': (p.delay || 0) + 'ms', '--ml-y': (p.y == null ? 16 : p.y) + 'px' }, p.style)
    }, kids);
  }

  // ---- Timeline ----
  function Timeline(p) {
    var items = p.items || [];
    var listRef = useRef(null);
    var st = useState(function () { return items.map(function () { return false; }); }), seen = st[0], setSeen = st[1];
    var fs = useState(0), fill = fs[0], setFill = fs[1];
    useEffect(function () {
      var list = listRef.current; if (!list) return;
      var els = list.querySelectorAll('.ml-tl__item');
      if (reducedMotion() || !('IntersectionObserver' in window)) { setSeen(items.map(function () { return true; })); return; }
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          var i = +e.target.getAttribute('data-i');
          setSeen(function (s) { if (s[i]) return s; var n = s.slice(); for (var k = 0; k <= i; k++) n[k] = true; return n; });
        });
      }, { rootMargin: '0px 0px -15% 0px' });
      els.forEach(function (el) { io.observe(el); });
      return function () { io.disconnect(); };
    }, [items.length]);
    useLayoutEffect(function () {
      var list = listRef.current; if (!list) return;
      var last = seen.lastIndexOf(true);
      var el = list.querySelectorAll('.ml-tl__item')[last];
      setFill(el ? el.offsetTop + 12 : 0);
    }, [seen]);
    return h('ol', { className: cx('ml-tl', p.className), ref: listRef },
      h('li', { className: 'ml-tl__fill', 'aria-hidden': true, style: { height: fill + 'px' } }),
      items.map(function (it, i) {
        return h('li', { key: i, 'data-i': i, className: cx('ml-tl__item', seen[i] && 'is-in', it.current && 'is-current') },
          h('span', { className: 'ml-tl__dot', 'aria-hidden': true }),
          h('p', { className: 'ml-tl__period' }, it.period, it.current ? h(Tag, { tone: 'signal', live: true }, '진행 중') : null),
          h('h3', { className: 'ml-tl__title' }, it.title, it.org ? h('span', { className: 'ml-tl__org' }, ' · ' + it.org) : null),
          it.body ? h('p', { className: 'ml-tl__body' }, it.body) : null);
      }));
  }

  // ---- Typewriter ----
  function Typewriter(p) {
    var words = p.words && p.words.length ? p.words : [''];
    var st = useState({ w: 0, n: reducedMotion() ? words[0].length : 0, del: false }), s = st[0], set = st[1];
    var typeMs = p.typeSpeed || 70, holdMs = p.holdMs || 1600;
    useEffect(function () {
      if (reducedMotion() || (words.length === 1 && s.n === words[0].length)) return;
      var word = Array.from(words[s.w]), t;
      if (!s.del && s.n < word.length) t = setTimeout(function () { set({ w: s.w, n: s.n + 1, del: false }); }, typeMs);
      else if (!s.del) t = setTimeout(function () { set({ w: s.w, n: s.n, del: true }); }, holdMs);
      else if (s.n > 0) t = setTimeout(function () { set({ w: s.w, n: s.n - 1, del: true }); }, typeMs / 2);
      else t = setTimeout(function () { set({ w: (s.w + 1) % words.length, n: 0, del: false }); }, 240);
      return function () { clearTimeout(t); };
    }, [s, words.length]);
    var text = Array.from(words[s.w]).slice(0, s.n).join('');
    return h('span', { className: cx('ml-type', p.className), 'aria-label': words.join(', ') },
      h('span', { className: 'ml-type__text', 'aria-hidden': true }, text),
      h('span', { className: cx('ml-caret', !s.del && s.n < Array.from(words[s.w]).length && 'is-typing'), 'aria-hidden': true }));
  }

  var api = { Button: Button, ArrowLink: ArrowLink, CopyButton: CopyButton, ThemeToggle: ThemeToggle, NavBar: NavBar, SegmentedControl: SegmentedControl, CommandPalette: CommandPalette, Tooltip: Tooltip, ProjectCard: ProjectCard, Tag: Tag, SectionHeading: SectionHeading, Timeline: Timeline, Typewriter: Typewriter, Reveal: Reveal };
  window.Monoline = Object.assign(window.Monoline || {}, api);
})();

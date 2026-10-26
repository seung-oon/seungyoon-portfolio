/* The portfolio page, built from Monoline components (window.Monoline). Content comes from github.com/seung-oon. */
(function () {
  var M = window.Monoline, h = React.createElement;

  var GH = 'https://github.com/';
  var LINKS = { github: GH + 'seung-oon', linkedin: 'https://www.linkedin.com/in/%EC%8A%B9%EC%9C%A4-%EA%B9%80-87099041a/', mail: 'rlatmddbs02@gmail.com' };
  var nav = [{ label: '연구', href: '#research' }, { label: '프로젝트', href: '#projects' }, { label: '활동', href: '#activity' }, { label: '연락', href: '#contact' }];

  var research = [
    { index: '01', href: GH + 'seung-oon/drug-recommendation-research', meta: '독립연구 · 7개 트랙', title: '의약품 추천 모델 재현성 연구',
      summary: 'MIMIC-III / IV 기반 추천 모델을 재현하고 후보 풀 설계, 군집별 성능 격차, DDI 제약을 검증합니다. HI-DR 재현·확장으로 Jaccard 0.4550 → 0.5231.',
      tags: ['Python', 'PyTorch', 'MIMIC-III / IV'], status: { label: '진행 중', tone: 'signal', live: true },
      image: '/images/projects/drug-cluster-jaccard.webp', imageFit: 'contain',
      imageAlt: 'SafeDrug 군집별 보정 평균 Jaccard 그래프. 시드 4개와 풀링 결과로, 호흡부전·폐렴·패혈증 0.488부터 안면외상·뇌동맥류 0.554까지 군집마다 차이가 난다.' },
    { index: '02', href: GH + 'KozzilzzilE/DCC_Problem', meta: '2026.09 · 5인 팀', title: 'DCC 예선 · 119 신고 전화 AI',
      summary: '신고자 성별 분류를 단독 구현·제출해 Wav2Vec2 정확도 0.9835. 증상 다중 라벨 분류는 손실 보정으로 F1@0.5 0.5967 → 0.6599.',
      tags: ['PyTorch', 'Transformers', 'pytest'],
      image: '/images/projects/dcc-posweight.webp', imageFit: 'contain',
      imageAlt: '손실 가중(pos_weight) 비교 막대그래프. Macro F1@0.5가 Plain BCE 0.5967, power=1 0.6189, power=0.5 0.6496.' }];

  var projects = [
    { cat: 'be', index: '01', href: GH + 'KozzilzzilE/Running-Sketch-Server', meta: '2026.08 · 코스 생성 서버 전담', title: 'Runify',
      summary: '그린 도형을 강남·서초 8×8km 도보망 위 러닝 코스로 바꾸는 계산기하·그래프 탐색 파이프라인. 계단 코스가 더 높게 채점되던 결함을 실측으로 찾아 보정했습니다.',
      tags: ['Kafka', 'PostGIS', 'pgRouting', 'Spring Boot'],
      image: '/images/projects/runify-course.webp', imageFit: 'contain',
      imageAlt: 'Runify 측정 문서의 4km 코스 비교. 회색 목표 도형 위에 이전 기준(왼쪽)과 현재 기준(오른쪽)으로 생성한 코스를 겹쳤다.' },
    { cat: 'be', index: '02', href: GH + 'safe-waalk/BE', meta: '2026.07 · Team Lead · Backend', title: 'Safe-walk',
      summary: '지도 기반 안전 보행 서비스. CCTV·보안등·안심벨·범죄주의구역을 PostGIS로 설계하고 반경 기반 안전점수 API를 구현했습니다.',
      tags: ['PostGIS', 'PostgreSQL', 'Spring Boot'],
      image: '/images/projects/safewalk-radius.webp',
      imageAlt: 'Safe-walk가 적재한 서울 OSM 보행 도로망 위에 서울시청 좌표를 중심으로 안전점수 집계 반경을 그린 지도. CCTV·범죄주의구역 150m, 보안등·안심벨 100m.' },
    { cat: 'be', index: '03', href: GH + '2026-1-midtone/Backend', meta: '2026.08 · Backend', title: 'ShiftMate',
      summary: '교대근무자를 위한 생체리듬 코칭 앱. 근무표 사진을 Google Document AI OCR로 읽어 일정 초안을 자동으로 채웁니다.',
      tags: ['Document AI', 'MySQL', 'Redis'],
      image: '/images/projects/shiftmate-mascot.webp', imageFit: 'contain',
      imageAlt: 'ShiftMate 캐릭터. 확성기를 든 보라색 고양이.' },
    { cat: 'be', index: '04', href: GH + 'On-root-AI/BE', meta: '2026.05 · Backend', title: 'OnRoot AI',
      summary: 'Q-Net 공공데이터에서 시험 일정을 받아 Gemini API로 맞춤 학습 계획을 만드는 자격증 학습 플래너.',
      tags: ['Gemini API', 'Spring Data JPA', 'MySQL'],
      image: '/images/projects/onroot-mascot.webp', imageFit: 'contain',
      imageAlt: 'OnRoot AI 캐릭터. 초록 바탕 위의 새싹 캐릭터.' },
    { cat: 'game', index: '05', href: GH + 'seung-oon/NextPerson', meta: 'Unity 6 · 게임', title: 'NextPerson',
      summary: 'Papers, Please 구조에 금융 규제 판단을 적용한 은행 창구 업무 시뮬레이션 게임.',
      tags: ['Unity 6', 'C#'],
      image: '/images/projects/nextperson-case.webp',
      imageAlt: 'NextPerson 규칙을 설명하는 일러스트(게임 화면 아님). DSR 67.3%가 규제 한도 40%를 넘어 거절이 정답인 README 사례, 손님당 제한시간 25초, 사원부터 지점장까지의 직급, 불만 5건이면 권고사직.' }];

  var stack = [
    { label: 'Backend', items: ['Java', 'Spring Boot', 'MySQL', 'PostgreSQL', 'PostGIS', 'pgRouting', 'Redis', 'Kafka'] },
    { label: 'Infra', items: ['AWS', 'GCP', 'Docker', 'GitHub Actions'] },
    { label: 'AI · ML', items: ['Python', 'PyTorch', 'LangChain / RAG'] }];

  var timeline = [
    { period: '2026 — 현재', title: '의약품 추천 모델 재현성 연구', org: '독립연구', body: '7개 트랙으로 모델 재현, 군집별 공정성, DDI 제약을 검증합니다. 구현 전에 가설을 먼저 검증해 방향을 다시 잡기도 했습니다.', current: true },
    { period: '2026.09', title: 'DCC 예선', org: '5인 팀', body: 'Mission 1 신고자 성별 분류를 단독 구현·제출하고, Mission 3 제출 추론 경로와 학습 손실을 개선했습니다.' },
    { period: '2026.08', title: 'Runify · ShiftMate', org: 'Backend', body: '러닝 코스 생성 서버를 전담하고, 근무표 OCR 일정 입력을 구현했습니다.' },
    { period: '2026.07', title: 'Safe-walk', org: 'Team Lead · 경기도 공공데이터 공모전', body: '공간 데이터 설계와 안전 인프라·점수 API를 맡았습니다.' },
    { period: '2026.03 — 05', title: '멋쟁이사자처럼 14기', org: 'Backend 1팀', body: 'Spring 기반 백엔드 과제를 수행했습니다.' },
    { period: '재학 중', title: '한성대학교 컴퓨터공학부', org: '4학년' }];

  function go(hash) {
    var el = document.querySelector(hash);
    if (el) el.scrollIntoView({ block: 'start' });
    if (history.replaceState) history.replaceState(null, '', hash);
  }
  function open(url) { window.open(url, '_blank', 'noopener'); }
  function saveTheme(t) { try { localStorage.setItem('theme', t); } catch (e) {} }

  var cmd = nav.map(function (n) { return { group: '섹션', label: n.label, hint: n.href, onSelect: function () { go(n.href); } }; })
    .concat(research.concat(projects).map(function (p) { return { group: '프로젝트', label: p.title, hint: p.tags[0], keywords: p.summary, onSelect: function () { open(p.href); } }; }))
    .concat([{ group: '링크', label: 'GitHub', hint: 'seung-oon', onSelect: function () { open(LINKS.github); } },
             { group: '링크', label: 'LinkedIn', hint: '↗', onSelect: function () { open(LINKS.linkedin); } }]);

  // Which nav item is active: the last section whose top has passed the header.
  function useScrollSpy() {
    var s = React.useState(-1), active = s[0], setActive = s[1];
    React.useEffect(function () {
      function update() {
        var idx = -1;
        nav.forEach(function (n, i) {
          var el = document.querySelector(n.href);
          if (el && el.getBoundingClientRect().top <= 120) idx = i;
        });
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) idx = nav.length - 1;
        setActive(idx);
      }
      update();
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      return function () { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
    }, []);
    return active;
  }

  function card(p) { return h(M.ProjectCard, Object.assign({ key: p.index, external: true }, p)); }

  function Page() {
    var f = React.useState('all'), filter = f[0];
    var active = useScrollSpy();
    // The sections exist only after this first render, so a #section link opened from outside lands here.
    React.useEffect(function () {
      if (location.hash.length < 2) return;
      setTimeout(function () {
        try { var el = document.querySelector(decodeURIComponent(location.hash)); if (el) el.scrollIntoView({ block: 'start', behavior: 'instant' }); } catch (e) {}
      }, 0);
    }, []);
    var shown = projects.filter(function (p) { return filter === 'all' || p.cat === filter; });
    function count(c) { return projects.filter(function (p) { return p.cat === c; }).length; }
    return h('div', null,
      h(M.NavBar, { brand: 'seungyoon', brandHref: '#', items: nav, activeIndex: active,
        onNavigate: function (i, e) { e.preventDefault(); go(nav[i].href); },
        actions: h(React.Fragment, null, h(M.CommandPalette, { items: cmd }), h(M.ThemeToggle, { onChange: saveTheme })) }),
      h('main', { className: 'pp' },
        h('section', { className: 'pp-hero', id: 'top' },
          h('p', { className: 'ml-note', style: { marginBottom: 'var(--space-6)' } }, '김승윤 · 한성대학교 컴퓨터공학부 4학년'),
          h('h1', null, '검증한 것만 남기는', h('br'), h(M.Typewriter, { words: ['백엔드 개발자', '의료 AI 연구자', '공간 데이터 개발자'] }), '입니다.'),
          h('p', null, '추천 모델의 재현성과 평가를 연구하고, 공간 DB와 그래프 탐색 기반의 백엔드를 개발합니다. 반증된 가설과 남은 과제도 함께 기록합니다.'),
          h('div', { className: 'pp-row' },
            h(M.Button, { arrow: true, size: 'lg', onClick: function () { go('#projects'); } }, '프로젝트 보기'),
            h(M.Tooltip, { content: 'github.com/seung-oon' }, h(M.Button, { variant: 'secondary', size: 'lg', href: LINKS.github, target: '_blank', rel: 'noopener noreferrer' }, 'GitHub')))),
        h('section', { className: 'pp-sec', id: 'research' },
          h(M.Reveal, null, h(M.SectionHeading, { index: '01', eyebrow: 'Research', title: '연구', description: '모델을 재현하고 평가를 다시 설계합니다. 원본 데이터는 공개하지 않고 코드·보고서·집계 결과만 공개합니다.' })),
          h(M.Reveal, { stagger: 80, className: 'pp-grid pp-gap' }, research.map(card))),
        h('section', { className: 'pp-sec', id: 'projects' },
          h(M.Reveal, null, h(M.SectionHeading, { index: '02', eyebrow: 'Projects', title: '프로젝트', description: '공간 DB와 그래프 탐색 기반의 백엔드를 개발합니다.',
            actions: h(M.ArrowLink, { href: LINKS.github + '?tab=repositories', external: true }, '전체 저장소') })),
          h('div', { className: 'pp-filter' }, h(M.SegmentedControl, { label: '분야', value: filter, onChange: f[1], options: [
            { value: 'all', label: '전체', count: projects.length }, { value: 'be', label: '백엔드', count: count('be') }, { value: 'game', label: '게임', count: count('game') }] })),
          h(M.Reveal, { key: filter, stagger: 80, className: 'pp-grid' }, shown.map(card))),
        h('section', { className: 'pp-sec', id: 'activity' },
          h(M.Reveal, null, h(M.SectionHeading, { index: '03', eyebrow: 'Activity', title: '해 온 일' })),
          h(M.Timeline, { items: timeline })),
        h('section', { className: 'pp-sec', id: 'stack' },
          h(M.Reveal, null, h(M.SectionHeading, { index: '04', eyebrow: 'Tech Stack', title: '다루는 기술' })),
          h(M.Reveal, { stagger: 80, className: 'pp-stack' }, stack.map(function (s) {
            return h('div', { key: s.label, className: 'pp-stack__row' }, h('span', { className: 'ml-note' }, s.label),
              h('div', { className: 'pp-row', style: { gap: 6 } }, s.items.map(function (t) { return h(M.Tag, { key: t }, t); })));
          }))),
        h('section', { className: 'pp-sec', id: 'contact' },
          h(M.Reveal, null, h(M.SectionHeading, { index: '05', eyebrow: 'Contact', title: '연락', description: '메일, GitHub, LinkedIn 어디로든 연락할 수 있습니다.' })),
          h(M.Reveal, { stagger: 80, className: 'pp-contact' },
            h(M.CopyButton, { value: LINKS.mail }),
            h(M.ArrowLink, { href: LINKS.github, external: true }, 'GitHub'),
            h(M.ArrowLink, { href: LINKS.linkedin, external: true }, 'LinkedIn'))),
        h('footer', { className: 'pp-foot' }, '© 2026 Seungyoon Kim · Built with Monoline')));
  }

  ReactDOM.createRoot(document.getElementById('root')).render(h(Page));
})();

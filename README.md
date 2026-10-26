# seungyoon-portfolio

김승윤의 포트폴리오 사이트. Monoline 디자인 시스템으로 만든 정적 사이트로, 빌드 단계 없이 Vercel에 배포한다.

## 구조

| 경로 | 내용 |
| --- | --- |
| `index.html` | 진입점. 테마를 그리기 전에 정하고, 글꼴·스타일·스크립트를 불러온다 |
| `scripts/app.js` | 페이지 내용(연구·프로젝트·활동·기술·연락)과 조립 |
| `scripts/monoline.js` | Monoline 컴포넌트 번들 (`window.Monoline`) |
| `scripts/vendor/` | React 18.3.1 UMD (외부 CDN에 기대지 않도록 저장소에 포함) |
| `styles/tokens.css` | Monoline 토큰. `tools/sync-monoline.py`가 만든다 |
| `styles/monoline.css` | Monoline 컴포넌트 스타일 |
| `styles/site.css` | 페이지 레이아웃 |

## 내용 고치기

프로젝트·활동·기술은 `scripts/app.js` 위쪽 배열(`research`, `projects`, `timeline`, `stack`)만 고치면 된다.
요약은 "무엇을 → 어떻게 → 결과" 두 문장, 결과는 측정한 숫자로 쓴다.

## 디자인 시스템 갱신

Monoline 디자인 시스템의 `project/` 폴더를 받아 두고:

```bash
python tools/sync-monoline.py <design-system>/project
```

## 로컬 실행과 배포

```bash
python -m http.server 8000
```

```bash
vercel deploy
```

이 저장소는 Vercel 프로젝트 `seungyoon-portfolio`에 연결되어 있어 푸시하면 자동으로 배포된다.

- `main`에 푸시: 운영 배포 (https://seungyoon-portfolio.vercel.app)
- 다른 브랜치에 푸시하거나 PR을 열면: 미리보기 배포 (PR에 주소가 댓글로 달린다)

CLI로 직접 올릴 때는 `vercel deploy`가 미리보기, `vercel deploy --prod`가 운영 배포다.

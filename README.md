# seungyoon-portfolio

김승윤의 포트폴리오 사이트. 빌드 단계 없는 정적 사이트(HTML·CSS·작은 스크립트 하나)로, Vercel에 그대로 배포한다.

디자인 방향은 "고정 포스터"다. 첫 화면에서 "검증한 것만 남기는 김승윤"이 자리를 지키는 동안 측정 그림이 옆으로 지나간다.
회색 바탕(`#d9d9d6`), 검정 글자, 녹색(`#1f5c49`)은 버튼 하나에만 쓰고, 서체는 Pretendard 하나다.

## 구조

| 경로 | 내용 |
| --- | --- |
| `index.html` | 페이지 전체 내용. 스크립트 없이도 모든 내용이 보인다 |
| `styles/site.css` | 토큰(색·글자 크기 다섯 단계·여백)과 레이아웃 |
| `scripts/site.js` | 등장 효과, 작업 미리보기 교체, "확인한 것" 탭, 현재 섹션 표시 |
| `images/projects/` | 프로젝트 그림. `dcc-steps`·`safedrug-clusters`는 `tools/figures/charts.py`가 그린다 |
| `images/seoul/` | Wikimedia Commons에서 받은 한양도성 사진 두 장. 출처는 푸터에 적었다 |

## 내용 고치기

프로젝트는 `index.html`의 `<article class="job">` 하나가 한 항목이다. `data-img`는 데스크톱 오른쪽에 고정되는 그림이다.
요약은 "무엇을 → 어떻게 → 결과" 두 문장, 결과는 측정한 숫자로 쓴다.
첫 화면 그림 띠(`.reel`)와 "확인한 것"의 숫자를 바꾸면 GitHub 프로필 README(`seung-oon/seung-oon`)의 카드도 같이 고친다.

## 그래프 다시 그리기

```bash
python tools/figures/charts.py images/projects
```

`tools/figures/fonts/`에 Pretendard OTF(Regular·SemiBold·ExtraBold)가 있어야 한다. 출력은 PNG이므로 webp로 바꿔 넣는다.

## 로컬 실행과 배포

```bash
python -m http.server 8000
```

이미지·스크립트 경로가 `/`로 시작하므로 파일을 직접 열지 말고 서버로 연다.

```bash
vercel deploy
```

이 저장소는 Vercel 프로젝트 `seungyoon-portfolio`에 연결되어 있어 푸시하면 자동으로 배포된다.

- `main`에 푸시: 운영 배포 (https://seungyoon-portfolio.vercel.app)
- 다른 브랜치에 푸시하거나 PR을 열면: 미리보기 배포 (PR에 주소가 댓글로 달린다)

CLI로 직접 올릴 때는 `vercel deploy`가 미리보기, `vercel deploy --prod`가 운영 배포다.

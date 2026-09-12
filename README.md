# 이그니아 코덱스

이그니아의 세계 설정·지리·역사·롤플레잉 규칙을 탐색하는 한국어 웹 설정집이다.

## 설정 수정

세계관의 원본은 루트의 `이그니아_통합문서.md` 하나다. 이 파일을 수정하면 Vite가 다시 읽어 본문·목차·검색·미완성 기록을 갱신한다. 속성 진화와 연표 역시 원문에서 가져온다. 미정 설정과 국가명 후보는 임의로 확정하지 않는다.

`# 제1부.` ~ `# 제4부.`와 `##` 단위의 구조를 유지한다. 새로운 부를 추가하거나 세계 구조·세력 관계·턴 규칙을 바꾸면 `src/main.js`의 해당 도식도 함께 검토한다. 나라 이름은 원문에서 가져오지만 세력 관계의 의미는 도식 코드에 정의되어 있다. 메인 소개 문구는 요약이므로 설정을 크게 변경하면 함께 검토한다.

## 실행

```sh
npm ci
npm run dev
npm test
npm run build
```

## 배포

GitHub Pages를 GitHub Actions 방식으로 설정한다. `main`에 푸시하면 `.github/workflows/deploy.yml`이 테스트와 빌드를 거쳐 배포한다. 상대 경로를 사용하므로 저장소 하위 경로에서도 동작한다.

## 디자인

랜딩 페이지형 첫 화면과 한국어 본문 가독성을 중심으로 구성한다. 배경 `#F6F7FA`, 본문 `#252735`, 코발트 블루 `#3454D1`, 라일락 `#E5E0FF`, 오렌지 `#FF7947`을 사용한다. 홈 히어로만 외곽세계를 뜻하는 남보라 `#17133A` 바탕을 쓰고, 나머지 화면은 밝은 읽기 면으로 둔다. Adobe Color의 색상 탐색과 색상 조화 원칙을 참고해 직접 구성한 조합이며, 특정 트렌드 팔레트의 복제본은 아니다.

탐색은 화면 양옆 끝까지 닿는 흰색 상단 메뉴바 하나로 한다. 로고(홈), 제1~4부, 미정 항목, 원문 보기 순서이고 검색은 맨 오른쪽이다. 현재 보고 있는 부는 메뉴바 아래 가장자리의 코발트 선으로 표시한다. 메뉴바 아래에는 회색(`#9B9EA9`) 구분선을 긋고, 홈에서는 그 밑에 여백을 둔 둥근 모서리 히어로를 놓는다. 940px 이하에서는 링크를 메뉴 버튼 안으로 접는다.

## 로고

로고는 원형 인장이다. 굵은 바깥 테와 가는 안쪽 테는 모든 세계를 감싼 외곽세계, 두 테 사이의 작은 결정 8개는 기본 속성 8종이다. 가운데 결정은 세 층으로 나뉘어 위부터 천계(속이 빈 삼각형), 물질계(주황색 띠), 마계(속이 찬 삼각형)를 뜻하고, 층 사이의 틈이 외곽세계다. 주황색은 워드마크 `ignia.`의 점과 같은 색이다.

- 메뉴바 인장은 `src/main.js`의 `sealMark`가 그리는 인라인 SVG로, 글자색을 따라가서 다크 모드에서 자동으로 밝아진다.
- `public/logo.svg`는 남보라 원판 위에 올린 독립 로고 파일이다.
- `public/favicon.svg`는 작은 크기에서도 보이도록 장식 결정과 안쪽 테를 뺀 단순형이다.

## 다크 모드

처음 방문하면 기기의 라이트·다크 설정을 따르고, 메뉴바의 검색 버튼 왼쪽 버튼으로 직접 바꿀 수 있다. 직접 고른 모드는 브라우저에 `ignia-theme`으로 저장한다. 새로고침할 때 밝은 화면이 번쩍이지 않도록 `index.html`의 짧은 스크립트가 첫 화면을 그리기 전에 `<html data-theme>`을 정한다.

색은 `src/style.css` 맨 위의 변수(`--bg`, `--panel`, `--ink`, `--text`, `--muted`, `--accent-text` 등)로 관리하고, `:root[data-theme="dark"]`에서 같은 변수의 다크 값을 덮어쓴다. 새 스타일을 추가할 때는 색을 직접 적지 말고 이 변수를 쓴다. 홈 히어로는 원래 어두운 외곽세계라 두 모드에서 같은 색을 쓴다.

## 시각 자료

홈과 본문 페이지의 그림은 모두 원본 MD를 읽어 그린다. `src/content.js`가 설정을 데이터로 뽑고(`getMagicSystem` `getAttributes` `getNations` `getEras` `getTurnRules` `getGrades` `getCodexStats`), `tests/content.test.js`가 그 결과를 검사한다. MD의 제목·표·목록 형식을 바꾸면 테스트가 먼저 알려준다.

| 그림 | 파일 | 원본 위치 | 쓰는 React Bits |
| :--- | :--- | :--- | :--- |
| 히어로 제목·문장 | `src/visuals/HeroTitle.jsx` | 사이트 문구 | BlurText · DecryptedText |
| 제1~4부 타일 | `src/visuals/PartTiles.jsx` | 속성·국가·연표·턴 수치 | SpotlightCard · CountUp |
| 마력 체계 계보 | `src/visuals/MagicLineage.jsx` | 제1부 §2 | SpotlightCard |
| 속성 바퀴 | `src/visuals/AttributeWheel.jsx` | 제1부 §3 표 | 직접 제작 |
| 장비 등급 | `src/visuals/GradeLadder.jsx` | 제1부 §10 표 | 직접 제작 |
| 세력 관계도 | `src/visuals/NationMap.jsx` | 제2부 §3~5 | 직접 제작 · Topography 배경 |
| 시대 연표 | `src/visuals/EraTimeline.jsx` | 제3부 연표 | 직접 제작 |
| 한 턴 체험 | `src/visuals/TurnDemo.jsx` | 제4부 §2·§8 | Stepper |

부별 머리 배경은 제1부 Galaxy, 제2부 Topography, 제3부 Threads, 제4부 Particles이고, 세계 구조 패널에도 Galaxy를 깐다. 세력 관계도의 점 위치와 관계의 의미(숙적·팽창 위협 등)는 `NationMap.jsx` 안에 정의되어 있으므로 제2부 §5를 크게 바꾸면 함께 고친다. Stepper에는 마지막 버튼 문구를 바꾸는 `completeButtonText` 옵션을 한 줄 추가했다.

`src/islandManager.js`는 `data-island` 자리가 화면 근처에 오면 해당 컴포넌트를 불러와 붙이고, WebGL 배경은 화면에서 멀어지면 다시 뗀다. 동작 줄이기 설정에서는 애니메이션을 멈춘 채로 그린다.

## React 컴포넌트

사이트 전체는 React 없이 동작하고, React Bits 같은 React 컴포넌트는 필요한 자리에만 붙인다. 컴포넌트 원본은 `src/components/`에 그대로 두고, `src/islands.jsx`의 `mountIsland(요소, 컴포넌트, props)`로 페이지의 특정 요소 안에 띄운다. 반환값은 정리 함수이므로 페이지를 옮길 때 호출한다. React와 컴포넌트는 `import()`로 따로 불러와 첫 화면 글자가 먼저 뜨게 한다.

현재 홈 히어로 배경이 React Bits의 GradientWaves(`src/components/GradientWaves.jsx`, `ogl` 사용)다. 색과 속도는 `src/main.js`의 `mountHome`에서 조정한다. 동작 줄이기 설정에서는 속도·그레인·마우스 반응을 끄고, WebGL2가 없으면 CSS 그라디언트만 보인다. `@vitejs/plugin-react`는 현재 Vite 6과 맞는 4.x를 쓴다.

서체는 Noto Sans KR로 통일한다. 본문은 16px과 넉넉한 줄 간격을 사용한다.

홈의 히어로 아래 섹션은 히어로의 언어를 이어받는다. 큰 패널은 모두 28px 둥근 모서리이고, 버튼은 `.btn` 한 벌(`btn-light` 어두운 면의 흰 버튼, `btn-glass` 유리 버튼, `btn-solid` 밝은 면의 짙은 버튼, `btn-ghost` 테두리 버튼)을 쓴다. 현재 무대 카드는 콘셉트 아트 위에 남보라를 겹친 어두운 카드, 세계 구조는 외곽세계를 뜻하는 남보라 패널로 원문 도식처럼 외곽세계 점선 사이에 천계·물질계·마계 층을 놓는다. 섹션 제목 위의 작은 라벨은 쓰지 않는다. 설정 본문 페이지의 도식은 홈과 별개로 기존 모양을 유지한다. 장식적인 금빛·고서체·반복 카드 구성을 제거하고, 같은 탐색 구조와 검색·원문 다운로드 기능을 유지한다.

참고: https://color.adobe.com/explore · https://color.adobe.com/create/color-wheel

생성 이미지는 분위기를 표현하는 콘셉트 아트이며 확정된 지리·국가·랜드마크가 아니다. 이미지 출처 및 프롬프트는 `docs/image-generation.md`에 기록한다.

서버 저장이나 브라우저 내 편집 기능은 없다. 설정 수정은 원본 MD에서 이루어진다. 검색은 브라우저 안에서만 동작한다.

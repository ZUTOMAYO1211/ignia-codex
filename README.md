# 이그니아 코덱스

이그니아의 세계 설정·지리·역사·롤플레잉 규칙을 탐색하는 한국어 웹 설정집이다.

## 설정 수정

세계관의 원본은 루트의 `이그니아_통합문서.md` 하나다. 이 파일을 수정하면 Vite가 다시 읽어 본문·목차·검색·미완성 기록을 갱신한다. 속성 진화와 연표 역시 원문에서 가져온다. 미정 설정과 국가명 후보는 임의로 확정하지 않는다.

`# 제1부.` ~ `# 제4부.`와 `##` 단위의 구조를 유지한다. 새로운 부를 추가하거나 세계 구조·세력 관계·턴 규칙을 바꾸면 `src/main.js`의 해당 도식도 함께 검토한다. 나라 이름은 원문에서 가져오지만 세력 관계의 의미는 도식 코드에 정의되어 있다. 메인 소개 문구는 요약이므로 설정을 크게 변경하면 함께 검토한다.

원문 MD에는 HTML을 직접 쓰지 않는다. 사이트는 이 파일 하나만 marked로 그리며 별도의 HTML 정리 과정을 거치지 않는다.

AI에게 GM을 맡겨 게임을 시작할 때 쓰는 프롬프트는 원문 제4부 §8 세션 시작 절차 아래 `### 게임 시작 프롬프트`에 있다. 코드 블록을 ```prompt로 열어 두면 사이트에서 줄바꿈된 채로 보인다. 사이트는 드래그 선택을 막아 두었으므로 본문의 모든 코드 블록 오른쪽 위에 복사 버튼을 붙인다(`src/main.js`의 `.code-block`).

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

랜딩 페이지형 첫 화면과 한국어 본문 가독성을 중심으로 구성한다. 전체 디자인은 글래스모피즘이고 색은 파랑·보라·흰색·검정 계열만 쓴다. 주황 같은 따뜻한 강조색은 쓰지 않는다.

- 배경은 CSS로 그린다. `src/main.js`가 `#app` 맨 앞에 `.backdrop`을 넣고 `src/style.css`가 파랑·보라 빛 번짐, 인장의 테를 닮은 동심원, 옅은 노이즈를 겹친다. 빛 번짐은 아주 느리게 움직이고 동작 줄이기 설정에서는 멈춘다.
- 유리는 두 종류다. 읽는 면(본문·목차·표·검색 창·시각 자료 틀)은 흰 서리 유리, 세계를 보여 주는 면(홈 히어로·세계 구조·세력 관계도·부 머리)은 짙은 남보라 연기 유리다.
- 유리 색과 흐림 정도는 `src/style.css` 맨 위의 `--glass` `--glass-strong` `--glass-soft` `--glass-edge` `--smoke` `--blur` 변수로 조정한다. 강조색은 크리스털 블루 `#5B7CFF`와 파랑→보라 그라디언트 `--beam`이다.
- 흐림 효과를 지원하지 않는 브라우저와 투명도 줄이기 설정에서는 유리가 불투명한 면으로 바뀐다.
- 탐색은 화면 양옆 끝까지 닿는 흰색 상단 메뉴바 하나로 한다. 로고(홈), 제1~4부, 미정 항목, 원문 보기 순서이고 검색은 맨 오른쪽이다. 현재 보고 있는 부는 메뉴바 아래 가장자리의 선으로 표시한다. 메뉴바 아래에는 회색(`#9B9EA9`) 구분선을 긋고, 홈에서는 그 밑에 여백을 둔 둥근 모서리 히어로를 놓는다. 940px 이하에서는 링크를 메뉴 버튼 안으로 접는다.
- 큰 패널은 28px 둥근 모서리이고, 버튼은 `.btn` 한 벌(`btn-light` 어두운 면의 흰 버튼, `btn-glass` 유리 버튼, `btn-solid` 밝은 면의 짙은 버튼, `btn-ghost` 서리 유리 버튼)을 쓴다. 현재 무대 카드는 콘셉트 아트 위에 유리판을 얹어 글을 올리고, 세계 구조는 연기 유리 패널 안에서 천계·정령계·물질계·마계를 유리판 네 장으로 겹쳐 그 사이에 외곽세계 점선을 둔다. 섹션 제목 위의 작은 라벨은 쓰지 않는다.
- 서체는 Noto Sans KR로 통일한다. 본문은 16px과 넉넉한 줄 간격을 사용한다.
- 사이트에서는 글자를 드래그로 선택하거나 이미지·링크를 끌어낼 수 없다. `src/style.css`의 `user-select: none`과 `src/main.js`의 `dragstart` 차단으로 막고, 검색 입력창만 예외로 둔다.

참고: https://color.adobe.com/explore · https://color.adobe.com/create/color-wheel

## 로고

로고는 원형 인장이다. 굵은 바깥 테와 가는 안쪽 테는 모든 세계를 감싼 외곽세계, 두 테 사이의 작은 결정 8개는 기본 속성 8종이다. 가운데 결정은 네 층으로 나뉘어 위부터 천계(속이 빈 삼각형), 정령계(민트 띠), 물질계(크리스털 블루 띠), 마계(속이 찬 삼각형)를 뜻하고, 층 사이의 틈이 외곽세계다. 크리스털 블루는 워드마크 `ignia.`의 점과 같은 색이다.

- 메뉴바 인장은 `src/main.js`의 `sealMark`가 그리는 인라인 SVG로, 글자색을 따라가서 다크 모드에서 자동으로 밝아진다.
- `public/logo.svg`는 남보라 원판 위에 올린 독립 로고 파일이다.
- `public/favicon.svg`는 작은 크기에서도 보이도록 장식 결정과 안쪽 테를 뺀 단순형이다.

## 다크 모드

처음 방문하면 기기의 라이트·다크 설정을 따르고, 메뉴바의 검색 버튼 왼쪽 버튼으로 직접 바꿀 수 있다. 직접 고른 모드는 브라우저에 `ignia-theme`으로 저장한다. 새로고침할 때 밝은 화면이 번쩍이지 않도록 `index.html`의 짧은 스크립트가 첫 화면을 그리기 전에 `<html data-theme>`을 정한다.

색은 `src/style.css` 맨 위의 변수(`--bg`, `--panel`, `--ink`, `--text`, `--muted`, `--accent-text` 등)로 관리하고, `:root[data-theme="dark"]`에서 같은 변수의 다크 값을 덮어쓴다. 새 스타일을 추가할 때는 색을 직접 적지 말고 이 변수를 쓴다. 연기 유리 면은 두 모드 모두 어둡고, 라이트 모드에서는 연보라 배경을, 다크 모드에서는 검은 밤하늘 배경을 비춘다.

## 시각 자료

홈과 본문 페이지의 그림은 모두 원본 MD를 읽어 그린다. `src/content.js`가 설정을 데이터로 뽑고(`getMagicSystem` `getAttributes` `getNations` `getEras` `getTurnRules` `getFunModes` `getGrades` `getCodexStats`), `tests/content.test.js`가 그 결과를 검사한다. MD의 제목·표·목록 형식을 바꾸면 테스트가 먼저 알려준다.

| 그림 | 파일 | 원본 위치 | 쓰는 React Bits |
| :--- | :--- | :--- | :--- |
| 히어로 제목·문장 | `src/visuals/HeroTitle.jsx` | 사이트 문구 | BlurText · DecryptedText |
| 제1~4부 타일 | `src/visuals/PartTiles.jsx` | 속성·국가·연표·턴 수치 | SpotlightCard · CountUp |
| 마력 체계 계보 | `src/visuals/MagicLineage.jsx` | 제1부 §2 | SpotlightCard |
| 속성 바퀴 | `src/visuals/AttributeWheel.jsx` | 제1부 §3 표 | 직접 제작 |
| 장비 등급 | `src/visuals/GradeLadder.jsx` | 제1부 §10 표 | 직접 제작 |
| 세력 관계도 | `src/visuals/NationMap.jsx` | 제2부 §3~5 | 직접 제작 · Topography 배경 |
| 시대 연표 | `src/visuals/EraTimeline.jsx` | 제3부 연표 | 직접 제작 |
| 한 턴 체험 | `src/visuals/TurnDemo.jsx` | 제4부 §2·§9 | Stepper |
| 재미 모드 단계 | `src/visuals/FunModeGauge.jsx` | 제4부 §7 표 | 직접 제작 |

세력 관계도의 점 위치와 관계의 의미(숙적·팽창 위협 등)는 `NationMap.jsx` 안에 정의되어 있으므로 제2부 §5를 크게 바꾸면 함께 고친다.

배경 효과는 두 층이다.

- **부 머리 배경:** 제1부 Galaxy, 제2부 Topography, 제3부 Threads, 제4부 Particles다. 세계 구조 패널에도 Galaxy를 깐다. 홈 히어로는 GradientWaves다.
- **페이지 맨 뒤 배경:** 제1부는 AcidSquares 결정 복도, 제2부는 Silk 비단 주름, 제3부는 LightPillar 빛기둥, 제4부는 LetterGlitch 글자 글리치다. 홈·미정 항목·원문 보기는 기본 CSS 배경이다. 부마다 쓰는 배경은 `src/main.js`의 `partScenes`에서 정하고, `setScene`이 `.backdrop` 안에 붙여 같은 부의 챕터 사이를 옮겨도 다시 그리지 않는다. 이런 배경 위에서는 라이트 모드의 유리를 더 불투명하게 하고 유리 밖에 놓인 챕터 제목·푸터 글자를 밝게 바꾼다.

색과 속도는 모두 `src/main.js`의 `islandProps`에서 조정한다. `src/islandManager.js`는 `data-island` 자리가 화면 근처에 오면 해당 컴포넌트를 불러와 붙이고, WebGL 배경은 화면에서 멀어지면 다시 뗀다. 동작 줄이기 설정에서는 애니메이션을 멈춘 채로 그리고, WebGL2가 없으면 CSS 그라디언트만 보인다.

## React 컴포넌트

사이트 전체는 React 없이 동작하고, React Bits 컴포넌트는 필요한 자리에만 붙인다. 컴포넌트는 `src/components/`에 두고 `src/islands.jsx`의 `mountIsland(요소, 컴포넌트, props)`로 페이지의 특정 요소 안에 띄운다. 반환값은 정리 함수이므로 페이지를 옮길 때 호출한다. React와 컴포넌트는 `import()`로 따로 불러와 첫 화면 글자가 먼저 뜨게 한다. `@vitejs/plugin-react`는 현재 Vite 6과 맞는 4.x를 쓴다.

가져온 컴포넌트는 모습과 움직임을 유지한 채 사이트에 맞게 줄였다. React Bits를 새로 가져와 덮어쓸 때는 아래 변경을 다시 적용한다.

- **BlurText · CountUp · DecryptedText:** motion 없이 다시 썼다. BlurText는 같은 키프레임을 Web Animations API로, CountUp은 motion과 같은 스프링 공식을 직접 계산해서 움직인다. DecryptedText는 사이트가 쓰는 "화면에 보이면 앞에서부터 한 글자씩 풀기"만 남겼다. 그래서 motion은 한 턴 체험(Stepper)을 열 때만 불러온다.
- **Stepper:** 사이트가 버튼을 직접 그리므로 기본 단계 표시와 체크 아이콘을 뺐고 마지막 버튼 문구 `completeButtonText` 옵션을 더했다.
- **AcidSquares:** 블러 후처리·마우스 반응·그레인·라이트 모드를 뺐고 캔버스 해상도 상한 `maxDpr` 옵션을 더했다.
- **Silk:** 원본은 three.js와 @react-three/fiber를 쓰지만 화면 한 장짜리 셰이더라서 같은 셰이더와 옵션을 ogl로 옮겼다.
- **LightPillar:** 원본은 three.js를 쓰지만 같은 이유로 셰이더·품질 단계·프레임 속도 조절을 그대로 ogl로 옮겼다. 사이트는 화면 해상도의 0.65배로 그리는 `quality: "medium"`을 쓰고 마우스 조작과 라이트 모드는 뺐다. 동작 줄이기 설정에서는 한 번만 그리고 멈춘다.
- **Galaxy:** 별 색을 정하는 `starColors`(바깥 빛 두 가지)와 `coreColor`(안쪽 빛) 옵션을 더해 바이올렛 `#8F80F5`·코발트 `#5B7CFF` 별빛에 옅은 라일락 `#D9DDFF` 속을 쓴다. 캔버스는 검은 바탕에 그린 뒤 CSS `mix-blend-mode: screen`으로 패널에 겹쳐서 별빛이 패널을 어둡게 만들지 않는다.
- **Galaxy · Topography · Silk · LetterGlitch:** 쓰지 않는 라이트 모드 경로를 뺐다.

## 이미지

사이트 이미지는 WebP로 둔다. 세계 콘셉트 아트는 `public/assets/ignia-world.webp`, 속성 아이콘은 `public/assets/icons/`, 국가 문장 초안은 `public/assets/heraldry/`에 있다. 원본 PNG를 크기 그대로 WebP로 바꿨고(콘셉트 아트 품질 0.9, 아이콘·문장 0.95) 화면에서 차이가 보이지 않는 수준이다.

아이콘 시트와 문장 시트 같은 생성 원본은 사이트에 쓰지 않으므로 배포되지 않도록 `docs/assets/`에 둔다. 생성 이미지는 분위기를 표현하는 콘셉트 아트이며 확정된 지리·국가·랜드마크가 아니다. 이미지 출처와 프롬프트는 `docs/`의 각 문서에 기록한다.

서버 저장이나 브라우저 내 편집 기능은 없다. 설정 수정은 원본 MD에서 이루어진다. 검색은 브라우저 안에서만 동작한다.

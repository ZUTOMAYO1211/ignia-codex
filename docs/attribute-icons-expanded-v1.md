# 확장 속성 아이콘 v1

- 생성 도구: OpenAI 내장 `image_gen`
- 기준 이미지: `docs/assets/ignia-elements-sheet-background-v3.png`
- 생성 원본: `docs/assets/ignia-evolved-icons-v1.png`, `docs/assets/ignia-fusion-icons-v1.png`, `docs/assets/ignia-special-icons-v1.png`
- 웹용 출력: `public/assets/icons/evolved`, `public/assets/icons/fusion`, `public/assets/icons/special`

기존 기본 속성과 같은 검은 단색 문양과 속성색 배경을 사용한다. 텍스트·광원·그림자·입체 효과 없이 작은 크기에서도 구분되는 형태로 만들었다.

## 시트 구성

- 상위: 연옥, 빙설, 폭풍, 대지, 천둥, 광명, 심연
- 융합: 뇌명, 혼돈, 모래, 용암, 폭발
- 특수: 시간, 공간, 금속, 환영, 정화, 암영, 맹독, 진동, 연기, 영혼, 중력

## 생성 프롬프트 기준

Create an expanded Ignia magic icon sprite sheet using the supplied basic-element sheet as the exact family reference. Use a uniform grid of pastel rounded-square tiles with one centered flat charcoal-black symbol per named attribute. Match the reference corner radius, optical size, stroke weight and padding. Each symbol must express only its assigned evolved, fusion or special attribute. No text, labels, letters, numbers, dividers, gradients, lighting, shadows, highlights, glow, 3D, texture or watermark. Leave the final unused grid cell blank when the number of attributes does not fill the sheet.

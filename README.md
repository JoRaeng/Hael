# Hael 소설 사이트

## 폴더 구조
```
index.html          페이지 틀 (고칠 일 거의 없음)
css/style.css       디자인 — 맨 위 :root 에서 색 변경
js/data.js          ★ 세계·캐릭터·소설 편집은 여기서
js/app.js           화면 동작 (고칠 일 거의 없음)
images/             캐릭터 이미지 (3:4 세로 비율 추천)
novels/             긴 소설 .txt 파일 (UTF-8)
```

## 캐릭터 추가
`js/data.js`에서 원하는 세계의 `characters` 안에 블록을 복사해 붙여넣고 값만 바꾸세요.

## 소설 추가
캐릭터의 `novels` 안에 추가하세요. 목록 순서 = 화 순서 = 이전/다음 화 순서예요.
- 짧은 글: `content: \`본문\``
- 긴 글: `novels/` 폴더에 .txt 업로드 후 `file: "novels/hael/파일이름.txt"`

## GitHub Pages 올리기
1. 저장소에 이 폴더 안의 파일을 그대로 업로드
2. Settings → Pages → Branch를 `main` / `/ (root)`로 저장
3. 잠시 후 `https://아이디.github.io/저장소이름/` 에서 확인

※ `file:`로 불러오는 .txt는 index.html을 더블클릭해서 열면 안 보여요.
   GitHub Pages에 올리거나, 폴더에서 `python -m http.server` 실행 후 http://localhost:8000 으로 확인하세요.

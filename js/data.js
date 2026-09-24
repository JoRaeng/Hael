/* =========================================================
   Hael 소설 사이트 — 내용 편집 파일
   ---------------------------------------------------------
   이 파일만 고치면 세계 / 캐릭터 / 소설을 추가·수정할 수 있어요.

   ▸ id      : 주소에 쓰이는 이름. 영문 소문자, 숫자, 하이픈(-)만 추천
               (같은 목록 안에서 겹치면 안 돼요)
   ▸ image   : images 폴더 기준 경로. 비워두면 이름 첫 글자로 대신 표시
   ▸ 소설 본문은 두 가지 방법 중 하나로 넣어요
       1) content : 백틱(`) 사이에 본문을 바로 적기
       2) file    : novels 폴더에 .txt 파일을 올리고 경로만 적기
                    (긴 소설은 이쪽이 편해요)
     - 빈 줄 하나 = 문단 나눔
     - 줄바꿈 한 번 = 문단 안에서 줄바꿈
     - 한 줄에 *** 만 쓰면 장면 전환 표시
   ========================================================= */

const WORLDS = [

  /* ───────────── 세계 1 : 하엘 ───────────── */
  {
    id: "hael",
    name: "하엘",
    nameEn: "Hael",
    description: "신이라고 불리는 이들",
    color: "#bbdce5",            // 이 세계 페이지의 강조색

    characters: [
      {
        id: "Feroce",
        name: "Feroce_페로체",
        tagline: "음악을 좋아하는",
        image: "images/aluette.png",

        novels: [
          /*
          {
            id: "prologue",
            title: "프롤로그",
            date: "2026-09-24",   // 비워도 돼요
            summary: "목록에 보일 짧은 소개 (비워도 돼요)",
            content: `
여기에 소설 본문을 적어요.
이 줄은 같은 문단 안에서 줄만 바뀐 거예요.

빈 줄을 하나 넣으면 새 문단이 시작돼요.

***

위처럼 *** 한 줄을 넣으면 장면 전환 표시가 나와요.
`
          },
          {
            id: "chapter-1",
            title: "1화",
            date: "",
            summary: "",
            file: "novels/hael/aluette-01.txt"   // 파일에서 불러오는 예시
          }
            */
        ]
      },

      {
        id: "Veloce",
        name: "Veloce_벨로체",
        tagline: "",
        image: "",               // 비우면 첫 글자로 표시돼요
        novels: []
      }
    ]
  },

  /* ───────────── 세계 2 : 어스 ───────────── */
  {
    id: "earth",
    name: "어스",
    nameEn: "Earth",
    description: "우리와 같았다. 얼마 전까지는.",
    color: "#3a78c2",
    characters: [
      {
        id: "Leehan",
        name: "이한",
        tagline: "",
        image: "images/이한.png",
        novels: [
          {
            id: "은익_1",
            title: "은익_1",
            date: "2026-09-24",
            summary: "",
            file: "novels/us/은익_1.docx"
          }
        ]
      }
    ]
  },

  /* ───────────── 세계 3 : 나에르 ───────────── */
  {
    id: "naer",
    name: "나에르",
    nameEn: "Naer",
    description: "몬스터와 이종족이 존재하는 판타지",
    color: "#e95a1d",
    characters: [
      {
        id: "Lapix",
        name: "Lapix_라피스",
        tagline: "",
        image: "images/라피스.png",
        novels: []
      }
    ]
  },

  /* ───────────── 세계 4 : 멜티 ───────────── */
  {
    id: "melty",
    name: "멜티",
    nameEn: "Melty",
    description: "또 다른 세계. 다른 세계를 방문하는 자들.",
    color: "#8595ee",
    characters: [
      {
        id: "Nean",
        name: "Nean_네안",
        tagline: "",
        image: "",
        novels: []
      }
    ]
  }

];

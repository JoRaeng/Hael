/* =========================================================
   화면을 그리는 코드 — 보통은 고칠 필요 없어요.
   내용은 js/data.js 에서 편집하세요.

   주소 구조
     #/                          첫 페이지 (세계 선택)
     #/세계id                     캐릭터 목록
     #/세계id/캐릭터id             소설 목록
     #/세계id/캐릭터id/소설id       소설 본문
   ========================================================= */
(function () {
  "use strict";

  const app = document.getElementById("app");
  const backBtn = document.getElementById("back-btn");
  const SITE_TITLE = "Hael";

  /* ---------- 도구 ---------- */
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  const link = (...parts) => "#/" + parts.map(encodeURIComponent).join("/");

  const parsePath = () => {
    const h = location.hash.replace(/^#\/?/, "").replace(/\/+$/, "");
    return h ? h.split("/").map(decodeURIComponent) : [];
  };

  const initial = (name) => (String(name || "?").trim()[0] || "?").toUpperCase();

  function portrait(ch) {
    const missing = !ch.image;
    return `
      <span class="portrait${missing ? " missing" : ""}" data-initial="${esc(initial(ch.name))}">
        ${missing ? "" : `<img src="${esc(ch.image)}" alt="" loading="lazy"
             onerror="this.parentNode.classList.add('missing')">`}
      </span>`;
  }

  /* 장면 전환 줄인지 확인: *** (공백 섞여도 OK, 별 3개 이상) */
  const isSceneBreak = (line) => /^\s*(\*\s*){3,}$/.test(line);

  /* 텍스트 본문 → HTML
     띄어쓰기·들여쓰기·빈 줄·줄바꿈을 쓴 그대로 보존하고,
     *** 줄만 장면 전환 표시로 바꿔요. */
  function toProse(text) {
    const lines = String(text || "")
      .replace(/\r\n?/g, "\n")
      .replace(/^\uFEFF/, "")        // 메모장 BOM 제거
      .replace(/^\n+/, "")           // 맨 앞 빈 줄만 제거 (띄어쓰기는 유지)
      .replace(/\s+$/, "")           // 맨 끝 공백 제거
      .split("\n");
    if (lines.length === 1 && lines[0] === "") return "";

    const out = [];
    let chunk = [];
    const flush = () => {
      // 장면 전환 바로 앞뒤의 빈 줄은 정리 (표시 간격은 CSS가 담당)
      while (chunk.length && chunk[0].trim() === "") chunk.shift();
      while (chunk.length && chunk[chunk.length - 1].trim() === "") chunk.pop();
      if (chunk.length) out.push(`<div class="plain">${esc(chunk.join("\n"))}</div>`);
      chunk = [];
    };
    for (const line of lines) {
      if (isSceneBreak(line)) { flush(); out.push("<hr>"); }
      else chunk.push(line);
    }
    flush();
    return out.join("\n");
  }

  /* .docx → HTML (mammoth.js를 필요할 때만 불러옴) */
  const MAMMOTH_URL = "https://cdn.jsdelivr.net/npm/mammoth@1.12.3/mammoth.browser.min.js";
  let mammothLoading = null;
  function loadMammoth() {
    if (window.mammoth) return Promise.resolve(window.mammoth);
    if (!mammothLoading) {
      mammothLoading = new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = MAMMOTH_URL;
        s.onload = () => resolve(window.mammoth);
        s.onerror = () => { mammothLoading = null; reject(new Error("mammoth")); };
        document.head.appendChild(s);
      });
    }
    return mammothLoading;
  }

  async function docxToProse(arrayBuffer) {
    const mammoth = await loadMammoth();
    const result = await mammoth.convertToHtml(
      { arrayBuffer },
      {
        ignoreEmptyParagraphs: false,    // 빈 줄(빈 문단)도 그대로
        // 워드의 '첫 줄 들여쓰기'(문단 서식)는 mammoth가 버리므로 클래스로 옮겨요
        styleMap: ["p[style-name='__hael-indent'] => p.indent:fresh"],
        transformDocument: mammoth.transforms.paragraph((p) =>
          !p.styleId && p.indent && parseFloat(p.indent.firstLine) > 0
            ? { ...p, styleId: "__hael-indent", styleName: "__hael-indent" }
            : p
        ),
      }
    );
    const box = document.createElement("div");
    box.innerHTML = result.value;
    // *** 문단 → 장면 전환 표시
    box.querySelectorAll("p").forEach((p) => {
      if (isSceneBreak(p.textContent)) p.replaceWith(document.createElement("hr"));
    });
    // 이미지·링크 등은 그대로 두되, 스크립트성 속성은 제거
    box.querySelectorAll("*").forEach((el) => {
      [...el.attributes].forEach((a) => { if (/^on/i.test(a.name)) el.removeAttribute(a.name); });
    });
    return `<div class="docx">${box.innerHTML}</div>`;
  }

  function setAccent(world) {
    if (world && world.color) document.body.style.setProperty("--accent", world.color);
    else document.body.style.removeProperty("--accent");
  }

  function setTitle(...parts) {
    document.title = [...parts.filter(Boolean), SITE_TITLE].join(" | ");
  }

  /* ---------- 페이지 ---------- */
  function renderHome() {
    setAccent(null);
    setTitle();
    app.innerHTML = `
      <section class="worlds" aria-label="세계 선택">
        ${WORLDS.map((w) => `
          <a class="world" href="${link(w.id)}" style="--wc:${esc(w.color || "#4a8fe7")}">
            <span class="world-en">${esc(w.nameEn || "")}</span>
            <span class="world-name">${esc(w.name)}</span>
            ${w.description ? `<span class="world-desc">${esc(w.description)}</span>` : ""}
            <span class="world-count">캐릭터 ${(w.characters || []).length}명</span>
          </a>`).join("")}
      </section>`;
  }

  function renderWorld(w) {
    setTitle(w.name);
    const chars = w.characters || [];
    app.innerHTML = `
      <header class="page-head">
        <h1>${esc(w.name)}${w.nameEn ? `<small>${esc(w.nameEn)}</small>` : ""}</h1>
        ${w.description ? `<p>${esc(w.description)}</p>` : ""}
      </header>
      ${chars.length ? `
        <ul class="list">
          ${chars.map((c) => `
            <li>
              <a class="char" href="${link(w.id, c.id)}">
                ${portrait(c)}
                <span class="char-text">
                  <span class="char-name">${esc(c.name)}</span>
                  ${c.tagline ? `<span class="char-tag">${esc(c.tagline)}</span>` : ""}
                </span>
              </a>
            </li>`).join("")}
        </ul>`
      : `<p class="empty">아직 캐릭터가 없어요. <code>js/data.js</code>의 <code>characters</code>에 추가해 주세요.</p>`}`;
  }

  function renderCharacter(w, c) {
    setTitle(c.name, w.name);
    const novels = c.novels || [];
    app.innerHTML = `
      <header class="page-head">
        <div class="char-head">
          ${portrait(c)}
          <div>
            <h1>${esc(c.name)}<small>${esc(w.name)}</small></h1>
            ${c.tagline ? `<p>${esc(c.tagline)}</p>` : ""}
          </div>
        </div>
      </header>
      ${novels.length ? `
        <ol class="list">
          ${novels.map((n, i) => `
            <li>
              <a class="novel" href="${link(w.id, c.id, n.id)}">
                <span class="novel-no">${i + 1}</span>
                <span class="novel-text">
                  <span class="novel-title">${esc(n.title)}</span>
                  ${n.summary || n.date ? `<span class="novel-meta">${esc([n.summary, n.date].filter(Boolean).join("  ·  "))}</span>` : ""}
                </span>
              </a>
            </li>`).join("")}
        </ol>`
      : `<p class="empty">아직 올라온 소설이 없어요. <code>js/data.js</code>에서 이 캐릭터의 <code>novels</code>에 추가해 주세요.</p>`}`;
  }

  async function renderNovel(w, c, n) {
    setTitle(n.title, c.name);
    const list = c.novels || [];
    const idx = list.indexOf(n);
    const prev = list[idx - 1];
    const next = list[idx + 1];

    app.innerHTML = `
      <article class="reader">
        <header class="reader-head">
          <p class="by">${esc(w.name)} / ${esc(c.name)}</p>
          <h1>${esc(n.title)}</h1>
          ${n.date ? `<p class="date">${esc(n.date)}</p>` : ""}
        </header>
        <div class="prose" id="prose"><p style="color:var(--mist)">불러오는 중…</p></div>
        <nav class="reader-nav" aria-label="다른 화">
          ${prev ? `<a class="prev" href="${link(w.id, c.id, prev.id)}"><small>이전 화</small><span>${esc(prev.title)}</span></a>` : ""}
          ${next ? `<a class="next" href="${link(w.id, c.id, next.id)}"><small>다음 화</small><span>${esc(next.title)}</span></a>` : ""}
        </nav>
      </article>`;

    const prose = document.getElementById("prose");
    const token = location.hash;

    const fail = (msg) => {
      if (location.hash !== token) return;
      prose.innerHTML = `<p class="empty" style="padding:0">${msg}</p>`;
    };

    if (n.file) {
      const isDocx = /\.docx$/i.test(n.file);
      let res;
      try {
        res = await fetch(n.file, { cache: "no-cache" });
        if (!res.ok) throw new Error(res.status);
      } catch (e) {
        return fail(`<code>${esc(n.file)}</code> 파일을 불러오지 못했어요.
          경로와 파일 이름(대소문자 포함)을 확인해 주세요.
          내 컴퓨터에서 index.html을 바로 열면 파일 불러오기가 막혀요 —
          GitHub Pages에 올리거나 로컬 서버로 열어 확인해 주세요.`);
      }
      try {
        const html = isDocx ? await docxToProse(await res.arrayBuffer()) : toProse(await res.text());
        if (location.hash !== token) return; // 그 사이 다른 페이지로 이동함
        prose.innerHTML = html || `<p class="empty" style="padding:0">본문이 비어 있어요.</p>`;
      } catch (e) {
        return fail(isDocx
          ? `<code>${esc(n.file)}</code>를 읽지 못했어요. 워드에서 .docx 형식으로 다시 저장해 보세요. (인터넷 연결도 확인해 주세요 — .docx 변환 도구를 불러와야 해요)`
          : `<code>${esc(n.file)}</code>를 읽지 못했어요. 파일이 UTF-8로 저장됐는지 확인해 주세요.`);
      }
    } else {
      prose.innerHTML = toProse(n.content) || `<p class="empty" style="padding:0">본문이 비어 있어요.</p>`;
    }
  }

  function renderNotFound() {
    setAccent(null);
    setTitle("찾을 수 없음");
    app.innerHTML = `
      <header class="page-head">
        <h1>페이지를 찾을 수 없어요</h1>
        <p>주소가 바뀌었거나 삭제된 글일 수 있어요. 왼쪽 위 Hael을 눌러 처음으로 돌아가세요.</p>
      </header>`;
  }

  /* ---------- 라우터 ---------- */
  function route() {
    const path = parsePath();
    const [wId, cId, nId] = path;

    const world = wId ? WORLDS.find((w) => w.id === wId) : null;
    const ch = world && cId ? (world.characters || []).find((c) => c.id === cId) : null;
    const nv = ch && nId ? (ch.novels || []).find((n) => n.id === nId) : null;

    // 뒤로가기 버튼: 첫 페이지 빼고 표시, 누르면 한 단계 위로
    backBtn.hidden = path.length === 0;
    backBtn.onclick = () => {
      const parent = path.slice(0, -1);
      location.hash = parent.length ? link(...parent) : "#/";
    };

    if ((wId && !world) || (cId && !ch) || (nId && !nv) || path.length > 3) {
      renderNotFound();
    } else {
      setAccent(world);
      if (nv) renderNovel(world, ch, nv);
      else if (ch) renderCharacter(world, ch);
      else if (world) renderWorld(world);
      else renderHome();
    }

    window.scrollTo(0, 0);
    if (path.length) app.focus({ preventScroll: true });
  }

  window.addEventListener("hashchange", route);
  route();
})();
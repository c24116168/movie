# AGENTS.md — 夜幕放映室（Noir Cinema Archive）開發與擴充規範

## 1. 專案目的 (Project Purpose)
本專案為個人「經典電影影評資料庫」靜態網站，可無需建置工具直接部署於 GitHub Pages。
所有 AI 協作者在新增、修改或維護內容時，必須嚴格遵守本文件的檔案結構、視覺設計系統與資料同步規則，確保網站能以一致的品質持續擴充。

---

## 2. 技術棧與環境限制 (Tech Stack & Constraints)
- **核心技術**：純原生 HTML5、CSS3（CSS Variables）、Vanilla JavaScript（ES6+）。
- **零依賴原則**：**嚴禁**引入 React、Vue、Tailwind CSS、Node.js 或任何需要 `npm build` 編譯的框架，所有頁面必須能直接在瀏覽器與 GitHub Pages 靜態開啟。
- **路徑規範**：所有內部連結與資源引用（CSS、JS、圖片）必須使用**相對路徑**（例如 `../css/style.css`），禁止使用以 `/` 開頭的根目錄絕對路徑，以免部署至 GitHub Pages 子路徑時破圖。

---

## 3. 目錄結構與命名規則 (Directory & Naming Rules)
```text
/
├── AGENTS.md                            # 本規則檔
├── index.html                           # 首頁（電影列表、標籤篩選、搜尋）
├── css/style.css                        # 全站樣式表（新增影評時不可隨意修改全域變數）
├── js/movies-data.js                    # 首頁索引資料庫（每新增一篇影評必須同步更新）
├── js/main.js                           # 共用互動邏輯（篩選、防雷折疊、海報降級處理）
├── reviews/<movie-slug>.html            # 單篇影評獨立網頁
└── assets/posters/<movie-slug>.jpg      # 電影海報圖片（選用）
```
- **檔名規則 (`<movie-slug>`)**：一律使用電影**英文片名的小寫 `kebab-case`**（僅含小寫英文字母、數字與連字號 `-`），例如：`the-godfather.html`、`the-shining.html`。
- **圖片處理**：預設引用 `../assets/posters/<movie-slug>.jpg`，並搭配內建的劇院風 CSS/SVG 預設海報卡作為 `onerror` 備援，**禁止**貼入外部網站的防盜連圖片網址。

---

## 4. 視覺設計系統 (Design System — 暗黑劇院風)
全站採用「暗黑劇院風（Dark Cinema Theme）」，所有樣式定義於 `css/style.css`：
- **主背景色**：深邃劇院黑 `#0a0b0e` (`--bg-primary`)
- **卡片底色**：絲絨炭黑 `#13151c` (`--bg-card`)
- **強調色**：經典放映金 `#d4af37` (`--accent-gold`)、劇院絲絨紅 `#8e1c24` (`--accent-crimson`)
- **文字色系**：象牙白 `#f2efe9` (`--text-primary`)、銀灰輔助字 `#9a958c` (`--text-muted`)
- **評分徽章規範**：
  - `IMDb 分數`：金色邊框徽章
  - `爛番茄新鮮度`：深紅／番茄色徽章
  - `Metacritic 分數`：琥珀／綠框專業評分徽章

---

## 5. 單篇影評必填欄位與內容結構 (Content Schema)
每部電影必須包含以下 **9 項基本資訊**：
1. `年份` (Year)
2. `導演` (Director)
3. `主要演員` (Cast)
4. `片長` (Runtime)
5. `IMDb分數` (IMDb Score)
6. `爛番茄新鮮度` (Rotten Tomatoes)
7. `Metacritic分數` (Metacritic Score)
8. `簡介` (Synopsis — 100～180 字劇情概述，不含結局劇透)
9. `標籤分類` (Tags — 2～4 個繁體中文標籤，如 `劇情`、`犯罪`、`驚悚`、`經典`)

每篇影評內文必須包含以下 **3 個標準區塊**：
1. **無雷短評與觀影定位**：適合給尚未看過電影的讀者閱讀。
2. **有雷深度解析**：**必須**包裹在 `<div class="spoiler-box">` 中，預設遮蔽並由讀者點擊按鈕展開。
3. **經典台詞金句**：使用 `<blockquote>` 呈現代表性對白。

---

## 6. AI 新增影評標準作業程序 (Workflow for AI)
當使用者要求「新增《某電影》的影評」時，AI 必須依序完成以下 **2 個步驟**，缺一不可：

### 步驟一：建立 `reviews/<movie-slug>.html`
複製以下標準 HTML 範本建立新檔案，填入完整資訊與影評內容：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>電影中文片名 English Title｜夜幕放映室</title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="../index.html" class="brand">
        <span class="brand-icon">🎬</span>
        <span>夜幕放映室 <small>NOIR CINEMA</small></span>
      </a>
      <nav>
        <a href="../index.html" class="nav-link">← 返回片單總覽</a>
      </nav>
    </div>
  </header>

  <main class="container review-detail">
    <section class="movie-hero">
      <div class="poster-frame">
        <img src="../assets/posters/<movie-slug>.jpg" alt="電影海報" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="poster-fallback">
          <span class="poster-badge">FEATURE PRESENTATION</span>
          <h2 class="poster-fallback-en">ENGLISH TITLE</h2>
          <p class="poster-fallback-zh">中文片名</p>
          <span class="poster-fallback-dir">Dir. 導演英文名</span>
        </div>
      </div>

      <div class="movie-meta-panel">
        <div class="tag-list">
          <span class="tag">#標籤1</span>
          <span class="tag">#標籤2</span>
        </div>
        <h1 class="movie-title">電影中文片名 <span class="movie-en-title">English Title</span></h1>

        <div class="scores-row">
          <div class="score-badge imdb"><span class="score-label">IMDb</span><span class="score-value" data-empty="—">分數</span></div>
          <div class="score-badge rt"><span class="score-label">爛番茄</span><span class="score-value" data-empty="—">新鮮度</span></div>
          <div class="score-badge mc"><span class="score-label">Metacritic</span><span class="score-value" data-empty="—">分數</span></div>
        </div>

        <dl class="info-grid">
          <div><dt>年份</dt><dd>年份</dd></div>
          <div><dt>導演</dt><dd>導演姓名</dd></div>
          <div><dt>片長</dt><dd>片長</dd></div>
          <div class="full-span"><dt>主要演員</dt><dd>演員名單</dd></div>
        </dl>

        <div class="synopsis-box">
          <h3>劇情簡介</h3>
          <p>簡介內容...</p>
        </div>
      </div>
    </section>

    <article class="review-article">
      <section class="review-section">
        <h2>無雷短評</h2>
        <p>短評內容...</p>
      </section>

      <section class="review-section">
        <div class="spoiler-header">
          <h2>深度解析（含關鍵劇情劇透）</h2>
          <button type="button" class="btn-spoiler" onclick="toggleSpoiler(this)">顯示有雷解析</button>
        </div>
        <div class="spoiler-box" hidden>
          <p>有雷解析內容...</p>
        </div>
      </section>

      <section class="review-section">
        <h2>經典台詞</h2>
        <blockquote class="movie-quote">
          「台詞內容」
        </blockquote>
      </section>
    </article>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>夜幕放映室 Noir Cinema Archive — 個人經典電影影評庫</p>
    </div>
  </footer>
  <script src="../js/main.js"></script>
</body>
</html>
```

### 步驟二：同步更新 `js/movies-data.js`
在 `MOVIES_DATA` 陣列最前方新增該電影的資料物件，確保首頁列表、標籤過濾器與搜尋功能即時收錄該片：
```javascript
{
  id: "<movie-slug>",
  titleZh: "中文片名",
  titleEn: "English Title",
  directorEn: "Director English Name",
  year: "",
  director: "導演中文（英文）",
  cast: "主要演員名單",
  runtime: "",
  imdb: "",
  rottenTomatoes: "",
  metacritic: "",
  tags: ["標籤1", "標籤2"],
  synopsis: "劇情簡介...",
  reviewUrl: "reviews/<movie-slug>.html",
  poster: "assets/posters/<movie-slug>.jpg"
}
```
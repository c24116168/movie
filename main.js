document.addEventListener("DOMContentLoaded", () => {
  const gridEl = document.getElementById("moviesGrid");
  const tagFiltersEl = document.getElementById("tagFilters");
  const searchInputEl = document.getElementById("searchInput");

  // 僅在首頁執行片單渲染與篩選
  if (gridEl && typeof MOVIES_DATA !== "undefined") {
    let activeTag = "全部";
    let keyword = "";

    const allTags = ["全部", ...new Set(MOVIES_DATA.flatMap((m) => m.tags))];

    function renderTagButtons() {
      tagFiltersEl.innerHTML = allTags
        .map(
          (tag) => `
          <button type="button" class="filter-btn ${tag === activeTag ? "active" : ""}" data-tag="${tag}">
            ${tag === "全部" ? "全部電影" : `#${tag}`}
          </button>`
        )
        .join("");

      tagFiltersEl.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          activeTag = btn.dataset.tag;
          renderTagButtons();
          renderMovies();
        });
      });
    }

    function renderMovies() {
      const filtered = MOVIES_DATA.filter((movie) => {
        const matchTag = activeTag === "全部" || movie.tags.includes(activeTag);
        const q = keyword.trim().toLowerCase();
        const matchKeyword =
          !q ||
          movie.titleZh.toLowerCase().includes(q) ||
          movie.titleEn.toLowerCase().includes(q) ||
          movie.director.toLowerCase().includes(q) ||
          movie.cast.toLowerCase().includes(q);
        return matchTag && matchKeyword;
      });

      if (filtered.length === 0) {
        gridEl.innerHTML = `<p style="color: var(--text-muted); grid-column: 1 / -1; text-align: center; padding: 40px 0;">找不到符合條件的電影影評。</p>`;
        return;
      }

      gridEl.innerHTML = filtered
        .map(
          (movie) => `
          <a href="${movie.reviewUrl}" class="movie-card">
            <div class="card-poster-wrap">
              <img src="${movie.poster}" alt="${movie.titleZh}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
              <div class="poster-fallback" style="display: none;">
                <span class="poster-badge">FEATURE PRESENTATION</span>
                <div>
                  <div class="poster-fallback-en">${movie.titleEn}</div>
                  <div class="poster-fallback-zh">${movie.titleZh}</div>
                </div>
                <span class="poster-fallback-dir">Dir. ${movie.directorEn}</span>
              </div>
            </div>
            <div class="card-body">
              <div class="card-tags">
                ${movie.tags.map((t) => `<span class="tag">#${t}</span>`).join("")}
              </div>
              <h2 class="card-title">${movie.titleZh}</h2>
              <p class="card-subtitle">${movie.titleEn}${movie.year ? ` · ${movie.year}` : ""}</p>
              <p class="card-meta">導演：${movie.director}</p>
              <p class="card-synopsis">${movie.synopsis}</p>
              <div class="card-footer">
                <span>${movie.imdb ? `IMDb ${movie.imdb}` : "閱讀完整影評"}</span>
                <span>進入放映廳 →</span>
              </div>
            </div>
          </a>`
        )
        .join("");
    }

    if (searchInputEl) {
      searchInputEl.addEventListener("input", (e) => {
        keyword = e.target.value;
        renderMovies();
      });
    }

    renderTagButtons();
    renderMovies();
  }
});

// 單篇影評頁：有雷解析展開／收合
function toggleSpoiler(btn) {
  const spoilerBox = btn.closest(".review-section").querySelector(".spoiler-box");
  const isHidden = spoilerBox.hasAttribute("hidden");
  if (isHidden) {
    spoilerBox.removeAttribute("hidden");
    btn.textContent = "隱藏有雷解析";
  } else {
    spoilerBox.setAttribute("hidden", "");
    btn.textContent = "顯示有雷解析";
  }
}
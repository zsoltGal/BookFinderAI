import { analyzeWithAI } from "./ai.js";
import { searchBooks } from "./books.js";
import { searchMovies } from "./movies.js";

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchInput");
  const btn = document.getElementById("searchBtn");
  const results = document.getElementById("results");
  const loading = document.getElementById("loading");
  const themeBtn = document.getElementById("themeBtn");
  const modeRadios = document.querySelectorAll('input[name="mode"]');
  const historyList = document.getElementById("searchHistory");
  const langBtn = document.getElementById("langBtn");
  const aboutText = document.getElementById("aboutText");
  const subtitle = document.getElementById("subtitle");

  const fallbackBook = "./img/fallback_book.png";
  const fallbackMovie = "./img/fallback_movie_v2.png";

  btn.addEventListener("click", startSearch);
  input.addEventListener("keydown", e => { if (e.key === "Enter") startSearch(); });
  themeBtn.addEventListener("click", toggleTheme);

  loadHistory();
  restoreTheme();

  async function startSearch() {
    const query = input.value.trim();
    if (!query) return alert("Zadaj názov!");

    results.innerHTML = "";
    showLoading(true);
    saveToHistory(query);

    const selectedMode = document.querySelector('input[name="mode"]:checked').value;
    let type = "both";

    if (selectedMode === "auto") {
      try { type = await analyzeWithAI(query); }
      catch { type = "both"; }
    } else if (selectedMode === "books") type = "book";
    else if (selectedMode === "movies") type = "movie";

    showLoading(false);

    if (type === "book") searchBooks(query, results, fallbackBook);
    else if (type === "movie") searchMovies(query, results, fallbackMovie);
    else {
      searchBooks(query, results, fallbackBook);
      searchMovies(query, results, fallbackMovie);
    }
  }

  function saveToHistory(term) {
    let history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    history.unshift(term);
    history = [...new Set(history)].slice(0, 5);
    localStorage.setItem("searchHistory", JSON.stringify(history));
    loadHistory();
  }

  function loadHistory() {
    const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    historyList.innerHTML = "";
    if (history.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Žiadne záznamy";
      li.style.opacity = "0.6";
      historyList.appendChild(li);
      return;
    }
    history.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      li.addEventListener("click", () => {
        input.value = item;
        startSearch();
      });
      historyList.appendChild(li);
    });
  }

  function showLoading(show) {
    loading.style.display = show ? "block" : "none";
  }

  // --- Dark mode toggle ---
  function toggleTheme() {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeBtn.textContent = isDark ? "☀️" : "🌙";
  }

  function restoreTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
      themeBtn.textContent = "☀️";
    } else themeBtn.textContent = "🌙";
  }

  // --- Language switching ---
  const texts = {
    sk: {
      subtitle: "Vyhľadaj knihy alebo filmy pomocou umelej inteligencie",
      about: "Smart Finder AI+ využíva umelú inteligenciu na rozoznanie, či hľadáš knihu alebo film. Následne vyhľadá informácie z Google Books a filmy z Netflixu.",
      button: "🇬🇧 English"
    },
    en: {
      subtitle: "Search for books or movies using artificial intelligence",
      about: "Smart Finder AI+ uses AI to detect whether you’re searching for a book or a movie. It then finds info from Google Books and suggests films from Netflix.",
      button: "🇸🇰 Slovensky"
    }
  };

  let currentLang = localStorage.getItem("lang") || "sk";
  applyLang(currentLang);

  langBtn.addEventListener("click", () => {
    currentLang = currentLang === "sk" ? "en" : "sk";
    applyLang(currentLang);
    localStorage.setItem("lang", currentLang);
  });

  function applyLang(lang) {
    subtitle.textContent = texts[lang].subtitle;
    aboutText.textContent = texts[lang].about;
    langBtn.textContent = texts[lang].button;
  }
});




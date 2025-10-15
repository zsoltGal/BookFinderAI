import { encodeQuery, safeLink, createEl, imgWithFallback, forceHttps } from "./utils.js";

export function searchBooks(query, results, fallbackBook) {
  fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeQuery(query)}`)
    .then(res => res.json())
    .then(data => {
      if (!data.items || data.items.length === 0) {
        results.append(createEl("p", "", "❌ Žiadne knihy sa nenašli."));
        return;
      }

      data.items.slice(0, 6).forEach(item => {
        const info = item.volumeInfo || {};
        const title = info.title || "Neznámy názov";
        const authors = Array.isArray(info.authors) ? info.authors.join(", ") : "Neznámy autor";

        // preferuj väčší obrázok; Google niekedy dá len http → zmeníme na https
        let rawImg =
          (info.imageLinks && (info.imageLinks.thumbnail || info.imageLinks.smallThumbnail)) ||
          null;

        const imgUrl = rawImg ? forceHttps(rawImg) : null;

        const link = safeLink(
          info.previewLink || `https://www.google.com/search?q=${encodeQuery(title)}+book`
        );

        // karta
        const card = createEl("div", "card");

        // obrazok
        const imageEl = imgWithFallback(imgUrl, fallbackBook, "cover");

        // obsah
        const content = createEl("div", "card-content");
        const h3 = createEl("h3", "", title);
        const p = createEl("p", "", authors);
        content.append(h3, p);

        // linky (dole)
        const links = createEl("div", "card-links");
        const a = createEl("a", "", "📖 Kniha");
        a.href = link;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        links.append(a);

        // skladanie
        card.append(imageEl, content, links);
        results.append(card);

      });
    })
    .catch(() => {
      results.append(createEl("p", "", "⚠️ Chyba pri načítaní kníh."));
    });
}


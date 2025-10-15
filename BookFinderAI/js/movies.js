import { encodeQuery, safeLink, createEl, imgWithFallback } from "./utils.js";

export function searchMovies(query, results, fallbackMovie) {
  const imageUrl = `https://source.unsplash.com/600x400/?movie,${encodeQuery(query)}`;
  const netflixLink = safeLink(`https://www.google.com/search?q=site:netflix.com+${encodeQuery(query)}`);
  const imdbLink = safeLink(`https://www.google.com/search?q=site:imdb.com+${encodeQuery(query)}`);

  const card = createEl("div", "card");
  const image = imgWithFallback(imageUrl, fallbackMovie, "movie poster");

  const content = createEl("div", "card-content");
  const h3 = createEl("h3", "", query);
  const p = createEl("p", "", "AI určila ako film.");
  content.append(h3, p);

  const links = createEl("div", "card-links");
  const a1 = createEl("a", "", "🎬 Netflix");
  a1.href = netflixLink; a1.target = "_blank"; a1.rel = "noopener noreferrer";

  const a2 = createEl("a", "", "IMDb");
  a2.href = imdbLink; a2.target = "_blank"; a2.rel = "noopener noreferrer";
  a2.style.background = "#f5c518"; a2.style.color = "black";

  links.append(a1, a2);

  card.append(image, content, links);
  results.append(card);

}



export async function analyzeWithAI(query) {
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-mnli", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inputs: query,
        parameters: { candidate_labels: ["book", "movie", "both"] }
      })
    });

    const data = await response.json();
    console.log("AI:", data);

    return data?.labels ? data.labels[0] : "both";
  } catch (err) {
    console.warn("AI error:", err);
    return "both";
  }
}

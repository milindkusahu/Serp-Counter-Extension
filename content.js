function analyzeSERP() {
  // Create metrics display container
  const metricsDiv = document.createElement("div");
  metricsDiv.className = "serp-metrics";

  // Get all search results
  const organicResults = document.querySelectorAll("#search div.g");
  const ads = document.querySelectorAll(
    "div.commercial-unit-desktop-top, div[data-text-ad]"
  );
  const featuredSnippet = document.querySelector("div.xpdopen");
  const peopleAlsoAsk = document.querySelectorAll("div.related-question-pair");

  // Create metrics display
  const metrics = `
    <h3>SERP Metrics</h3>
    <div class="metric">Organic Results: ${organicResults.length}</div>
    <div class="metric">Ads: ${ads.length}</div>
    <div class="metric">Featured Snippet: ${
      featuredSnippet ? "Yes" : "No"
    }</div>
    <div class="metric">People Also Ask: ${peopleAlsoAsk.length}</div>
  `;

  metricsDiv.innerHTML = metrics;
  document.body.appendChild(metricsDiv);

  // Add position numbers to organic results
  organicResults.forEach((result, index) => {
    const position = document.createElement("div");
    position.style.cssText =
      "position:absolute;left:-30px;color:#666;font-size:14px;";
    position.textContent = `#${index + 1}`;
    result.style.position = "relative";
    result.insertBefore(position, result.firstChild);
  });
}

// Wait for page to load then run analysis
window.addEventListener("load", analyzeSERP);

// Re-run analysis when SERP updates dynamically
const observer = new MutationObserver(() => {
  // Remove existing metrics
  const oldMetrics = document.querySelector(".serp-metrics");
  if (oldMetrics) oldMetrics.remove();

  // Re-analyze SERP
  analyzeSERP();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

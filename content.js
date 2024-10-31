class SERPCounter {
  constructor() {
    this.metricsDiv = null;
    this.debug = true; // Set to true for console logging
  }

  log(message) {
    if (this.debug) {
      console.log(`[SERP Counter] ${message}`);
    }
  }

  getGoogleResults() {
    try {
      // Try multiple possible selectors for Google results
      const selectors = [
        "#search div.g",
        "#rso div.g",
        "div[data-sokoban-container]",
        '[data-header-feature="0"]',
      ];

      for (const selector of selectors) {
        const results = document.querySelectorAll(selector);
        if (results.length > 0) {
          this.log(
            `Found ${results.length} results using selector: ${selector}`
          );
          return results;
        }
      }

      this.log("No results found with any selector");
      return [];
    } catch (error) {
      this.log(`Error getting Google results: ${error.message}`);
      return [];
    }
  }

  getMetrics() {
    const currentURL = window.location.href;
    let metrics = "<h3>SERP Metrics</h3>";

    try {
      if (currentURL.includes("google.")) {
        const organicResults = this.getGoogleResults();
        const ads = document.querySelectorAll(
          ".commercial-unit-desktop-top, .ad_cclk, [data-text-ad]"
        );
        const featuredSnippet = document.querySelector(
          ".xpdopen, .featured-snippet, .answer-box"
        );
        const peopleAlsoAsk = document.querySelectorAll(
          ".related-question-pair, .g-blk"
        );

        metrics += `
          <div class="metric">
            <span>Organic Results</span>
            <span class="metric-value">${organicResults.length}</span>
          </div>
          <div class="metric">
            <span>Ads</span>
            <span class="metric-value">${ads.length}</span>
          </div>
          <div class="metric">
            <span>Featured Snippet</span>
            <span class="metric-value">${featuredSnippet ? "Yes" : "No"}</span>
          </div>
          <div class="metric">
            <span>People Also Ask</span>
            <span class="metric-value">${peopleAlsoAsk.length}</span>
          </div>
        `;
      }
      // Add LinkedIn and Twitter metrics here...
    } catch (error) {
      this.log(`Error generating metrics: ${error.message}`);
      metrics += `<div class="metric">Error: Could not analyze page</div>`;
    }

    metrics += `
      <div class="developer-info">
        Developed by Milind Sahu
        <a href="https://x.com/milindkusahu" target="_blank">Twitter: @milindkusahu</a>
        <a href="https://www.linkedin.com/in/milindsahu/" target="_blank">LinkedIn: Milind Sahu</a>
      </div>
    `;

    return metrics;
  }

  createMetricsDiv() {
    try {
      // Remove existing metrics if any
      this.removeMetrics();

      // Create new metrics div
      this.metricsDiv = document.createElement("div");
      this.metricsDiv.className = "serp-metrics";
      this.metricsDiv.innerHTML = this.getMetrics();
      document.body.appendChild(this.metricsDiv);

      this.log("Metrics div created and added to page");
    } catch (error) {
      this.log(`Error creating metrics div: ${error.message}`);
    }
  }

  removeMetrics() {
    const existing = document.querySelector(".serp-metrics");
    if (existing) {
      existing.remove();
      this.log("Removed existing metrics div");
    }
  }

  init() {
    this.log("Initializing SERP Counter");

    // Initial creation
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.createMetricsDiv()
      );
    } else {
      this.createMetricsDiv();
    }

    // Monitor for AJAX updates
    const observer = new MutationObserver(() => {
      this.log("Page content changed, updating metrics");
      this.createMetricsDiv();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    this.log("Initialization complete");
  }
}

// Start the extension
const serpCounter = new SERPCounter();
serpCounter.init();

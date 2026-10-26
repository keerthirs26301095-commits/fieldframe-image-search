// Part 1: UI scaffold only. Search behaviour will be added in Part 2.
const form = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsGrid = document.getElementById("resultsGrid");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");

// Add a status message for loading and errors.
let statusMessage = document.getElementById("statusMessage");

if (!statusMessage) {
  statusMessage = document.createElement("p");
  statusMessage.id = "statusMessage";
  statusMessage.setAttribute("role", "status");
  statusMessage.setAttribute("aria-live", "polite");
  statusMessage.style.textAlign = "center";
  statusMessage.style.padding = "16px";
  const resultsSection = document.querySelector(".results-section");
  resultsSection.prepend(statusMessage);
}

// IMPORTANT: Replace this with your own Unsplash API access key.
const ACCESS_KEY = "YOUR_UNSPLASH_ACCESS_KEY";

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {
    statusMessage.textContent = "Please enter a word to search.";
    resultsGrid.replaceChildren();
    resultCount.textContent = "";
    emptyState.hidden = true;
    return;
  }

  // Loading state appears before fetch.
  statusMessage.textContent = "Searching for images…";
  resultsGrid.replaceChildren();
  resultCount.textContent = "";
  emptyState.hidden = true;
  searchButton.disabled = true;

  try {
    const url =
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&client_id=${ACCESS_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    const images = data.results || [];

    statusMessage.textContent = "";

    if (images.length === 0) {
      emptyState.hidden = false;
      resultCount.textContent = `No images found for "${query}".`;
      return;
    }

    emptyState.hidden = true;
    resultCount.textContent =
      `Showing ${images.length} results for "${query}"`;

    images.forEach((image) => {
      const card = document.createElement("article");
      card.className = "image-card";
      card.style.animation = "fadeIn 0.4s ease both";

      const img = document.createElement("img");
      img.src = image.urls.small;
      img.alt = image.alt_description || `Image of ${query}`;
      img.loading = "lazy";

      const caption = document.createElement("p");
      caption.textContent =
        image.alt_description || `Image of ${query}`;

      card.append(img, caption);
      resultsGrid.appendChild(card);
    });
  } catch (error) {
    console.error("Image search failed:", error);
    statusMessage.textContent =
      "Something went wrong. Please check your connection and try again.";
    resultCount.textContent = "";
    emptyState.hidden = true;
    resultsGrid.replaceChildren();
  } finally {
    searchButton.disabled = false;
  }
});

// Make suggested topic buttons fill the search box.
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    searchInput.value = chip.textContent.trim();
    form.requestSubmit();
  });
});


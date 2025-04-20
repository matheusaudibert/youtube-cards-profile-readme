// Interface element references
const videoIdInput = document.getElementById("youtube_id");
const backgroundColorInput = document.getElementById("background_color");
const borderRadiusInput = document.getElementById("border_radius");
const titleColorInput = document.getElementById("title_color");
const statsColorInput = document.getElementById("stats_color");
const themeSelect = document.getElementById("theme");
const maxTitleLinesInput = document.getElementById("max_title_lines");
const cardWidthInput = document.getElementById("card_width");
const showDurationCheckbox = document.getElementById("show_duration");
const previewArea = document.querySelector(".preview");
const codeOutput = document.getElementById("code-output");
const copyButton = document.getElementById("copy-button");
const tabButtons = document.querySelectorAll(".tab-button");

let currentFormat = "markdown";
let currentVideoId = "";

function extractYouTubeId(input) {
  if (!input) return "";

  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }

  const regularMatch = input.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  if (regularMatch) return regularMatch[1];

  return "";
}

function generateCardUrl(videoId) {
  if (!videoId) return "";

  const params = new URLSearchParams();

  params.append("width", cardWidthInput.value.replace("px", "") || "250");
  params.append("theme", themeSelect.value);

  if (backgroundColorInput.value) {
    params.append(
      "background_color",
      backgroundColorInput.value.replace("#", "")
    );
  }

  if (titleColorInput.value) {
    params.append("title_color", titleColorInput.value.replace("#", ""));
  }

  if (statsColorInput.value) {
    params.append("stats_color", statsColorInput.value.replace("#", ""));
  }

  const borderRadius = borderRadiusInput.value.replace("px", "");
  if (borderRadius) {
    params.append("border_radius", borderRadius);
  }

  params.append("max_title_lines", maxTitleLinesInput.value || "1");
  params.append("show_duration", showDurationCheckbox.checked);

  const url = `https://youtube-cards-0wtu.onrender.com/api/${videoId}?${params.toString()}`;
  console.log("Generated Card URL:", url); // Log the generated URL for debugging
  return url;
}

function updateCardPreview() {
  const inputValue = videoIdInput.value.trim();

  if (!inputValue) {
    previewArea.innerHTML = `<div class="preview-message">Enter a Youtube video link or ID to preview your card</div>`;
    previewArea.classList.remove("card-loaded");
    previewArea.classList.remove("error-loading");
    return;
  }

  const videoId = extractYouTubeId(inputValue);

  if (!videoId) {
    previewArea.innerHTML = `<div class="preview-message">Invalid YouTube video ID or URL</div>`;
    previewArea.classList.remove("card-loaded");
    previewArea.classList.add("error-loading");
    return;
  }

  currentVideoId = videoId;
  const cardUrl = generateCardUrl(videoId);

  previewArea.innerHTML = `<div class="preview-message">Loading preview...</div>`;
  previewArea.classList.remove("card-loaded");
  previewArea.classList.remove("error-loading");

  const iframe = document.createElement("iframe");
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.style.borderRadius = "var(--radius)";

  iframe.onload = function () {
    clearTimeout(loadTimeout);
    previewArea.classList.remove("error-loading");
    previewArea.classList.add("card-loaded");
    console.log("Iframe loaded successfully."); // Log success
  };

  iframe.onerror = function () {
    previewArea.innerHTML = `<div class="preview-message">Error loading preview. <br>Try accessing the link directly: <br><a href="${cardUrl}" target="_blank">Open card</a></div>`;
    previewArea.classList.add("error-loading");
    previewArea.classList.remove("card-loaded");
    console.error("Error loading iframe:", cardUrl); // Log error
  };

  const loadTimeout = setTimeout(() => {
    if (!previewArea.classList.contains("card-loaded")) {
      iframe.onerror();
    }
  }, 15000); // Increase timeout to 15 seconds

  iframe.src = cardUrl;
  previewArea.innerHTML = "";
  previewArea.appendChild(iframe);

  updateCodeOutput(cardUrl);
}

function updateCodeOutput(cardUrl) {
  if (!cardUrl) return;

  const youtubeUrl = currentVideoId
    ? `https://youtube.com/watch?v=${currentVideoId}`
    : "https://youtube.com/watch?v=id";

  switch (currentFormat) {
    case "markdown":
      codeOutput.textContent = `[![YouTube Card](${cardUrl})](${youtubeUrl})`;
      break;
    case "html":
      codeOutput.textContent = `<a href="${youtubeUrl}"><img src="${cardUrl}" /></a>`;
      break;
    case "url":
      codeOutput.textContent = cardUrl;
      break;
  }
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    currentFormat = button.dataset.format;

    const cardUrl = currentVideoId
      ? generateCardUrl(currentVideoId)
      : "https://example.com/youtube-card";
    updateCodeOutput(cardUrl);
  });
});

// Copy button function
copyButton.addEventListener("click", function () {
  navigator.clipboard.writeText(codeOutput.textContent);
  this.textContent = "Copied!";
  setTimeout(() => {
    this.textContent = "Copy";
  }, 2000);
});

function registerChangeListeners() {
  const inputs = [
    videoIdInput,
    backgroundColorInput,
    borderRadiusInput,
    titleColorInput,
    statsColorInput,
    themeSelect,
    maxTitleLinesInput,
    cardWidthInput,
    showDurationCheckbox,
  ];

  inputs.forEach((input) => {
    const eventType =
      input.type === "select-one" || input.type === "checkbox"
        ? "change"
        : "input";
    input.addEventListener(eventType, updateCardPreview);
  });
}

function setDefaultValues() {}

const themes = {
  dark: {
    backgroundColor: "#0F0F0F",
    titleColor: "#FFFFFF",
    statsColor: "#DEDEDE",
  },
  light: {
    backgroundColor: "#FFFFFF",
    titleColor: "#000000",
    statsColor: "#555555",
  },
  github: {
    backgroundColor: "#0D1117",
    titleColor: "#FFFFFF",
    statsColor: "#DEDEDE",
  },
};

function updatePlaceholdersForTheme(theme) {
  const selectedTheme = themes[theme] || themes.github;

  backgroundColorInput.placeholder = selectedTheme.backgroundColor.replace(
    "#",
    ""
  );
  titleColorInput.placeholder = selectedTheme.titleColor.replace("#", "");
  statsColorInput.placeholder = selectedTheme.statsColor.replace("#", "");
}

themeSelect.addEventListener("change", () => {
  updatePlaceholdersForTheme(themeSelect.value);
  updateCardPreview();
});

document.addEventListener("DOMContentLoaded", () => {
  registerChangeListeners();
  setDefaultValues();
  updatePlaceholdersForTheme(themeSelect.value);
});

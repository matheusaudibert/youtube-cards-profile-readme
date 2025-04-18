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

// Store current code format and card settings
let currentFormat = "markdown";
let currentVideoId = "";

// Extract YouTube ID from a link or direct ID
function extractYouTubeId(input) {
  if (!input) return "";

  // Check if it's a simple ID (11 characters)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }

  // Extract from youtube.com/watch?v=ID links
  const regularMatch = input.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  if (regularMatch) return regularMatch[1];

  return "";
}

// Generate card URL based on configured parameters
function generateCardUrl(videoId) {
  if (!videoId) return "";

  const params = new URLSearchParams();
  params.append("id", videoId);

  // Theme
  const theme = themeSelect.value;
  params.append("theme", theme);

  // Colors (remove # if present)
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

  // Other configurations
  const borderRadius = borderRadiusInput.value.replace("px", "");
  if (borderRadius) {
    params.append("border_radius", borderRadius);
  }

  params.append("max_title_lines", maxTitleLinesInput.value || "1");

  const width = cardWidthInput.value.replace("px", "");
  if (width) {
    params.append("width", width || "250");
  }

  params.append("show_duration", showDurationCheckbox.checked);

  return `https://youtube-cards-wl3j.onrender.com/api?${params.toString()}`;
}

function updateCardPreview() {
  const inputValue = videoIdInput.value.trim();

  // Se o input estiver vazio, mantém a mensagem padrão inicial
  if (!inputValue) {
    previewArea.innerHTML = `<div class="preview-message">Enter a Youtube video link or ID to preview your card</div>`;
    previewArea.classList.remove("card-loaded"); // Remove classe para mostrar o container
    previewArea.classList.remove("error-loading"); // Remove classe de erro caso exista
    return;
  }

  const videoId = extractYouTubeId(inputValue);

  // Só mostra mensagem de erro se o input não estiver vazio E for inválido
  if (!videoId) {
    previewArea.innerHTML = `<div class="preview-message">Invalid YouTube video ID or URL</div>`;
    previewArea.classList.remove("card-loaded"); // Remove classe para mostrar o container
    previewArea.classList.add("error-loading"); // Adiciona classe de erro
    return;
  }

  currentVideoId = videoId;
  const cardUrl = generateCardUrl(videoId);

  // Show loading indicator
  previewArea.innerHTML = `<div class="preview-message">Loading preview...</div>`;
  previewArea.classList.remove("card-loaded"); // Mostra o container durante o carregamento
  previewArea.classList.remove("error-loading"); // Remove classe de erro caso exista

  // Create an iframe instead of an image for better SVG compatibility
  const iframe = document.createElement("iframe");
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.style.borderRadius = "var(--radius)";

  // Use onload to confirm successful loading
  iframe.onload = function () {
    clearTimeout(loadTimeout);
    previewArea.classList.remove("error-loading");
    previewArea.classList.add("card-loaded");
  };

  iframe.onerror = function () {
    // In case of error, show informative message
    previewArea.innerHTML = `<div class="preview-message">Error loading preview. <br>Try accessing the link directly: <br><a href="${cardUrl}" target="_blank">Open card</a></div>`;
    previewArea.classList.add("error-loading");
    previewArea.classList.remove("card-loaded"); // Remove a classe para mostrar o container
  };

  // Adiciona um timeout para verificar se o carregamento falhou
  const loadTimeout = setTimeout(() => {
    if (!previewArea.classList.contains("card-loaded")) {
      iframe.onerror(); // Executa a função de erro
    }
  }, 10000); // 10 segundos

  // Set iframe source
  iframe.src = cardUrl;

  // Clear previous content and add iframe
  previewArea.innerHTML = "";
  previewArea.appendChild(iframe);

  // Update code output with new preview
  updateCodeOutput(cardUrl);
}

// Update code output based on selected format
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

// Switch between code formats
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    currentFormat = button.dataset.format;

    // Remover a verificação de currentVideoId para permitir sempre a mudança de formato
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

// Register change listeners for all inputs for real-time updates
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

// Set default values
function setDefaultValues() {
  // updateCardPreview();
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  registerChangeListeners();
  setDefaultValues();
});

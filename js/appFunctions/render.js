/**
 * Populates innerText of multiple DOM elements by id map.
 * @param {Object<string, string>} textMap - Map of element ids to text strings.
 * @returns {void}
 */
const renderTextValues = (textMap) => {
  const keys = Object.keys(textMap);
  for (let i = 0; i < keys.length; i++) {
    const el = document.getElementById(keys[i]);
    if (el) {
      el.innerText = textMap[keys[i]];
    }
  }
};

/**
 * Returns the HTML template matching a Game Over hint key.
 * @param {string} hintType - Hint identifier ("hintA", "hintB", or "").
 * @returns {string} HTML markup for the hint box.
 */
const getGameOverHintTemplate = (hintType) => {
  if (hintType === "hintA") {
    return getGameOverHintATemplate();
  }
  if (hintType === "hintB") {
    return getGameOverHintBTemplate();
  }
  return "";
};

/**
 * Renders or hides the contextual Game Over hint box.
 * @param {string} hintType - Hint identifier ("hintA", "hintB", or "").
 * @returns {void}
 */
const renderGameOverHint = (hintType) => {
  const container = document.getElementById("game-over-hint");
  if (!container) {
    return;
  }
  const html = getGameOverHintTemplate(hintType);
  container.innerHTML = html;
  toggleElement("game-over-hint", Boolean(html));
};

/**
 * Formats victory summary numbers into display strings keyed by DOM id.
 * @param {Object} s - Calculated summary object.
 * @returns {Object<string, string>} Formatted id-to-text map.
 */
const buildSummaryTextMap = (s) => {
  return {
    "summary-health": `1000 x ${s.health}/100 = ${s.healthBonus}`,
    "summary-coins": `x ${s.coins} = 50 x ${s.coins} = ${s.coinBonus}`,
    "summary-bottles": `x ${s.bottles} = 100 x ${s.bottles} = ${s.bottleBonus}`,
    "summary-score": `${s.baseScore}`,
    "summary-total": `${s.baseScore} + ${s.healthBonus} + ${s.coinBonus} + ${s.bottleBonus} = ${s.totalScore}`,
  };
};

/**
 * Renders the victory summary overlay with calculated bonus values.
 * @param {Object} summary - Summary data object.
 * @returns {void}
 */
const renderSummaryOverlay = (summary) => {
  const container = document.getElementById("summary-frame");
  container.innerHTML = getSummaryOverlayTemplate();
  renderTextValues(buildSummaryTextMap(summary));
};

/**
 * Renders the save-score overlay and focuses the name input field.
 * @param {number} totalScore - Final combined score.
 * @returns {void}
 */
const renderSaveScoreOverlay = (totalScore) => {
  const container = document.getElementById("save-score-frame");
  container.innerHTML = getSaveScoreOverlayTemplate();
  renderTextValues({ "save-score-value": `${totalScore}` });
  const input = document.getElementById("player-name-input");
  if (input) {
    input.focus();
  }
};

/**
 * Updates the accessible validation error message in the save-score overlay.
 * @param {string} message - Validation feedback text.
 * @returns {void}
 */
const renderValidationMessage = (message) => {
  renderTextValues({ "player-name-inputContainerError": message });
};

/**
 * Renders the rotating bottle loading spinner overlay.
 * @returns {void}
 */
const renderLoadingSpinner = () => {
  const container = document.getElementById("spinner-frame");
  container.innerHTML = getSpinnerOverlayTemplate();
};

/**
 * Renders the save status confirmation screen with the given title.
 * @param {string} statusText - Confirmation status text.
 * @returns {void}
 */
const renderSaveStatusFrame = (statusText) => {
  const container = document.getElementById("save-status-frame");
  container.innerHTML = getSaveStatusOverlayTemplate();
  renderTextValues({ "save-status-title": statusText });
};

/**
 * Renders the offline local-save decision overlay.
 * @returns {void}
 */
const renderLocalSavePrompt = () => {
  const container = document.getElementById("local-save-error-frame");
  container.innerHTML = getLocalSavePromptTemplate();
};

/**
 * Renders the leaderboard frame with scores or an empty-state message.
 * @param {Array<Object>} scores - Prepared top score entries.
 * @returns {void}
 */
const renderHighscoreFrame = (scores) => {
  const container = document.getElementById("highscore-frame");
  container.innerHTML = getHighscoreFrameTemplate();
  if (scores.length === 0) {
    renderHighscoreStatusMessage("No highscores yet.");
  } else {
    renderHighscoreRows(scores);
  }
};

/**
 * Injects leaderboard row templates and fills their text values.
 * @param {Array<Object>} scores - Prepared top score entries.
 * @returns {void}
 */
const renderHighscoreRows = (scores) => {
  const listEl = document.getElementById("highscore-list");
  listEl.innerHTML = buildHighscoreListHtml(scores);
  fillHighscoreRowTexts(scores);
};

/**
 * Concatenates row HTML strings for every score in the list.
 * @param {Array<Object>} scores - Score list.
 * @returns {string} Combined HTML markup.
 */
const buildHighscoreListHtml = (scores) => {
  let html = "";
  for (let i = 0; i < scores.length; i++) {
    html += getHighscoreRowTemplate(i);
  }
  return html;
};

/**
 * Populates rank, player name, and score text for every rendered row.
 * @param {Array<Object>} scores - Score list.
 * @returns {void}
 */
const fillHighscoreRowTexts = (scores) => {
  for (let i = 0; i < scores.length; i++) {
    renderTextValues({
      [`hs-rank-${i}`]: `${i + 1}.`,
      [`hs-name-${i}`]: `${scores[i].name}`,
      [`hs-score-${i}`]: `${scores[i].score}`,
    });
  }
};

/**
 * Displays a status or error line inside the leaderboard list container.
 * @param {string} message - Status message text.
 * @returns {void}
 */
const renderHighscoreStatusMessage = (message) => {
  const listEl = document.getElementById("highscore-list");
  listEl.innerHTML = getHighscoreStatusTemplate();
  renderTextValues({ "highscore-status-msg": message });
};

/**
 * Renders the leaderboard frame showing a fetch error message.
 * @param {string} message - Error text to display.
 * @returns {void}
 */
const renderHighscoreErrorFrame = (message) => {
  const container = document.getElementById("highscore-frame");
  container.innerHTML = getHighscoreFrameTemplate();
  renderHighscoreStatusMessage(message);
};

/**
 * Updates Sound and Fullscreen toggle button labels and colors in Settings.
 * @param {boolean} soundEnabled - Current sound state.
 * @param {boolean} fullscreenEnabled - Current fullscreen state.
 * @returns {void}
 */
const renderSettingsButtons = (soundEnabled, fullscreenEnabled) => {
  updateToggleButton("setting-sound-btn", soundEnabled);
  updateToggleButton("setting-fullscreen-btn", fullscreenEnabled);
};

/**
 * Applies on/off text and styling class to a single settings toggle button.
 * @param {string} id - Button element id.
 * @param {boolean} isEnabled - Current toggle state.
 * @returns {void}
 */
const updateToggleButton = (id, isEnabled) => {
  const btn = document.getElementById(id);
  if (!btn) {
    return;
  }
  if (isEnabled) {
    btn.innerText = "on";
    btn.classList.remove("is-off");
  } else {
    btn.innerText = "off";
    btn.classList.add("is-off");
  }
};
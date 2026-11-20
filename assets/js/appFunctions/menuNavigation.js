let currentMenuFrame = 1;

/**
 * Shows or hides a single DOM element using the d-none utility class.
 * @param {string} id - DOM element id.
 * @param {boolean} show - True to reveal, false to hide.
 * @returns {void}
 */
const toggleElement = (id, show) => {
  const el = document.getElementById(id);
  if (!el) {
    return;
  }
  if (show) {
    el.classList.remove("d-none");
  } else {
    el.classList.add("d-none");
  }
};

/**
 * Updates visibility across start menu frames, canvas, and Game Over overlay.
 * @param {boolean} showF1 - Show Start Frame 1.
 * @param {boolean} showF2 - Show Main Menu Frame 2 and Canvas.
 * @param {boolean} showAbout - Show About screen.
 * @param {boolean} showGameOver - Show Game Over screen.
 * @returns {void}
 */
const setMenuVisibility = (showF1, showF2, showAbout, showGameOver) => {
  hideAllWinOverlays();
  toggleElement("frame-1", showF1);
  toggleElement("frame-2", showF2);
  toggleElement("gameCanvas", showF2);
  toggleElement("frame-about", showAbout);
  toggleElement("game-over-frame", Boolean(showGameOver));
};

/**
 * Hides all victory, leaderboard, and save-flow overlay sections.
 * @returns {void}
 */
const hideAllWinOverlays = () => {
  toggleElement("you-won-frame", false);
  toggleElement("summary-frame", false);
  toggleElement("save-score-frame", false);
  toggleElement("spinner-frame", false);
  toggleElement("save-status-frame", false);
  toggleElement("local-save-error-frame", false);
  toggleElement("highscore-frame", false);
};

/**
 * Displays exactly one overlay frame while hiding all menu frames.
 * @param {string} activeId - Element id to display.
 * @returns {void}
 */
const showOnlyOverlayFrame = (activeId) => {
  setMenuVisibility(false, false, false, false);
  toggleElement("touch-controls", false);
  toggleElement(activeId, true);
};

/**
 * Routes discrete keyboard or touch control keys while in menu or win screens.
 * @param {string} key - Logical key name (Enter or Tab).
 * @returns {void}
 */
const handleMenuControlKey = (key) => {
  if (currentMenuFrame === 1 && key === "Enter") {
    showFrame2();
  } else if (currentMenuFrame === 2 && key === "Tab") {
    initMenu();
  } else if (currentMenuFrame === 3 && key === "Tab") {
    showFrame2();
  } else if (currentMenuFrame === 5 && key === "Enter") {
    returnToFrame2FromGame();
  } else {
    handleWinFlowControlKey(key);
  }
};

/**
 * Routes Enter and Tab controls inside victory and score-save overlays.
 * @param {string} key - Logical key name.
 * @returns {void}
 */
const handleWinFlowControlKey = (key) => {
  if (currentMenuFrame === 6 && key === "Enter") {
    openSummaryFrame();
  } else if (currentMenuFrame === 7) {
    handleSummaryControlKey(key);
  } else if (currentMenuFrame === 8 && key === "Enter") {
    handleSaveScoreSubmit();
  } else {
    handleSaveFlowControlKey(key);
  }
};

/**
 * Handles Tab exit and Enter save actions inside the Summary overlay.
 * @param {string} key - Logical key name.
 * @returns {void}
 */
const handleSummaryControlKey = (key) => {
  if (key === "Tab") {
    returnToMainMenu();
  } else if (key === "Enter") {
    openSaveScoreFrame();
  }
};

/**
 * Handles Tab and Enter actions in leaderboard, save status, and offline prompt.
 * @param {string} key - Logical key name.
 * @returns {void}
 */
const handleSaveFlowControlKey = (key) => {
  if (currentMenuFrame === 4 && key === "Tab") {
    showFrame2();
  } else if (currentMenuFrame === 10 && key === "Enter") {
    returnToMainMenu();
  } else if (currentMenuFrame === 11 && key === "Enter") {
    handleLocalSaveConfirm();
  } else if (currentMenuFrame === 11 && key === "Tab") {
    returnToMainMenu();
  }
};

/**
 * Continues from Game Over back to Frame 2 on click or touch.
 * @param {Event} event - Click or touch event.
 * @returns {void}
 */
const handleGameOverTouchOrClick = (event) => {
  if (event.type === "touchstart") {
    event.preventDefault();
  }
  if (currentMenuFrame === 5) {
    returnToFrame2FromGame();
  }
};

/**
 * Opens the Frame 2 main menu and hides touch HUD controls.
 * @returns {void}
 */
const showFrame2 = () => {
  blurActiveElement();
  currentMenuFrame = 2;
  toggleElement("touch-controls", false);
  setMenuVisibility(false, true, false, false);
};

/**
 * Stops gameplay, plays game-over sound, and displays the Game Over overlay.
 * @returns {void}
 */
const showGameOverFrame = () => {
  resetAllGamePopups();
  playGameOverSound();
  currentMenuFrame = 5;
  toggleElement("touch-controls", false);
  setMenuVisibility(false, false, false, true);
};

/**
 * Opens the About screen inside the start overlay.
 * @returns {void}
 */
const openAbout = () => {
  currentMenuFrame = 3;
  setMenuVisibility(false, false, true, false);
};

/**
 * Triggers leaderboard loading and display.
 * @returns {void}
 */
const openHighScore = () => {
  loadAndShowHighscores();
};
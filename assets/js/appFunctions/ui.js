/**
 * Validates that the player name consists of 4 to 12 ASCII letters.
 * @param {string} name - Trimmed player name string.
 * @returns {boolean} True if valid.
 */
const isValidPlayerName = (name) => {
  const regex = /^[A-Za-z]{4,12}$/;
  return regex.test(name);
};

/**
 * Starts the post-victory overlay sequence after boss defeat.
 * @param {{health: number, coins: number, bottles: number, score: number}} winStats - Final stats.
 * @returns {void}
 */
const startYouWonFlow = (winStats) => {
  calculateWinSummary(winStats);
  resetAllGamePopups();
  currentMenuFrame = 6;
  showOnlyOverlayFrame("you-won-frame");
};

/**
 * Advances from the You Won screen to the Summary overlay on tap or click.
 * @param {Event} event - Click or touch event.
 * @returns {void}
 */
const handleYouWonContinue = (event) => {
  if (event && event.type === "touchstart") {
    event.preventDefault();
  }
  if (currentMenuFrame === 6) {
    openSummaryFrame();
  }
};

/**
 * Renders and displays the score breakdown summary overlay.
 * @returns {void}
 */
const openSummaryFrame = () => {
  currentMenuFrame = 7;
  renderSummaryOverlay(winState.summary);
  showOnlyOverlayFrame("summary-frame");
};

/**
 * Renders and displays the leaderboard name input overlay.
 * @returns {void}
 */
const openSaveScoreFrame = () => {
  currentMenuFrame = 8;
  renderSaveScoreOverlay(winState.summary.totalScore);
  showOnlyOverlayFrame("save-score-frame");
};

/**
 * Validates player name input and initiates server score submission.
 * @returns {void}
 */
const handleSaveScoreSubmit = () => {
  const input = document.getElementById("player-name-input");
  const playerName = input.value.trim();
  if (!isValidPlayerName(playerName)) {
    renderValidationMessage("• min 4 letter maximum 12 (A-Z only)");
    return;
  }
  const payload = getHighscoreDataTemplate(playerName, winState.summary.totalScore);
  winState.pendingPayload = payload;
  submitScoreToServer(payload);
};

/**
 * Shows loading spinner, posts score to server, and routes success or failure.
 * @param {{name: string, score: number, createdAt: number}} payload - Score payload.
 * @returns {Promise<void>}
 */
const submitScoreToServer = async (payload) => {
  currentMenuFrame = 9;
  renderLoadingSpinner();
  showOnlyOverlayFrame("spinner-frame");
  const isOk = await postHighscoreData(payload);
  if (isOk) {
    handleSaveSuccess();
  } else {
    handleSaveError();
  }
};

/**
 * Displays confirmation screen after successful server upload.
 * @returns {void}
 */
const handleSaveSuccess = () => {
  currentMenuFrame = 10;
  renderSaveStatusFrame("Progress saved");
  showOnlyOverlayFrame("save-status-frame");
};

/**
 * Displays local-save prompt after a failed server upload.
 * @returns {void}
 */
const handleSaveError = () => {
  currentMenuFrame = 11;
  renderLocalSavePrompt();
  showOnlyOverlayFrame("local-save-error-frame");
};

/**
 * Stores score locally, starts auto-sync, and displays confirmation.
 * @returns {void}
 */
const handleLocalSaveConfirm = () => {
  saveScoreLocally(winState.pendingPayload);
  startLocalSyncInterval();
  currentMenuFrame = 10;
  renderSaveStatusFrame("Progress locally saved.");
  showOnlyOverlayFrame("save-status-frame");
};

/**
 * Returns to main menu after confirming the save status screen.
 * @param {Event} event - Click or touch event.
 * @returns {void}
 */
const handleSaveStatusContinue = (event) => {
  if (event && event.type === "touchstart") {
    event.preventDefault();
  }
  if (currentMenuFrame === 10) {
    returnToMainMenu();
  }
};

/**
 * Exits any win or save workflow back to the Frame 2 main menu.
 * @returns {void}
 */
const returnToMainMenu = () => {
  returnToFrame2FromGame();
};

/**
 * Displays spinner, fetches leaderboard entries, and routes the response.
 * @returns {Promise<void>}
 */
const loadAndShowHighscores = async () => {
  currentMenuFrame = 4;
  renderLoadingSpinner();
  showOnlyOverlayFrame("spinner-frame");
  const result = await fetchHighscoresData();
  routeHighscoreResponse(result);
};

/**
 * Routes leaderboard fetch result to success or error rendering if still active.
 * @param {{ok: boolean, data: Object|null}} result - Fetch result wrapper.
 * @returns {void}
 */
const routeHighscoreResponse = (result) => {
  if (currentMenuFrame !== 4) {
    return;
  }
  if (result.ok) {
    handleHighscoreLoadSuccess(result.data);
  } else {
    handleHighscoreLoadError();
  }
};

/**
 * Prepares top 10 scores and opens the leaderboard overlay.
 * @param {Object|null} rawData - Raw Firebase response.
 * @returns {void}
 */
const handleHighscoreLoadSuccess = (rawData) => {
  const topScores = prepareHighscoreList(rawData);
  renderHighscoreFrame(topScores);
  showOnlyOverlayFrame("highscore-frame");
};

/**
 * Renders an error state inside the leaderboard overlay.
 * @returns {void}
 */
const handleHighscoreLoadError = () => {
  renderHighscoreErrorFrame("Could not load leaderboard.");
  showOnlyOverlayFrame("highscore-frame");
};
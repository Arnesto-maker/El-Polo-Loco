const isValidPlayerName = (name) => {
  const regex = /^[A-Za-z]{4,12}$/;
  return regex.test(name);
};

const startYouWonFlow = (winStats) => {
  calculateWinSummary(winStats);
  resetAllGamePopups();
  currentMenuFrame = 6;
  showOnlyOverlayFrame("you-won-frame");
};

const handleYouWonContinue = (event) => {
  if (event && event.type === "touchstart") {
    event.preventDefault();
  }
  if (currentMenuFrame === 6) {
    openSummaryFrame();
  }
};

const openSummaryFrame = () => {
  currentMenuFrame = 7;
  renderSummaryOverlay(winState.summary);
  showOnlyOverlayFrame("summary-frame");
};

const openSaveScoreFrame = () => {
  currentMenuFrame = 8;
  renderSaveScoreOverlay(winState.summary.totalScore);
  showOnlyOverlayFrame("save-score-frame");
};

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

const handleSaveSuccess = () => {
  currentMenuFrame = 10;
  renderSaveStatusFrame("Progress saved");
  showOnlyOverlayFrame("save-status-frame");
};

const handleSaveError = () => {
  currentMenuFrame = 11;
  renderLocalSavePrompt();
  showOnlyOverlayFrame("local-save-error-frame");
};

const handleLocalSaveConfirm = () => {
  saveScoreLocally(winState.pendingPayload);
  startLocalSyncInterval();
  currentMenuFrame = 10;
  renderSaveStatusFrame("progress locally saved.");
  showOnlyOverlayFrame("save-status-frame");
};

const handleSaveStatusContinue = (event) => {
  if (event && event.type === "touchstart") {
    event.preventDefault();
  }
  if (currentMenuFrame === 10) {
    executeNode3a();
  }
};

const executeNode3a = () => {
  returnToFrame2FromGame();
};

const loadAndShowHighscores = async () => {
  currentMenuFrame = 4;
  renderLoadingSpinner();
  showOnlyOverlayFrame("spinner-frame");
  const result = await fetchHighscoresData();
  routeHighscoreResponse(result);
};

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

const handleHighscoreLoadSuccess = (rawData) => {
  const topScores = prepareHighscoreList(rawData);
  renderHighscoreFrame(topScores);
  showOnlyOverlayFrame("highscore-frame");
};

const handleHighscoreLoadError = () => {
  renderHighscoreErrorFrame("Could not load leaderboard.");
  showOnlyOverlayFrame("highscore-frame");
};
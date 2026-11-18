const renderTextValues = (textMap) => {
  const keys = Object.keys(textMap);
  for (let i = 0; i < keys.length; i++) {
    const el = document.getElementById(keys[i]);
    if (el) {
      el.innerText = textMap[keys[i]];
    }
  }
};

const buildSummaryTextMap = (s) => {
  return {
    "summary-health": `1000 x ${s.health}/100 = ${s.healthBonus}`,
    "summary-coins": `x ${s.coins} = 50 x ${s.coins} = ${s.coinBonus}`,
    "summary-bottles": `x ${s.bottles} = 100 x ${s.bottles} = ${s.bottleBonus}`,
    "summary-score": `${s.baseScore}`,
    "summary-total": `${s.baseScore} + ${s.healthBonus} + ${s.coinBonus} + ${s.bottleBonus} = ${s.totalScore}`
  };
};

const renderSummaryOverlay = (summary) => {
  const container = document.getElementById("summary-frame");
  container.innerHTML = getSummaryOverlayTemplate();
  renderTextValues(buildSummaryTextMap(summary));
};

const renderSaveScoreOverlay = (totalScore) => {
  const container = document.getElementById("save-score-frame");
  container.innerHTML = getSaveScoreOverlayTemplate();
  renderTextValues({ "save-score-value": `${totalScore}` });
  const input = document.getElementById("player-name-input");
  if (input) {
    input.focus();
  }
};

const renderValidationMessage = (message) => {
  renderTextValues({ "save-validation-msg": message });
};

const renderLoadingSpinner = () => {
  const container = document.getElementById("spinner-frame");
  container.innerHTML = getSpinnerOverlayTemplate();
};

const renderSaveStatusFrame = (statusText) => {
  const container = document.getElementById("save-status-frame");
  container.innerHTML = getSaveStatusOverlayTemplate();
  renderTextValues({ "save-status-title": statusText });
};

const renderLocalSavePrompt = () => {
  const container = document.getElementById("local-save-error-frame");
  container.innerHTML = getLocalSavePromptTemplate();
};

const renderHighscoreFrame = (scores) => {
  const container = document.getElementById("highscore-frame");
  container.innerHTML = getHighscoreFrameTemplate();
  if (scores.length === 0) {
    renderHighscoreStatusMessage("No highscores yet.");
  } else {
    renderHighscoreRows(scores);
  }
};

const renderHighscoreRows = (scores) => {
  const listEl = document.getElementById("highscore-list");
  listEl.innerHTML = buildHighscoreListHtml(scores);
  fillHighscoreRowTexts(scores);
};

const buildHighscoreListHtml = (scores) => {
  let html = "";
  for (let i = 0; i < scores.length; i++) {
    html += getHighscoreRowTemplate(i);
  }
  return html;
};

const fillHighscoreRowTexts = (scores) => {
  for (let i = 0; i < scores.length; i++) {
    renderTextValues({
      [`hs-rank-${i}`]: `${i + 1}.`,
      [`hs-name-${i}`]: `${scores[i].name}`,
      [`hs-score-${i}`]: `${scores[i].score}`
    });
  }
};

const renderHighscoreStatusMessage = (message) => {
  const listEl = document.getElementById("highscore-list");
  listEl.innerHTML = getHighscoreStatusTemplate();
  renderTextValues({ "highscore-status-msg": message });
};

const renderHighscoreErrorFrame = (message) => {
  const container = document.getElementById("highscore-frame");
  container.innerHTML = getHighscoreFrameTemplate();
  renderHighscoreStatusMessage(message);
};
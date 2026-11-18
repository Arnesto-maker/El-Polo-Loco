const getHighscoreDataTemplate = (playerName, playerScore) => {
  return {
    name: playerName,
    score: playerScore,
    createdAt: Date.now(),
  };
};

const getSummaryOverlayTemplate = () => {
  return `
    <div class="win-card">
      <h2 class="win-title">Summary</h2>
      <div class="summary-row"><span>Health x 100% =</span><span id="summary-health"></span></div>
      <div class="summary-row"><img src="assets/img/8_coin/coin_1.png" alt="Coin" class="summary-icon"><span id="summary-coins"></span></div>
      <div class="summary-row"><img src="assets/img/6_salsa_bottle/salsa_bottle.png" alt="Bottle" class="summary-icon"><span id="summary-bottles"></span></div>
      <div class="summary-row"><span>Score =</span><span id="summary-score"></span></div>
      <div class="summary-row summary-total"><span>Total =</span><span id="summary-total"></span></div>
      <div class="summary-actions"><span onclick="executeNode3a()">esc = exit</span><span onclick="openSaveScoreFrame()">Enter = Save and exit</span></div>
    </div>
  `;
};

const getSaveScoreOverlayTemplate = () => {
  return `
    <div class="win-card">
      <label for="player-name-input" class="save-label">Your name:</label>
      <input id="player-name-input" class="save-input" type="text" maxlength="12" autocomplete="off">
      <p id="save-validation-msg" class="save-hint">• min 4 letter maximum 12</p>
      <div class="summary-row"><span>Score :</span><span id="save-score-value"></span></div>
      <p class="save-submit-hint" onclick="handleSaveScoreSubmit()">enter = Save to Leaderboard</p>
    </div>
  `;
};

const getSpinnerOverlayTemplate = () => {
  return `
    <div class="spinner-box">
      <img src="assets/img/6_salsa_bottle/salsa_bottle.png" alt="Loading" class="loading-spinner-bottle">
    </div>
  `;
};

const getSaveStatusOverlayTemplate = () => {
  return `
    <div class="status-box">
      <p id="save-status-title" class="status-title"></p>
      <p class="win-continue-text">press enter, click or Touch to continue</p>
    </div>
  `;
};

const getLocalSavePromptTemplate = () => {
  return `
    <div class="status-box">
      <p class="status-title">Do you want to locally save the game and automatically try again later?</p>
      <div class="prompt-actions">
        <p class="prompt-option" onclick="handleLocalSaveConfirm()">Enter = yes and exit</p>
        <p class="prompt-option" onclick="executeNode3a()">esc = no and exit</p>
      </div>
    </div>
  `;
};

const getHighscoreFrameTemplate = () => {
  return `
    <div class="win-card highscore-card">
      <h2 class="win-title">Leaderboard</h2>
      <div id="highscore-list" class="highscore-list"></div>
      <p class="highscore-back" onclick="showFrame2()">esc = back</p>
    </div>
  `;
};

const getHighscoreRowTemplate = (index) => {
  return `
    <div id="hs-row-${index}" class="highscore-row">
      <span id="hs-rank-${index}" class="hs-rank"></span>
      <span id="hs-name-${index}" class="hs-name"></span>
      <span id="hs-score-${index}" class="hs-score"></span>
    </div>
  `;
};

const getHighscoreStatusTemplate = () => {
  return `
    <p id="highscore-status-msg" class="highscore-status-msg"></p>
  `;
};

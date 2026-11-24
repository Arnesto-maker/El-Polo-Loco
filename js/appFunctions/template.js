/**
 * Builds a timestamped leaderboard entry payload.
 * @param {string} playerName - Validated player name.
 * @param {number} playerScore - Final total score.
 * @returns {{name: string, score: number, createdAt: number}} Score data object.
 */
const getHighscoreDataTemplate = (playerName, playerScore) => {
  return {
    name: playerName,
    score: playerScore,
    createdAt: Date.now(),
  };
};

/**
 * Returns HTML markup for Game Over Hint A (Boss Combat tip).
 * @returns {string} HTML string.
 */
const getGameOverHintATemplate = () => {
  return `
    <p class="game-over-hint-line">Use Jump Throw to attack boss Head and shred the armour. After that you can kill him.</p>
    <p class="game-over-hint-line">Dodge Salvo attack.</p>
  `;
};

/**
 * Returns HTML markup for Game Over Hint B (Resource Economy tip).
 * @returns {string} HTML string.
 */
const getGameOverHintBTemplate = () => {
  return `
    <p class="game-over-hint-line">Watch out for your economy.</p>
    <p class="game-over-hint-line">Use money and bottle wisely.</p>
  `;
};

/**
 * Returns HTML markup for the post-victory summary overlay.
 * @returns {string} HTML string.
 */
const getSummaryOverlayTemplate = () => {
  return `
    <div class="win-card">
      <h2 class="win-title">Summary</h2>
      <div class="summary-row"><span>Health x 100% =</span><span id="summary-health"></span></div>
      <div class="summary-row"><img src="assets/img/8_coin/coin_1.png" alt="Coin" class="summary-icon"><span id="summary-coins"></span></div>
      <div class="summary-row"><img src="assets/img/6_salsa_bottle/salsa_bottle.png" alt="Bottle" class="summary-icon"><span id="summary-bottles"></span></div>
      <div class="summary-row"><span>Score =</span><span id="summary-score"></span></div>
      <div class="summary-row summary-total"><span>Total =</span><span id="summary-total"></span></div>
      <div class="summary-actions"><span onclick="returnToMainMenu()">Tab = exit</span><span onclick="openSaveScoreFrame()">Enter = Save and exit</span></div>
    </div>
  `;
};

/**
 * Returns HTML markup for the player name input overlay.
 * @returns {string} HTML string.
 */
const getSaveScoreOverlayTemplate = () => {
  return `
    <div class="win-card">
      <label for="player-name-input" class="save-label">Your name:</label>
      <input id="player-name-input" class="save-input" type="text" maxlength="12" autocomplete="off">
      <p id="save-validation-msg" class="save-hint">• min 4 letter maximum 12</p>
      <div class="summary-row"><span>Score :</span><span id="save-score-value"></span></div>
      <p class="save-submit-hint" onclick="handleSaveScoreSubmit()">Enter = Save to Leaderboard</p>
    </div>
  `;
};

/**
 * Returns HTML markup for the rotating salsa-bottle loading spinner.
 * @returns {string} HTML string.
 */
const getSpinnerOverlayTemplate = () => {
  return `
    <div class="spinner-box">
      <img src="assets/img/6_salsa_bottle/salsa_bottle.png" alt="Loading" class="loading-spinner-bottle">
    </div>
  `;
};

/**
 * Returns HTML markup for the save confirmation status screen.
 * @returns {string} HTML string.
 */
const getSaveStatusOverlayTemplate = () => {
  return `
    <div class="status-box">
      <p id="save-status-title" class="status-title"></p>
      <p class="win-continue-text">Press Enter, click or Touch to continue</p>
    </div>
  `;
};

/**
 * Returns HTML markup for the offline local-save fallback prompt.
 * @returns {string} HTML string.
 */
const getLocalSavePromptTemplate = () => {
  return `
    <div class="status-box">
      <p class="status-title">Do you want to locally save the game and automatically try again later?</p>
      <div class="prompt-actions">
        <p class="prompt-option" onclick="handleLocalSaveConfirm()">Enter = yes and exit</p>
        <p class="prompt-option" onclick="returnToMainMenu()">Tab = no and exit</p>
      </div>
    </div>
  `;
};

/**
 * Returns HTML markup for the leaderboard overlay container.
 * @returns {string} HTML string.
 */
const getHighscoreFrameTemplate = () => {
  return `
    <div class="win-card highscore-card">
      <h2 class="win-title">Leaderboard</h2>
      <div id="highscore-list" class="highscore-list"></div>
      <p class="highscore-back" onclick="showFrame2()">Tab = back</p>
    </div>
  `;
};

/**
 * Returns HTML markup for a single leaderboard row.
 * @param {number} index - Zero-based row index.
 * @returns {string} HTML string.
 */
const getHighscoreRowTemplate = (index) => {
  return `
    <div id="hs-row-${index}" class="highscore-row">
      <span id="hs-rank-${index}" class="hs-rank"></span>
      <span id="hs-name-${index}" class="hs-name"></span>
      <span id="hs-score-${index}" class="hs-score"></span>
    </div>
  `;
};

/**
 * Returns HTML markup for an empty or error leaderboard message.
 * @returns {string} HTML string.
 */
const getHighscoreStatusTemplate = () => {
  return `
    <p id="highscore-status-msg" class="highscore-status-msg"></p>
  `;
};
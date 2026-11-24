const winState = {
  summary: null,
  pendingPayload: null,
  syncIntervalId: null,
};

/**
 * Calculates victory bonus points and stores the final summary object.
 * @param {{health: number, coins: number, bottles: number, score: number}} winStats - End-of-game stats.
 * @returns {void}
 */
const calculateWinSummary = (winStats) => {
  const healthBonus = Math.round(1000 * (winStats.health / 100));
  const coinBonus = winStats.coins * 50;
  const bottleBonus = winStats.bottles * 100;
  const totalScore = winStats.score + healthBonus + coinBonus + bottleBonus;
  winState.summary = buildSummaryObject(winStats, healthBonus, coinBonus, bottleBonus, totalScore);
};

/**
 * Builds a structured summary data object for rendering.
 * @param {{health: number, coins: number, bottles: number, score: number}} stats - Raw win stats.
 * @param {number} healthBonus - Bonus from remaining health.
 * @param {number} coinBonus - Bonus from unspent coins.
 * @param {number} bottleBonus - Bonus from leftover bottles.
 * @param {number} totalScore - Combined final score.
 * @returns {Object} Structured summary payload.
 */
const buildSummaryObject = (stats, healthBonus, coinBonus, bottleBonus, totalScore) => {
  return {
    health: stats.health,
    healthBonus: healthBonus,
    coins: stats.coins,
    coinBonus: coinBonus,
    bottles: stats.bottles,
    bottleBonus: bottleBonus,
    baseScore: stats.score,
    totalScore: totalScore,
  };
};

/**
 * Sends a JSON POST request to the configured highscore endpoint.
 * @param {{name: string, score: number, createdAt: number}} payload - Score payload.
 * @returns {Promise<Response>} Raw Fetch API response.
 */
const sendPostRequest = async (payload) => {
  return await fetch(HIGHSCORE_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

/**
 * Posts a player highscore to the server and returns success status.
 * @param {{name: string, score: number, createdAt: number}} payload - Score payload.
 * @returns {Promise<boolean>} True if HTTP 200 OK succeeded.
 */
const postHighscoreData = async (payload) => {
  try {
    const response = await sendPostRequest(payload);
    return response.ok && response.status === 200;
  } catch (error) {
    return false;
  }
};

/**
 * Sends a GET request to fetch all stored highscores.
 * @returns {Promise<Response>} Raw Fetch API response.
 */
const sendGetRequest = async () => {
  return await fetch(HIGHSCORE_API_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};

/**
 * Fetches leaderboard JSON data and wraps it with an ok status flag.
 * @returns {Promise<{ok: boolean, data: Object|null}>} Result wrapper.
 */
const fetchHighscoresData = async () => {
  try {
    const response = await sendGetRequest();
    if (response.ok && response.status === 200) {
      const data = await response.json();
      return { ok: true, data: data };
    }
    return { ok: false, data: null };
  } catch (error) {
    return { ok: false, data: null };
  }
};

/**
 * Converts Firebase key-value object data into a flat array of score entries.
 * @param {Object|null} rawData - Raw Firebase JSON object.
 * @returns {Array<{name: string, score: number}>} Extracted score list.
 */
const extractHighscoreArray = (rawData) => {
  if (!rawData) {
    return [];
  }
  const list = [];
  const keys = Object.keys(rawData);
  for (let i = 0; i < keys.length; i++) {
    if (rawData[keys[i]] && rawData[keys[i]].name) {
      list.push(rawData[keys[i]]);
    }
  }
  return list;
};

/**
 * Sorts an array of score objects from highest to lowest score.
 * @param {Array<{name: string, score: number}>} scores - Unsorted scores.
 * @returns {Array<{name: string, score: number}>} Descending sorted scores.
 */
const sortHighscoresDescending = (scores) => {
  scores.sort((a, b) => {
    return b.score - a.score;
  });
  return scores;
};

/**
 * Returns up to the specified maximum number of top score entries.
 * @param {Array<Object>} scores - Sorted score list.
 * @param {number} limit - Maximum number of entries.
 * @returns {Array<Object>} Truncated top list.
 */
const sliceTopScores = (scores, limit) => {
  const topList = [];
  const maxCount = Math.min(scores.length, limit);
  for (let i = 0; i < maxCount; i++) {
    topList.push(scores[i]);
  }
  return topList;
};

/**
 * Extracts, sorts, and limits raw leaderboard data to the top 10 entries.
 * @param {Object|null} rawData - Raw Firebase JSON response.
 * @returns {Array<Object>} Top 10 leaderboard entries.
 */
const prepareHighscoreList = (rawData) => {
  const extracted = extractHighscoreArray(rawData);
  const sorted = sortHighscoresDescending(extracted);
  return sliceTopScores(sorted, 10);
};

/**
 * Reads offline-queued score payloads from localStorage.
 * @returns {Array<Object>} List of pending score payloads.
 */
const getLocalPendingScores = () => {
  const rawData = localStorage.getItem(LOCAL_SYNC_KEY);
  if (!rawData) {
    return [];
  }
  return JSON.parse(rawData);
};

/**
 * Appends a score payload to the local offline sync queue.
 * @param {Object} payload - Score payload to store locally.
 * @returns {void}
 */
const saveScoreLocally = (payload) => {
  const pendingList = getLocalPendingScores();
  pendingList.push(payload);
  localStorage.setItem(LOCAL_SYNC_KEY, JSON.stringify(pendingList));
};

/**
 * Starts the periodic background sync timer for offline highscores.
 * @returns {void}
 */
const startLocalSyncInterval = () => {
  if (winState.syncIntervalId !== null) {
    return;
  }
  winState.syncIntervalId = setInterval(() => {
    syncPendingScores();
  }, SYNC_INTERVAL_MS);
};

/**
 * Stops the periodic background sync timer.
 * @returns {void}
 */
const stopLocalSyncInterval = () => {
  if (winState.syncIntervalId !== null) {
    clearInterval(winState.syncIntervalId);
    winState.syncIntervalId = null;
  }
};

/**
 * Attempts to upload all locally queued scores and updates storage.
 * @returns {Promise<void>}
 */
const syncPendingScores = async () => {
  const pendingList = getLocalPendingScores();
  if (pendingList.length === 0) {
    stopLocalSyncInterval();
    return;
  }
  const remaining = await sendPendingScoreBatch(pendingList);
  updatePendingStorage(remaining);
};

/**
 * Posts each pending score sequentially and collects any failed uploads.
 * @param {Array<Object>} pendingList - Pending score payloads.
 * @returns {Promise<Array<Object>>} Payloads that still failed to sync.
 */
const sendPendingScoreBatch = async (pendingList) => {
  const remaining = [];
  for (let i = 0; i < pendingList.length; i++) {
    const success = await postHighscoreData(pendingList[i]);
    if (!success) {
      remaining.push(pendingList[i]);
    }
  }
  return remaining;
};

/**
 * Clears or updates localStorage depending on remaining unsynced scores.
 * @param {Array<Object>} remaining - Scores still awaiting upload.
 * @returns {void}
 */
const updatePendingStorage = (remaining) => {
  if (remaining.length === 0) {
    localStorage.removeItem(LOCAL_SYNC_KEY);
    stopLocalSyncInterval();
  } else {
    localStorage.setItem(LOCAL_SYNC_KEY, JSON.stringify(remaining));
  }
};

/**
 * Starts offline score synchronization on application startup if items are queued.
 * @returns {void}
 */
const initPendingSyncOnLoad = () => {
  const pendingList = getLocalPendingScores();
  if (pendingList.length > 0) {
    startLocalSyncInterval();
  }
};
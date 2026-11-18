

const winState = {
  summary: null,
  pendingPayload: null,
  syncIntervalId: null
};

const calculateWinSummary = (winStats) => {
  const healthBonus = Math.round(1000 * (winStats.health / 100));
  const coinBonus = winStats.coins * 50;
  const bottleBonus = winStats.bottles * 100;
  const totalScore = winStats.score + healthBonus + coinBonus + bottleBonus;
  winState.summary = buildSummaryObject(winStats, healthBonus, coinBonus, bottleBonus, totalScore);
};

const buildSummaryObject = (stats, healthBonus, coinBonus, bottleBonus, totalScore) => {
  return {
    health: stats.health,
    healthBonus: healthBonus,
    coins: stats.coins,
    coinBonus: coinBonus,
    bottles: stats.bottles,
    bottleBonus: bottleBonus,
    baseScore: stats.score,
    totalScore: totalScore
  };
};

const sendPostRequest = async (payload) => {
  return await fetch(HIGHSCORE_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
};

const postHighscoreData = async (payload) => {
  try {
    const response = await sendPostRequest(payload);
    return response.ok && response.status === 200;
  } catch (error) {
    return false;
  }
};

const sendGetRequest = async () => {
  return await fetch(HIGHSCORE_API_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
};

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

const sortHighscoresDescending = (scores) => {
  scores.sort((a, b) => {
    return b.score - a.score;
  });
  return scores;
};

const sliceTopScores = (scores, limit) => {
  const topList = [];
  const maxCount = Math.min(scores.length, limit);
  for (let i = 0; i < maxCount; i++) {
    topList.push(scores[i]);
  }
  return topList;
};

const prepareHighscoreList = (rawData) => {
  const extracted = extractHighscoreArray(rawData);
  const sorted = sortHighscoresDescending(extracted);
  return sliceTopScores(sorted, 10);
};

const getLocalPendingScores = () => {
  const rawData = localStorage.getItem(LOCAL_SYNC_KEY);
  if (!rawData) {
    return [];
  }
  return JSON.parse(rawData);
};

const saveScoreLocally = (payload) => {
  const pendingList = getLocalPendingScores();
  pendingList.push(payload);
  localStorage.setItem(LOCAL_SYNC_KEY, JSON.stringify(pendingList));
};

const startLocalSyncInterval = () => {
  if (winState.syncIntervalId !== null) {
    return;
  }
  winState.syncIntervalId = setInterval(() => {
    syncPendingScores();
  }, SYNC_INTERVAL_MS);
};

const stopLocalSyncInterval = () => {
  if (winState.syncIntervalId !== null) {
    clearInterval(winState.syncIntervalId);
    winState.syncIntervalId = null;
  }
};

const syncPendingScores = async () => {
  const pendingList = getLocalPendingScores();
  if (pendingList.length === 0) {
    stopLocalSyncInterval();
    return;
  }
  const remaining = await sendPendingScoreBatch(pendingList);
  updatePendingStorage(remaining);
};

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

const updatePendingStorage = (remaining) => {
  if (remaining.length === 0) {
    localStorage.removeItem(LOCAL_SYNC_KEY);
    stopLocalSyncInterval();
  } else {
    localStorage.setItem(LOCAL_SYNC_KEY, JSON.stringify(remaining));
  }
};

const initPendingSyncOnLoad = () => {
  const pendingList = getLocalPendingScores();
  if (pendingList.length > 0) {
    startLocalSyncInterval();
  }
};
/**
 * Steuert das Pause-Menü (Frame 4) über das CSS-DOM-Overlay.
 */
class PausePopup {
  /**
   * Initialisiert das Pause-Popup und registriert die globale Referenz.
   * @param {Object} engine - Referenz auf die laufende GameEngine.
   */
  constructor(engine) {
    this.engine = engine;
    this.isOpen = false;
    this.overlayElement = document.getElementById("pause-overlay");
    window.pausePopup = this;
  }

  /**
   * Blendet das Pause-Overlay im DOM ein (O2).
   */
  showOverlay() {
    if (this.overlayElement) {
      this.overlayElement.classList.remove("d-none");
    }
  }

  /**
   * Blendet das Pause-Overlay im DOM aus.
   */
  hideOverlay() {
    if (this.overlayElement) {
      this.overlayElement.classList.add("d-none");
    }
  }

  /**
   * Prüft die Escape-Taste zum Öffnen oder Schließen der Pause (i1).
   * @param {string} key - Der gedrückte Tastenname.
   */
  handleKeyDown(key) {
    if (key === "Escape") {
      this.togglePause();
    }
  }

  /**
   * Schaltet zwischen Pause und Spiel um, wenn kein anderes Popup offen ist.
   */
  togglePause() {
    if (this.isAnotherPopupOpen()) {
      return;
    }
    if (this.isOpen) {
      this.resumeGame();
    } else {
      this.openPause();
    }
  }

  /**
   * Prüft, ob aktuell this.startHelp oder this.bossDossier geöffnet ist.
   * @returns {boolean} True, wenn ein anderes Overlay aktiv ist.
   */
  isAnotherPopupOpen() {
    const helpOpen = this.engine.startHelp && this.engine.startHelp.isOpen;
    const bossOpen = this.engine.bossDossier && this.engine.bossDossier.isOpen;
    return Boolean(helpOpen || bossOpen);
  }

  /**
   * Pausiert den Spiel-Algorithmus und startet das CSS-Overlay (O1 -> O2).
   */
  openPause() {
    this.isOpen = true;
    this.engine.isPaused = true;
    this.showOverlay();
  }

  /**
   * Zweig 2a: Schließt das Pause-Menü und setzt den Spiel-Algorithmus fort (O1).
   */
  resumeGame() {
    this.isOpen = false;
    this.engine.isPaused = false;
    this.engine.lastBossTick = performance.now();
    this.hideOverlay();
    if (document.activeElement) {
      document.activeElement.blur();
    }
  }

  /**
   * Zweig 2b (ja): Schließt Frame 4 und zeigt this.startHelp erneut an (O2).
   */
  openHelp() {
    this.isOpen = false;
    this.hideOverlay();
    if (this.engine.startHelp) {
      this.engine.startHelp.openPopup();
    }
  }

  /**
   * Zweig 2c (sonst): Beendet den Lauf und kehrt zurück zu Frame 2 (Menü Start).
   */
  exitToMenu() {
    this.isOpen = false;
    this.engine.isPaused = true;
    this.hideOverlay();
    returnToFrame2FromGame();
  }
}

/**
 * Globale Inline-Funktion für den Klick/Touch auf "Resume" (Zweig 2a).
 */
function resumeGameFromDom() {
  if (window.pausePopup) {
    window.pausePopup.resumeGame();
  }
}

/**
 * Globale Inline-Funktion für den Klick/Touch auf "Help" (Zweig 2b).
 */
function openHelpFromPauseDom() {
  if (window.pausePopup) {
    window.pausePopup.openHelp();
  }
}

/**
 * Globale Inline-Funktion für den Klick/Touch auf "Exit" (Zweig 2c).
 */
function exitToMenuFromPauseDom() {
  if (window.pausePopup) {
    window.pausePopup.exitToMenu();
  }
}

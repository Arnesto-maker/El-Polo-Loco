# 🐔 El Pollo Loco – Tactical Edition

A modular, object-oriented 2D tactical Jump-and-Run game built entirely with **Pure Vanilla JavaScript**, **HTML5 Canvas**, **Web Audio API**, and **CSS3** — engineered for smooth cross-device gameplay on both desktop and mobile browsers without external frameworks or audio assets.

---

## 🚀 Features & Highlights

- **Frame-Rate-Independent `dt` Physics Engine:** Delta-time (`dt`) game loop with midpoint gravity integration ensures identical movement speed, jump arcs, and animation pacing across 60 Hz, 120 Hz, and high-refresh-rate desktop or mobile displays.
- **Procedural Web Audio API Engine:** Zero external audio files required. Synthesizes dynamic background music and 10 custom sound effects (jump, throw, coin chime, bottle clink, stomp, splash, hurt, boss impact, win fanfare, game over) in real time, with strict autoplay-policy compliance and zero console warnings.
- **Tactical Endboss Combat:** Multi-phase boss encounter featuring a 100-point armor shield, vertical hit-zone damage scaling (`20 / 10 / 5 / 2`), 3-back-hit counter turnaround AI, and escalating 8-second rage-mode bullet-hell salvos.
- **Live Coin-to-Bottle Economy:** Collect sine-wave coin arcs and press `B` anytime to open the in-game Coin Converter (`2 Coins → 1 Salsa Bottle`).
- **Unified Input Controller:** Single `Controller` class handling desktop keyboard controls, translucent Mobile-Legends-inspired touch HUD buttons (`Tab`, `B`, `Space`, `Enter`), a horizontal touch slider with active red glow, and cancelable-guarded touch listeners for warning-free mobile play.
- **Smart Fullscreen & Portrait Lock Workflow:** Centralized Settings overlay (accessible from both Main Menu and Pause Menu) with live `fullscreenchange` synchronization, touch-only landscape orientation locking, and an automatic Portrait Lock overlay that safely pauses gameplay and resumes via the Pause Menu when rotated back to landscape.
- **Online & Offline Leaderboard:** Firebase REST API integration with an automatic `localStorage` offline fallback queue and periodic background sync.
- **Consistent `Tab` Navigation:** Unified `Tab` control for Pause and Back actions across all menus and overlays without browser focus interference.

---

## 🛠️ Engineering & Code Architecture

- **Pure Vanilla JS (Zero Dependencies):** No game engines, UI libraries, or audio frameworks.
- **Separation of Concerns:** Clear division between game engine, entity models, combat/collision managers, procedural audio, DOM rendering, templates, and persistence.
- **Strict Maintainability Standards:** Modular classes and concise, single-responsibility functions documented with JSDoc throughout the entire codebase.

---

## 🎮 Controls

| Action | Keyboard | Touch HUD (Landscape) |
| :--- | :--- | :--- |
| **Move Left / Right** | `A` / `D` or `ArrowLeft` / `ArrowRight` | Slide the bottom-left center circle left / right |
| **Jump** | `Space` | `Space` button (bottom-right) |
| **Throw Bottle / Confirm** | `Enter` | `Enter` button (above `Space`) |
| **Jump-Throw Combo** | `Space` + `Enter` | Hold/tap `Space` + `Enter` simultaneously |
| **Coin Converter** | `B` (adjust with `←` / `→`, confirm `Enter`) | `B` button + slide left/right + `Enter` |
| **Pause / Back** | `Tab` | `Tab` button (bottom-center) |

> **Mobile Tip:** Fullscreen mode unlocks the full arena and delivers the smoothest mobile experience — toggle it anytime via **Settings**.

---

## 🗂️ Project Structure

```text
el-pollo-loco/
├── index.html                                    # Viewport, overlays, Portrait Lock, Settings & Touch HUD
├── style.css                                     # Responsive dvw/dvh layout & Mobile Legends HUD
├── README.md                                     # Project documentation
└── assets/
    ├── fonts/                                    # PolloFont (Sancreek)
    ├── img/                                      # Sprites, statusbars, backgrounds & screens
    └── js/
        ├── main.js                               # App lifecycle, menu routing & global bootstrap
        ├── appFunctions/
        │   ├── firebaseConfig.js                 # API URL & sync constants
        │   ├── data.js                           # Score math, Firebase fetch & offline queue
        │   ├── settings.js                       # Sound, Fullscreen sync & Portrait Lock manager
        │   ├── sound.js                          # Web Audio API SFX synthesizer & gesture unlock
        │   ├── music.js                          # Dynamic procedural background music sequencer
        │   ├── render.js                         # DOM text injection & Settings button sync
        │   ├── template.js                       # Pure HTML overlay templates
        │   └── ui.js                             # Victory flow, validation & leaderboard UI
        └── models/
            ├── controller.class.js               # Unified Keyboard + Touch Slider/Buttons controller
            ├── movableObject.class.js            # dt-based physics, midpoint gravity & AABB hitboxes
            ├── drawableObject.class.js           # Base sprite loading & rendering
            ├── characterHealth.class.js          # Hero health, hurt thresholds & death sequence
            ├── character.class.js                # Hero movement, jumping, throwing & camera
            ├── bossCombat.class.js               # Boss armor, hit-zones & counter-AI
            ├── bossChicken.class.js              # Boss arena entry, patrol & salvo scheduler
            ├── bossHud.class.js                  # Boss health bar, armor & timer rendering
            ├── statusbar.class.js                # Player HUD & BossHud delegation
            ├── worldSpawner.class.js             # Enemy, sine-coin & ground-bottle spawning
            ├── world.class.js                    # Entity registry & Z-ordered frame packages
            ├── collisionManager.class.js         # Hit checks & expired entity cleanup
            ├── combatManager.class.js            # Bottle throws, boss activation & salvos
            ├── engine.class.js                   # dt requestAnimationFrame loop, pause & popup router
            ├── starthelpPopUp.class.js           # Start help overlay controller
            ├── bossDossierPopUp.class.js         # Boss tactical dossier controller
            ├── pausePopUp.class.js               # Pause menu overlay controller
            ├── coinConverter.class.js            # Canvas coin-to-bottle converter dialog
            ├── background.class.js               # Parallax layer sprite
            ├── backgroundPackage.class.js        # Dual-frame background & cloud package
            ├── cloud.class.js                    # Patrolling sky clouds
            ├── chicken.class.js                  # Patrolling chicken enemy
            ├── coin.class.js                     # Animated coin collectible
            ├── bottle.class.js                   # Ground salsa bottle collectible
            ├── throwableBottle.class.js          # Player projectile physics & splash
            └── bossBottle.class.js               # Boss salvo projectile physics & splash
```

---

## 💻 Local Setup

1. Clone the repository and open the project folder in VS Code (or your preferred IDE).
2. Serve `index.html` using a local development server (e.g., **VS Code Live Server** on `http://localhost:5500`).
3. For mobile testing over USB, forward the local port via `adb reverse tcp:5500 tcp:5500` and open `http://localhost:5500` directly in Chrome Mobile.
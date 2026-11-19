# 🐔 El Pollo Loco – Tactical Edition

A modular, object-oriented 2D tactical Jump-and-Run game built with Pure Vanilla JavaScript, HTML5 Canvas, and CSS3.

---

## 🚀 Features & Highlights

- **Unified Input Controller:** Single `Controller` class managing desktop keyboard input, translucent Mobile-Legends-inspired touch HUD buttons (`Tab`, `B`, `Space`, `Enter`), and a horizontal touch slider with active red glow.
- **Tactical Endboss Combat:** 100-point armor shield absorption, vertical hit-zone damage scaling (`20 / 10 / 5 / 2`), 3-back-hit counter turnaround AI, and escalating 8-second rage-mode bullet-hell salvos.
- **Live Coin-to-Bottle Economy:** Collect sine-wave coin arcs and press `B` anytime to open the in-game Coin Converter (`2 Coins → 1 Salsa Bottle`).
- **Centralized Settings Overlay (Konstruktion 2a):** Accessible from both Main Menu and Pause Menu to toggle **Sound (`on/off`)** and **Fullscreen + Landscape Lock (`on/off`)**.
- **Online & Offline Leaderboard:** Firebase REST integration with automatic `localStorage` fallback queue and periodic background sync.
- **Consistent `Tab` Navigation:** Unified `Tab` control for Pause and Back actions across all menus and overlays without browser focus interference.

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

---

## 🗂️ Project Structure

```text
el-pollo-loco/
├── index.html                                    # Viewport, overlays, Settings & Touch HUD
├── style.css                                     # Responsive dvw/dvh layout & Mobile Legends HUD
├── README.md                                     # Project documentation
└── assets/
    ├── fonts/                                    # PolloFont (Sancreek)
    ├── img/                                      # Sprites, statusbars, backgrounds & screens
    └── js/
        ├── main.js                               # App lifecycle, menu routing & Settings state
        ├── appFunctions/
        │   ├── firebaseConfig.js                 # API URL & sync constants
        │   ├── data.js                           # Score math, Firebase fetch & offline queue
        │   ├── render.js                         # DOM text injection & Settings button sync
        │   ├── template.js                       # Pure HTML overlay templates
        │   └── ui.js                             # Victory flow, validation & leaderboard UI
        └── models/
            ├── controller.class.js               # Unified Keyboard + Touch Slider/Buttons controller
            ├── movableObject.class.js            # Base physics, gravity & AABB hitboxes
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
            ├── engine.class.js                   # 60 FPS requestAnimationFrame loop & popup router
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
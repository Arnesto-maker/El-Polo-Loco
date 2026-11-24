# El Pollo Loco – Tactical Edition

A tactical 2D jump-and-run action game set in the scorching Mexican desert. Step into the boots of **Pepe**, manage your salsa bottle economy on the fly, and survive a multi-phase boss battle against the ultimate feathered nightmare.

---

## Gameplay & Features

- **Tactical Boss Combat:** Break through the Endboss's **100-point armor shield** before you can deal direct health damage.
- **Vertical Hit-Zones & Jump-Throw Combo:** Combine jumping and throwing (`Space` + `Enter`) to strike critical zones for increased damage.
- **Adaptive Boss Behavior:** Watch your positioning—three back-hits trigger an instant turnaround counterattack.
- **Escalating Rage Phase:** Once the boss's armor shatters, prepare to dodge repeating 8-second bottle salvo barrages.
- **Live Resource Economy (Coin Converter):** Collect coins across the desert and press `B` mid-battle to trade **2 Coins for 1 Salsa Bottle** whenever ammo runs low.
- **Online Highscore Leaderboard:** Compete for the top score with Firebase Realtime Database integration and automatic local fallback when offline.
- **Synthesized Audio & Dynamic Music:** Sound effects and reactive background tracks (Menu, Level, Boss) generated locally via the Web Audio API, with persistent mute and fullscreen settings.
- **Cross-Platform & Mobile Ready:** Full keyboard support for desktop plus a dedicated responsive Touch HUD (directional slider and action buttons), fullscreen mode, and automatic portrait-to-landscape orientation lock.
- **Accessible by Design (WCAG 2.1 AA):** Full keyboard navigation, skip link, high-contrast focus outlines, ARIA live status updates, `prefers-reduced-motion` support, minimum 16px typography, and 44×44px touch targets.

---

## Controls

### Keyboard

| Key | Action |
| :--- | :--- |
| `A` / `D` or `←` / `→` | Move Pepe |
| `Space` | Jump |
| `Enter` | Throw Salsa Bottle |
| `Space` + `Enter` | Jump-Throw Combo (Critical Damage) |
| `B` | Open Coin Converter / Buy Bottle (2 Coins) |
| `Tab` | Pause / Back |

### Touch HUD (Tablets & Smartphones)

| Control | Action |
| :--- | :--- |
| `◀ ● ▶` Slider | Slide to Move |
| `Space` | Jump |
| `Enter` | Throw Salsa Bottle |
| `B` | Buy Bottle (2 Coins) |
| `Tab` | Pause / Back |

> **Mobile Tip:** Enable **Fullscreen** inside the in-game **Settings** menu for the best handheld experience.

---

## Project Structure

```text
el-pollo-loco/
├── index.html
├── css/
│   ├── main-css-style.css
│   ├── menu-start-style.css
│   ├── modals-overlays-style.css
│   ├── help-controls-style.css
│   ├── endscreen-win-style.css
│   ├── highscore-form-style.css
│   └── exotic-responsive-style.css
└── assets/
    ├── fonts/
    ├── img/
    └── js/
        ├── main.js
        ├── appFunctions/
        └── models/
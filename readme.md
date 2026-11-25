<div align="center">

<img src="assets/img/9_intro_outro_screens/start/startscreen_1.png" alt="El Pollo Loco – Tactical Edition Banner" width="85%" />

# 🌵🌶️ EL POLLO LOCO – TACTICAL EDITION 🐔🔥

**Survive the scorching Mexican desert, master the live Salsa Economy, and bring down the ultimate feathered nightmare!**

<p>
  <img src="https://img.shields.io/badge/HTML5-Canvas_2D-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5 Canvas" />
  <img src="https://img.shields.io/badge/CSS3-Responsive_UI-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-Vanilla_ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="Vanilla JS" />
  <img src="https://img.shields.io/badge/Audio-Web_Audio_API-FF5722?style=for-the-badge&logo=audiomack&logoColor=white" alt="Web Audio API" />
  <img src="https://img.shields.io/badge/Leaderboard-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Accessibility-WCAG_2.1_AA-2E7D32?style=for-the-badge&logo=w3c&logoColor=white" alt="WCAG 2.1 AA" />
  <img src="https://img.shields.io/badge/Controls-Desktop_%26_Touch-7B1FA2?style=for-the-badge&logo=gamepad&logoColor=white" alt="Desktop and Touch" />
</p>

</div>

---

## 🎯 What Makes It Tactical?

<table>
  <tr>
    <td align="center" width="25%">
      <img src="assets/img/2_character_pepe/1_idle/idle/I-1.png" height="90" alt="Pepe" /><br />
      <strong>🤠 Play as Pepe</strong><br />
      <sub>Fluid jumping, stomping, and mid-air Jump-Throw combos across a dynamic desert stage.</sub>
    </td>
    <td align="center" width="25%">
      <img src="assets/img/7_statusbars/2_statusbar_endboss/green/green100.png" height="42" alt="Boss Health" /><br /><br />
      <strong>🛡️ 100-Point Boss Armor</strong><br />
      <sub>Break the Endboss's armor shield first—and watch out for 3-hit backstab counters!</sub>
    </td>
    <td align="center" width="25%">
      <img src="assets/img/7_statusbars/3_icons/icon_coin.png" height="55" alt="Coins" />
      <img src="assets/img/7_statusbars/3_icons/icon_salsa_bottle.png" height="65" alt="Salsa Bottle" /><br />
      <strong>🪙 Live Coin Economy</strong><br />
      <sub>Out of ammo mid-fight? Press <kbd>B</kbd> to trade 2 Coins for a fresh Salsa Bottle!</sub>
    </td>
    <td align="center" width="25%">
      <img src="assets/img/6_salsa_bottle/salsa_bottle.png" height="80" alt="Bullet Hell Salvos" /><br />
      <strong>🔥 Rage Mode Salvos</strong><br />
      <sub>Once the armor shatters, dodge escalating 8-second bottle-hell barrages to win.</sub>
    </td>
  </tr>
</table>

---

## ⚔️ Boss Battle Flow

```mermaid
flowchart LR
    A["🌵 Desert Run<br/>Defeat Chickens & Collect Coins"] --> B["📋 Boss Dossier<br/>Endboss Awakens"]
    B --> C["🛡️ Phase 1: Armor Shield<br/>100 Armor Points"]
    C -->|"Jump-Throw Combo 💥"| C
    C -->|"3 Back-Hits ⚠️"| D["🔄 Instant Turnaround<br/>Counterattack!"]
    D --> C
    C -->|"Armor = 0 🔓"| E["🔥 Phase 2: Rage Mode<br/>8s Bottle-Hell Salvos"]
    E -->|"Health = 0 🏆"| F["🎉 Victory &<br/>Global Highscore"]

    style A fill:#ee8a45,stroke:#000,stroke-width:2px,color:#000
    style B fill:#ffeb3b,stroke:#000,stroke-width:2px,color:#000
    style C fill:#1565c0,stroke:#000,stroke-width:2px,color:#fff
    style D fill:#ff6f00,stroke:#000,stroke-width:2px,color:#fff
    style E fill:#c62828,stroke:#000,stroke-width:2px,color:#fff
    style F fill:#2e7d32,stroke:#000,stroke-width:2px,color:#fff
```

---

## 🪙 Live Coin-to-Ammo Converter

<div align="center">

<img src="assets/img/7_statusbars/3_icons/icon_coin.png" height="40" alt="Coin" />
<img src="assets/img/7_statusbars/3_icons/icon_coin.png" height="40" alt="Coin" />
&nbsp;&nbsp; ➔ &nbsp;&nbsp; <kbd>B</kbd> &nbsp;&nbsp; ➔ &nbsp;&nbsp;
<img src="assets/img/7_statusbars/3_icons/icon_salsa_bottle.png" height="48" alt="Salsa Bottle" />

*Never get caught empty-handed—convert collected desert coins into fiery salsa bottles right in the heat of battle!*

</div>

---

## 🎮 Controls

<table>
  <tr>
    <th width="50%">⌨️ Desktop Keyboard</th>
    <th width="50%">📱 Mobile & Tablet Touch HUD</th>
  </tr>
  <tr>
    <td valign="top">
      <table>
        <tr><td><kbd>A</kbd> <kbd>D</kbd> / <kbd>←</kbd> <kbd>→</kbd></td><td>🏃 Move Pepe</td></tr>
        <tr><td><kbd>Space</kbd></td><td>🦘 Jump</td></tr>
        <tr><td><kbd>Enter</kbd></td><td>🍾 Throw Salsa Bottle</td></tr>
        <tr><td><kbd>Space</kbd> + <kbd>Enter</kbd></td><td>💥 <strong>Jump-Throw Combo</strong> (Crit!)</td></tr>
        <tr><td><kbd>B</kbd></td><td>🪙 Buy Bottle (2 Coins)</td></tr>
        <tr><td><kbd>Tab</kbd></td><td>⏸️ Pause / Back</td></tr>
      </table>
    </td>
    <td valign="top">
      <table>
        <tr><td>🔴 <code>◀ ● ▶</code> Slider</td><td>🏃 Slide to Move</td></tr>
        <tr><td>🟢 <code>Space</code> Button</td><td>🦘 Jump</td></tr>
        <tr><td>🔵 <code>Enter</code> Button</td><td>🍾 Throw Salsa Bottle</td></tr>
        <tr><td>🟢 + 🔵 Multi-Touch</td><td>💥 <strong>Jump-Throw Combo</strong> (Crit!)</td></tr>
        <tr><td>🟡 <code>B</code> Button</td><td>🪙 Buy Bottle (2 Coins)</td></tr>
        <tr><td>⚪ <code>Tab</code> Button</td><td>⏸️ Pause / Back</td></tr>
      </table>
    </td>
  </tr>
</table>

> 💡 **Pro Tip:** On smartphones and tablets, enable **Fullscreen Mode** inside **Settings** for an edge-to-edge arcade experience!

---

## ✨ Key Highlights

- 🎵 **100% Synthesized Web Audio:** Procedural SFX and adaptive music tracks (*Menu*, *Desert Level*, *Boss Battle*) with persistent mute settings.
- 🌍 **Global Highscore Leaderboard:** Powered by **Firebase Realtime Database**, including automatic offline fallback so no victory score is ever lost.
- 📱 **Adaptive Multi-Screen Support:** Seamlessly scales across ultrawide desktops, tablets, smartphones, and compact landscape viewports—complete with a portrait orientation lock screen.
- ♿ **Accessible by Design (WCAG 2.1 AA):** Full keyboard navigation, skip link, high-contrast focus outlines, ARIA live regions, `prefers-reduced-motion` support, minimum `16px` typography, and `44×44px` touch targets.

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone [https://github.com/](https://github.com/)<your-username>/el-pollo-loco.git
   cd el-pollo-loco
   ```

2. **Launch a local server** *(VS Code Live Server or `npx`)*
   ```bash
   npx serve .
   ```

3. **Play!**
   Open `http://127.0.0.1:5500/index.html` in your browser and hit **New game**.

> 🔧 *Optional: Want your own leaderboard? Simply update the database URL in `js/appFunctions/firebaseConfig.js`.*

---

<details>
<summary>📂 <strong>Click to view Project Structure</strong></summary>

```text
el-pollo-loco/
├── index.html
├── readme.md
├── assets/
│   ├── fonts/
│   └── img/
├── style/
│   ├── main-css-style.css
│   ├── menu-start-style.css
│   ├── modals-overlays-style.css
│   ├── help-controls-style.css
│   ├── endscreen-win-style.css
│   ├── highscore-form-style.css
│   └── exotic-responsive-style.css
└── js/
    ├── main.js
    ├── appFunctions/
    ├── boss/
    ├── core/
    ├── enemy/
    ├── engine/
    ├── hud/
    ├── input/
    ├── items/
    ├── player/
    └── world/
```

</details>

---

## 🏆 Credits & Attribution

<div align="center">

<img src="assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png" height="36" alt="Full Health" />

**Created by Arnesto** as a portfolio project for **Developer Akademie**  
*Visual image assets provided by Developer Akademie GmbH • All sound effects & music synthesized locally via Web Audio API*

</div>
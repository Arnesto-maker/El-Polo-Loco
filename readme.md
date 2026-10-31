# 🐔 El Polo Loco

An object-oriented 2D Jump-and-Run game built with modern JavaScript (ES6+), HTML5 Canvas, and a custom loop engine.

---

## 🚀 Features & Highlights

* **Object-Oriented Architecture:** Clean inheritance hierarchy based on an abstract `MovableObject` base class for characters, clouds, and backgrounds.
* **Performance-Optimized Loop Engine:** A centralized 60 FPS render loop (`requestAnimationFrame`) that synchronizes logic updates (`update()`) and drawing processes (`draw()`).
* **Dynamic Multi-Frame Camera System:** Fluid camera control that tracks the character across multiple level frames (Frame 1 & Frame 2) and intelligently locks at the boundaries.
* **Realistic Physics & Jump Sequences:** Gravity and jump calculations dependent on vertical velocity ($\vec{v}_g$), maximum jump height ($y_{max}$), and clear sequence separation (preventing the "jetpack effect").
* **Parallax & Patrol Mechanics:** Background and cloud elements with automatic directional changes ($\vec{v}$ / $-\vec{v}$) across defined boundaries.
* **Responsive 16:9 Layout:** Scales cleanly based on an internal resolution of 1920x1080 pixels.

---

## 🛠️ Tech Stack

* **JavaScript (ES6 Modules):** Class-based logic, event listeners, and state management.
* **HTML5 Canvas API:** Direct rendering of sprites and backgrounds.
* **CSS3:** Responsive layout using modern units (`clamp()`, `aspect-ratio`).

---

## 🗂️ Project Structure

```text
el-polo-loco/
│
├── js/
│   ├── models/
│   │   ├── movable-object.class.js   # Abstract base class for physics & images
│   │   ├── character.class.js        # Player logic, animations & camera control
│   │   ├── cloud.class.js            # Cloud objects with patrol logic
│   │   └── background.class.js       # Background layers for Frame 1 & 2
│   ├── levels/
│   │   └── background-package.js     # Initialization of level components
│   ├── models/controller.class.js    # Keyboard controls (WASD & Space)
│   └── models/loop-engine.class.js   # Central game loop (render & update)
│
├── assets/
│   └── img/                          # Graphics, backgrounds & sprites
│
├── index.html                        # Main HTML with canvas container
└── style.css                         # Layout & scaling styles
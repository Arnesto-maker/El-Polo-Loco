# 🐔 El Polo Loco

Ein objektorientiertes 2D-Jump-and-Run-Spiel, entwickelt mit modernem JavaScript (ES6+), HTML5 Canvas und einer eigens konzipierten Loop-Engine.

---

## 🚀 Features & Highlights

* **Objektorientierte Architektur:** Saubere Vererbungshierarchie basierend auf einer abstrakten `MovableObject`-Basisklasse für Charaktere, Wolken und Hintergründe.
* **Performance-optimierte Loop-Engine:** Ein zentraler 60-FPS-Render-Loop (`requestAnimationFrame`), der Logik-Updates (`update()`) und Zeichenprozesse (`draw()`) synchronisiert.
* **Dynamisches Multi-Frame-Kamerasystem:** Eine flüssige Kamera-Steuerung, die den Charakter über mehrere Level-Frames (Frame 1 & Frame 2) hinweg begleitet und an den Rändern intelligent abriegelt.
* **Realistische Physik & Sprungsequenzen:** Gravitations- und Sprungberechnung in Abhängigkeit von vertikaler Geschwindigkeit ($\vec{v}_g$), maximaler Sprunghöhe ($y_{max}$) und einer klaren Sequenz-Trennung (Verhinderung des „Jetpack-Effekts“).
* **Parallax- & Patrouillen-Mechaniken:** Hintergrund- und Wolkenelemente mit automatischen Richtungswechseln ($\vec{v}$ / $-\vec{v}$) über definierte Grenzen.
* **Responsives 16:9-Layout:** Skaliert sauber auf Basis einer internen Auflösung von 1920x1080 Pixeln.

---

## 🛠️ Tech Stack

* **JavaScript (ES6 Modules):** Klassenbasierte Logik, Event-Listener und Zustandsverwaltung.
* **HTML5 Canvas API:** Direktes Zeichnen von Sprites und Hintergründen.
* **CSS3:** Responsives Layout mit modernen Einheiten (`clamp()`, `aspect-ratio`).

---

## 🗂️ Projektstruktur

```text
el-polo-loco/
│
├── js/
│   ├── models/
│   │   ├── movable-object.class.js   # Abstrakte Basisklasse für Physik & Bilder
│   │   ├── character.class.js        # Spieler-Logik, Animationen & Kamera-Control
│   │   ├── cloud.class.js            # Wolken-Objekte mit Patrouillen-Logik
│   │   └── background.class.js       # Hintergrund-Layer für Frame 1 & 2
│   ├── levels/
│   │   └── background-package.js     # Initialisierung der Level-Komponenten
│   ├── models/controller.class.js    # Tastatur-Steuerung (WASD & Space)
│   └── models/loop-engine.class.js   # Zentrale Spielschleife (Render & Update)
│
├── assets/
│   └── img/                          # Grafiken, Hintergründe & Sprites
│
├── index.html                        # Haupt-HTML mit Canvas-Container
└── style.css                         # Layout & Skalierungs-Styles
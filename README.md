# Kevin Stev Bayer — Engineering Portfolio

A lightweight, high-performance static portfolio built to showcase robotics simulations, embedded systems projects, and mechatronics engineering coursework. 

Live Site: [https://kevinstevbayer.github.io/portfolio/](https://kevinstevbayer.github.io/portfolio/)

## 🏗 Architecture

This portfolio uses a completely custom, zero-dependency data architecture. It replicates the functionality of a headless CMS without any external APIs, databases, or build steps (No Node.js, Webpack, or npm required).

* **Frontend:** Vanilla HTML, CSS, and JavaScript.
* **Data Layer:** All content (skills, journey, projects, certifications) is stored in a single `portfolio.json` file.
* **Rendering:** A modular `renderer.js` script fetches the JSON asynchronously on page load and dynamically hydrates the DOM elements.
* **Hosting:** GitHub Pages.

## 📝 How to Update Content

The HTML and JS files never need to be touched. To add a new project, certification, or academic milestone, simply edit the single source of truth:

1. Open `data/portfolio.json`.
2. Add or modify the relevant JSON object.
3. Commit and push the changes. 
4. The JavaScript renderer will automatically build the new UI components, handle status badge coloring, and update grid layouts.

Refer to `data/SCHEMA.md` for a complete breakdown of available fields and rendering logic.

## 📁 Repository Structure

```text
├── index.html           # Main entry point and layout shell
├── data/
│   ├── portfolio.json   # Centralized data layer (Content goes here)
│   ├── renderer.js      # Vanilla JS DOM hydration engine
│   └── SCHEMA.md        # Documentation for JSON fields
└── assets/
    ├── images/          # Local image assets
    └── videos/          # Local video assets

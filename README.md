# Kevin Stev Bayer | Mechatronics Engineering Portfolio

[![Live Site](https://img.shields.io/badge/Live_Site-View_Portfolio-06b6d4?style=for-the-badge)](https://kevinstevbayer.github.io/portfolio/)
[![Sanity CMS](https://img.shields.io/badge/Backend-Sanity_Studio-f53636?style=for-the-badge)](https://kevin-portfolio.sanity.studio/)

Welcome to the source code for my professional mechatronics and robotics portfolio. This repository houses a lightweight, high-performance static website designed to showcase hardware builds, automation systems, and engineering projects to potential startup investors and collaborators.

## 🏗️ Architecture

The portfolio utilizes a decoupled architecture, separating the front-end presentation from back-end content management. This ensures maximum speed, zero server maintenance, and an incredibly easy publishing workflow for new hardware projects.

* **Frontend:** Vanilla HTML, CSS, and JavaScript. Hosted statically on **GitHub Pages**. Features custom UI elements like an interactive neural canvas background, custom cursor physics, and 3D tilt-effect project cards.
* **Backend / CMS:** **Sanity.io** (Headless CMS). Project data, descriptions, and media (images/videos) are stored on Sanity's global CDN.
* **Data Fetching:** The frontend fetches live project data directly from the Sanity Content Lake API on page load using native browser `fetch()`.

## ✨ Key Features

* **Dynamic Content:** Projects are pulled live from Sanity CMS, meaning the site updates instantly without requiring a code push or rebuild.
* **No Build Step:** Pure Vanilla JS and CSS for instant load times and zero dependency bloat.
* **Interactive UI:** Smooth scroll reveals, geometric animated avatars, and 3D card interactions built from scratch.
* **Responsive Design:** Fully optimized for mobile, tablet, and desktop viewing.

## 🛠️ Tech Stack

**Web Technologies:**
* HTML5 / CSS3 / Vanilla JavaScript
* [Sanity CMS](https://www.sanity.io/) (Content Management System)
* GitHub Pages (Hosting)
* [Web3Forms](https://web3forms.com/) (Static Contact Form Handling)

**Core Engineering Focus (Showcased Projects):**
* ROS2, Python, C++
* Embedded Systems (Arduino, Raspberry Pi)
* CAD / Mechanical Design (SolidWorks)
* Control Systems & Kinematics

## 🚀 Local Development

If you want to run the project locally or access the Sanity Studio source code:

### 1. Running the Frontend
Since the frontend is a single static file, you can simply open `index.html` in your browser. For the best experience (to avoid local CORS issues with the Sanity fetch), use a local server:
```bash
npx serve .
```
2. Running the Sanity Studio (Admin Dashboard)
The Sanity Studio configuration lives in the kevin-portfolio-studio directory.

Bash
# Navigate to the studio directory
cd kevin-portfolio-studio

# Install dependencies (if first time)
npm install

# Start the local development server
npm run dev
The studio will be available at http://localhost:3333.

📫 Contact & Links
Email: kevinstevbayer123@gmail.com

LinkedIn: Kevin Stev Bayer

Location: Chennai, Tamil Nadu, India

Built with passion and a lot of ☕ by Kevin Stev Bayer.

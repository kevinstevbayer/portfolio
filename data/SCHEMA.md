# KSB Portfolio — Data Schema Reference
> Every editable field in `data/portfolio.json`, documented in one place.
> **The only file you ever edit to update your portfolio is `portfolio.json`.**

---

## `about` — About Me Section

| Field | Type | Description |
|---|---|---|
| `name` | string | Full name — used in hero heading and footer |
| `tagline` | string | Short descriptor under the name |
| `bio_paragraphs` | string[] | Array of paragraphs for the right column. Add more as needed. |
| `location` | string | City, State, Country |
| `email` | string | Contact email — used in contact info and mailto links |
| `status` | string | Availability status text |
| `status_active` | boolean | `true` → green dot, `false` → grey |
| `media.type` | `"image"` \| `"video"` | **Switch this single field to toggle image vs. video** |
| `media.image_path` | string | Relative path from repo root, e.g. `assets/images/profile.jpg` |
| `media.image_alt` | string | Alt text for accessibility |
| `media.video_path` | string | Relative path to `.mp4` file |
| `media.video_poster_path` | string | Thumbnail shown before video loads |
| `media.video_autoplay` | boolean | Autoplay on load (always muted when `true`) |
| `media.video_loop` | boolean | Loop the video |
| `media.video_muted` | boolean | Mute audio (required by browsers for autoplay) |
| `media.caption` | string | Optional caption overlaid at the bottom of the media box |
| `socials[].label` | string | Displayed name |
| `socials[].url` | string | Full URL |
| `socials[].icon` | `"github"` \| `"linkedin"` | Maps to a built-in SVG icon |
| `tech_tags` | string[] | Chips shown in the tech cloud |

---

## `skills` — Skills Bento Grid

Each skill object has a `color_accent` that controls the card's theme.  
Available accents: `"purple"`, `"cyan"`, `"violet"`, `"green"`, `"amber"`.

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique ID, e.g. `"sk-python"` |
| `category` | string | Label chip at top of card |
| `name` | string | Large heading |
| `headline` | string | Secondary badge (e.g. "Primary Language") |
| `description` | string | Body text |
| `proficiency` | number (0–100) | Single bar fill percentage |
| `bars` | `[{label, value}]` | For multi-bar cards (overrides `proficiency`) |
| `tags` | string[] | Small tag chips |
| `tools` | string[] | Tool pills (used in the "Full Stack" card) |
| `code_snippet` | string | Optional monospace code block |
| `color_accent` | string | Accent colour theme |

---

## `projects` — Projects Section

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique ID, e.g. `"p-humanoid"` |
| `title` | string | Card and modal heading |
| `category` | string | Filter button label and card sub-heading |
| `status` | `"active"` \| `"complete"` \| `"upcoming"` | Controls badge colour |
| `status_label` | string | Human-readable status text |
| `color_hex` | string | Fallback SVG accent colour when no image present |
| `short_description` | string | Shown on the card |
| `full_description` | string | Shown in the modal |
| `highlights` | string[] | Bullet points in the modal |
| `tech_tags` | string[] | Shown on card and modal |
| `links.github` | string | GitHub repo URL (empty string `""` hides the button) |
| `links.video` | string | YouTube / Vimeo URL — shows YouTube-coloured button |
| `links.demo` | string | Live demo URL |
| `links.paper` | string | Paper / documentation URL |
| `media.type` | `"image"` \| `"video"` | Visual type for the card banner |
| `media.image_path` | string | Relative path, e.g. `assets/images/projects/foo.jpg` |
| `media.image_alt` | string | Alt text |
| `media.video_embed_url` | string | YouTube embed URL (reserved for future iframe embed) |
| `featured` | boolean | Reserved — for future "featured only" filter |
| `order` | number | Card render order (ascending) |

**To hide a link button:** set its value to `""` (empty string). The renderer skips empty strings automatically.

---

## `journey` — Timeline / Experience

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique ID |
| `role` | string | Heading — degree name or role title |
| `organisation` | string | University, company, or platform name |
| `location` | string | City, Country |
| `period` | string | Date range string, e.g. `"Aug 2024 — May 2028"` |
| `year_label` | string | Large ghost watermark number |
| `type` | `"education"` \| `"activity"` \| `"self-study"` | Controls badge styling AND whether item appears in Education grid |
| `type_badge` | string | Short label inside the badge pill |
| `status` | `"active"` \| `"complete"` | Status dot colour |
| `status_label` | string | Status text in card footer |
| `cgpa` | string | Optional — shown as green pill next to role title |
| `description` | string | Paragraph body text |
| `highlights` | `[{icon, text}]` | Bullet list — icon is an emoji |
| `metrics` | `[{value, label}]` | Stat pills below description |
| `skills` | string[] | Skill chips in card footer |

> **Education grid is auto-populated** from journey items where `type === "education"` — no separate array needed.

---

## `certifications` — Credentials Grid

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique ID |
| `name` | string | Certificate name |
| `issuer` | string | Issuing organisation |
| `year` | string | Year obtained |
| `score` | string | Grade, badge level, or `"In Progress"` |
| `icon` | string | Emoji for visual icon |
| `url` | string | Link to credential page |
| `category` | string | Tag shown in card footer |

If `score` contains the word "Progress", it renders in amber. Otherwise it renders in green.

---

## Media File Organisation

```
your-repo/
├── data/
│   ├── portfolio.json       ← The only file you ever edit
│   └── renderer.js          ← Never touch this
└── assets/
    ├── images/
    │   ├── profile.jpg               ← about.media.image_path
    │   ├── video-poster.jpg          ← about.media.video_poster_path
    │   └── projects/
    │       ├── humanoid-sim.jpg      ← projects[].media.image_path
    │       ├── tug-bot.jpg
    │       ├── kuka-arm.jpg
    │       ├── line-follower.jpg
    │       └── ros2-node.jpg
    └── videos/
        └── about-reel.mp4            ← about.media.video_path
```

**Recommended image dimensions:**
- Project cards: 800 × 400 px (2:1 ratio), JPEG at 80% quality ≈ 80–150 KB
- Profile photo: 640 × 640 px, JPEG at 85% quality ≈ 80–120 KB
- Video poster: same as profile photo dimensions

**Video recommendations:**
- Format: `.mp4` (H.264, AAC)
- Resolution: 720p is sufficient for the portrait container
- Duration: 10–30 seconds for autoplay reel
- Size: keep under 5 MB for GitHub Pages (use HandBrake to compress)

#!/usr/bin/env node
/**
 * KSB Portfolio — Data Validator
 * Run: node validate.js
 *
 * Catches structural errors in portfolio.data.js before they reach
 * the live site. Exit code 0 = clean, exit code 1 = errors found.
 */

import {
  ABOUT, SKILLS, PROJECTS, JOURNEY, CERTIFICATIONS, SITE_META
} from "./portfolio.data.js";

let errors = [];
let warnings = [];
let pass = 0;

function check(label, condition, message) {
  if (!condition) {
    errors.push(`  ✗ [${label}] ${message}`);
  } else {
    pass++;
  }
}

function warn(label, condition, message) {
  if (!condition) warnings.push(`  ⚠ [${label}] ${message}`);
}

// ─── ABOUT ────────────────────────────────────────────────────────
check("ABOUT", ["image", "video"].includes(ABOUT.media_type),
  `media_type must be "image" or "video", got "${ABOUT.media_type}"`);

if (ABOUT.media_type === "image") {
  check("ABOUT.profile_image", !!ABOUT.profile_image?.src,
    "profile_image.src is missing");
} else {
  check("ABOUT.profile_video", !!ABOUT.profile_video?.src,
    "profile_video.src is missing when media_type is 'video'");
}

check("ABOUT", Array.isArray(ABOUT.bio_paragraphs) && ABOUT.bio_paragraphs.length > 0,
  "bio_paragraphs must be a non-empty array");
check("ABOUT", Array.isArray(ABOUT.tech_stack) && ABOUT.tech_stack.length >= 3,
  "tech_stack must have at least 3 items");
check("ABOUT.meta", !!ABOUT.meta?.email, "meta.email is missing");

// ─── SKILLS ───────────────────────────────────────────────────────
check("SKILLS", Array.isArray(SKILLS) && SKILLS.length > 0, "SKILLS must be a non-empty array");
SKILLS.forEach((s, i) => {
  check(`SKILLS[${i}]`, !!s.id, "id is required");
  check(`SKILLS[${i}]`, !!s.title, "title is required");
  check(`SKILLS[${i}]`, ["hero", "wide", "normal"].includes(s.bento_size),
    `bento_size must be "hero"|"wide"|"normal", got "${s.bento_size}"`);
  if (s.proficiency !== null) {
    check(`SKILLS[${i}]`, s.proficiency >= 0 && s.proficiency <= 100,
      `proficiency must be 0–100, got ${s.proficiency}`);
  }
});

// ─── PROJECTS ─────────────────────────────────────────────────────
check("PROJECTS", Array.isArray(PROJECTS) && PROJECTS.length > 0, "PROJECTS must be a non-empty array");
PROJECTS.forEach((p, i) => {
  const ref = `PROJECTS[${i}] "${p.title}"`;
  check(ref, !!p.id, "id is required");
  check(ref, !!p.title, "title is required");
  check(ref, !!p.category, "category is required");
  check(ref, ["complete", "in-progress", "upcoming"].includes(p.status),
    `status must be "complete"|"in-progress"|"upcoming"`);
  check(ref, !!p.short && p.short.length >= 20,
    "short description must be at least 20 chars");
  check(ref, Array.isArray(p.highlights) && p.highlights.length >= 1,
    "highlights must have at least 1 item");
  check(ref, Array.isArray(p.tags) && p.tags.length >= 1,
    "tags must have at least 1 item");

  // Validate URLs if provided
  const urlFields = ["github_link", "video_link", "demo_link"];
  urlFields.forEach(field => {
    if (p[field] && p[field] !== null) {
      try {
        new URL(p[field]);
      } catch {
        errors.push(`  ✗ [${ref}] ${field} is not a valid URL: "${p[field]}"`);
      }
    }
  });

  warn(ref, !!p.github_link || !!p.video_link,
    "no github_link or video_link — consider adding at least one");
});

// ─── JOURNEY ──────────────────────────────────────────────────────
check("JOURNEY", Array.isArray(JOURNEY) && JOURNEY.length > 0, "JOURNEY must be a non-empty array");
JOURNEY.forEach((j, i) => {
  const ref = `JOURNEY[${i}] "${j.role}"`;
  check(ref, !!j.id, "id is required");
  check(ref, !!j.role, "role is required");
  check(ref, !!j.org, "org is required");
  check(ref, !!j.period, "period is required");
  check(ref, ["degree","internship","competition","project","self-study"].includes(j.type),
    `type must be "degree"|"internship"|"competition"|"project"|"self-study"`);
  check(ref, ["active","upcoming","complete"].includes(j.status),
    `status must be "active"|"upcoming"|"complete"`);
  check(ref, Array.isArray(j.bullets) && j.bullets.length >= 1,
    "bullets must have at least 1 item");
});

// ─── CERTIFICATIONS ───────────────────────────────────────────────
check("CERTIFICATIONS", Array.isArray(CERTIFICATIONS) && CERTIFICATIONS.length > 0,
  "CERTIFICATIONS must be a non-empty array");
CERTIFICATIONS.forEach((c, i) => {
  const ref = `CERTIFICATIONS[${i}] "${c.name}"`;
  check(ref, !!c.id, "id is required");
  check(ref, !!c.name, "name is required");
  check(ref, !!c.issuer, "issuer is required");
  check(ref, !!c.year, "year is required");
});

// ─── SITE META ────────────────────────────────────────────────────
check("SITE_META", !!SITE_META.name, "name is required");
check("SITE_META", !!SITE_META.cv_path, "cv_path is required");
check("SITE_META", Array.isArray(SITE_META.typewriter_roles) && SITE_META.typewriter_roles.length >= 2,
  "typewriter_roles must have at least 2 items");

// ─── REPORT ───────────────────────────────────────────────────────
console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("  KSB Portfolio — Data Validation Report");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

if (errors.length === 0 && warnings.length === 0) {
  console.log(`  ✓ All ${pass} checks passed. Safe to deploy.\n`);
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log(`  ERRORS (${errors.length}) — MUST FIX before deploying:\n`);
    errors.forEach(e => console.log(e));
    console.log();
  }
  if (warnings.length > 0) {
    console.log(`  WARNINGS (${warnings.length}) — Recommended improvements:\n`);
    warnings.forEach(w => console.log(w));
    console.log();
  }
  console.log(`  ${pass} checks passed, ${errors.length} errors, ${warnings.length} warnings.\n`);
  if (errors.length > 0) process.exit(1);
}

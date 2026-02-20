import fs from "node:fs";
import path from "node:path";

// console.log(process.argv);
// process.exit();

const INPUT = process.argv[2] ?? ".llms-full.txt";
const OUT_DIR = process.argv[3] ?? "out";
const HEADING = process.argv[4] ?? "##"; // "#", "##", "###", ...

function slugify(s) {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const md = fs.readFileSync(INPUT, "utf8");
fs.mkdirSync(OUT_DIR, { recursive: true });

const re = new RegExp(`^${HEADING}\\s+(.+?)\\s*$`, "gm");

let match;
let sections = [];
let lastIndex = 0;
let lastTitle = null;

while ((match = re.exec(md)) !== null) {
  const title = match[1].trim();
  const start = match.index;

  if (lastTitle !== null) {
    const content = md.slice(lastIndex, start).trimEnd();
    sections.push({ title: lastTitle, content });
  }

  lastTitle = title;
  lastIndex = start; // keep heading line in content
}

if (lastTitle !== null) {
  sections.push({ title: lastTitle, content: md.slice(lastIndex).trimEnd() });
} else {
  // No headings found: one file
  sections = [{ title: "index", content: md.trimEnd() }];
}

// Write files + index
const used = new Map(); // slug -> count
const indexLines = ["# Sommaire", ""];

for (const s of sections) {
  let slug = slugify(s.title) || "section";
  const n = (used.get(slug) ?? 0) + 1;
  used.set(slug, n);
  if (n > 1) slug = `${slug}-${n}`;

  const filename = `${slug}.md`;
  fs.writeFileSync(path.join(OUT_DIR, filename), s.content + "\n", "utf8");
  indexLines.push(`- [${s.title}](${filename})`);
}

fs.writeFileSync(path.join(OUT_DIR, "index.md"), indexLines.join("\n") + "\n", "utf8");

console.log(`Wrote ${sections.length} files to ${OUT_DIR}/`);

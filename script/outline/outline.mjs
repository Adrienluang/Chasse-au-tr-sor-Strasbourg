import fs from "node:fs";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node outline.mjs path/to/doc.md");
  process.exit(1);
}

const md = fs.readFileSync(file, "utf8");

// remark-parse -> AST mdast
const tree = unified().use(remarkParse).parse(md);

// Util: récupère le texte d'un heading (concat de textes)
function headingText(node) {
  let out = "";
  for (const child of node.children || []) {
    if (child.type === "text") out += child.value;
    // si tu as du inline code, emphasis, links, etc., tu peux étendre ici
    if (child.type === "inlineCode") out += "`" + child.value + "`";
  }
  return out.trim();
}

const headings = [];
visit(tree, "heading", (node) => {
  const depth = node.depth; // 1..6
  const text = headingText(node);
  const pos = node.position
    ? {
        start: node.position.start, // {line,column,offset}
        end: node.position.end,
      }
    : null;

  headings.push({ depth, text, position: pos });
});

// Build outline H1/H2/H3
const outline = [];
let currentH1 = null;
let currentH2 = null;

for (const h of headings) {
  if (h.depth === 1) {
    currentH1 = { title: h.text, position: h.position, h2: [] };
    outline.push(currentH1);
    currentH2 = null;
  } else if (h.depth === 2 && currentH1) {
    currentH2 = { title: h.text, position: h.position, h3: [] };
    currentH1.h2.push(currentH2);
  } else if (h.depth === 3 && currentH2) {
    currentH2.h3.push({ title: h.text, position: h.position });
  }
}

console.log(JSON.stringify({ file, outline }, null, 2));


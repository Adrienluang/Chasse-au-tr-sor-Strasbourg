import fs from "node:fs";
import path from "node:path";

function ensureDir(p) {
    fs.mkdirSync(p, { recursive: true });
}

function mdEscape(s) {
    return String(s ?? "").replace(/\|/g, "\\|");
}

function parseArg(flag, def = null) {
    const i = process.argv.indexOf(flag);
    if (i === -1) return def;
    const v = process.argv[i + 1];
    if (!v || v.startsWith("--")) return def;
    return v;
}

function hasFlag(flag) {
    return process.argv.includes(flag);
}

function renderFrontMatter(item, pdfName) {
    const pages =
        Number.isInteger(item.start_page) && Number.isInteger(item.end_page)
            ? `${item.start_page}-${item.end_page}`
            : Number.isInteger(item.start_page)
                ? `${item.start_page}`
                : `?`;

    return [
        "---",
        `id: ${item.id}`,
        `title: ${item.title}`,
        `level: ${item.level}`,
        `breadcrumb: ${item.breadcrumb}`,
        `pages_pdf: ${pages}`,
        `source_pdf: ${pdfName || "?"}`,
        `slug: ${item.slug}`,
        "---",
        "",
    ].join("\n");
}

function renderBodyTemplate(item, childrenImmediate = []) {
    const pagesLine =
        Number.isInteger(item.start_page) && Number.isInteger(item.end_page)
            ? `Pages PDF : **${item.start_page}–${item.end_page}**`
            : Number.isInteger(item.start_page)
                ? `Page PDF : **${item.start_page}**`
                : `Pages PDF : **?**`;

    const lines = [];
    lines.push(`# ${item.title}`);
    lines.push("");
    lines.push(`**Chemin :** ${item.breadcrumb}`);
    lines.push("");
    lines.push(pagesLine);
    lines.push("");
    lines.push("## Notes");
    lines.push("- (vide)");
    lines.push("");
    lines.push("## Contenu extrait");
    lines.push("<!-- Le texte extrait de cette section sera collé ici -->");
    lines.push("");

    if (childrenImmediate.length) {
        lines.push("## Sous-sections");
        for (const c of childrenImmediate) {
            const p =
                Number.isInteger(c.start_page) && Number.isInteger(c.end_page)
                    ? `p.${c.start_page}-${c.end_page}`
                    : Number.isInteger(c.start_page)
                        ? `p.${c.start_page}`
                        : `p.?`;
            lines.push(`- **${mdEscape(c.title)}** (${p}) \`id:${c.id}\``);
        }
        lines.push("");
    }

    return lines.join("\n");
}

function computeImmediateChildren(outline) {
    const childrenById = new Map();
    const stack = [];
    for (const it of outline) {
        while (stack.length && stack[stack.length - 1].level >= it.level) stack.pop();
        const parent = stack.length ? stack[stack.length - 1] : null;
        if (parent) {
            if (!childrenById.has(parent.id)) childrenById.set(parent.id, []);
            childrenById.get(parent.id).push(it);
        }
        stack.push(it);
    }
    return childrenById;
}

// Make a recursive path from breadcrumb_slugs, but keep it short-ish.
// Example: "12-adc/12-3-functional-description"
function sectionDirFromBreadcrumbSlugs(item, maxDepthDirs = 3) {
    const parts = String(item.breadcrumb_slugs || "").split("/").filter(Boolean);
    // Use up to maxDepthDirs-1 ancestor parts (exclude the final part which is the item itself)
    const ancestors = parts.slice(0, Math.max(0, parts.length - 1));
    const selected = ancestors.slice(0, maxDepthDirs);
    return selected.join("/");
}

function safeWrite(filePath, content, overwrite) {
    if (fs.existsSync(filePath) && !overwrite) return "skipped";
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content, "utf8");
    return fs.existsSync(filePath) && overwrite ? "updated" : "created";
}

function main() {
    const input = process.argv[2];
    const docsRoot = process.argv[3] || "docs";

    const overwrite = hasFlag("--overwrite");
    const maxLevel = Number(parseArg("--max-level", "2")); // default: only levels 1-2
    const recursive = hasFlag("--recursive");              // if set: use folders from breadcrumbs
    const maxDepthDirs = Number(parseArg("--max-depth-dirs", "3")); // limit folder nesting

    if (!input) {
        console.error("Usage: node generate-section-files-v2.mjs outline.preprocessed.json [docs] [--max-level 2] [--recursive] [--max-depth-dirs 3] [--overwrite]");
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(input, "utf8"));
    const outline = data.outline || [];
    const pdfName = data.pdf || null;

    if (!Array.isArray(outline) || outline.length === 0) {
        throw new Error("No outline entries found in input.");
    }

    const childrenById = computeImmediateChildren(outline);

    let created = 0, updated = 0, skipped = 0;

    for (const item of outline) {
        if (Number.isFinite(maxLevel) && item.level > maxLevel) continue;

        const childrenImmediate = childrenById.get(item.id) || [];
        const content = renderFrontMatter(item, pdfName) + renderBodyTemplate(item, childrenImmediate);

        const baseDir = path.join(docsRoot, "10_sections");
        const subDir = recursive ? sectionDirFromBreadcrumbSlugs(item, maxDepthDirs) : "";
        const filename = `${item.id}__${item.slug}.md`;
        const filePath = path.join(baseDir, subDir, filename);

        const status = safeWrite(filePath, content, overwrite);
        if (status === "created") created++;
        else if (status === "updated") updated++;
        else skipped++;
    }

    console.log("OK: section files generated");
    console.log(` - root: ${docsRoot}`);
    console.log(` - max-level: ${maxLevel}`);
    console.log(` - recursive dirs: ${recursive ? "yes" : "no"} (maxDepthDirs=${maxDepthDirs})`);
    console.log(` - created: ${created}`);
    console.log(` - updated: ${updated}`);
    console.log(` - skipped: ${skipped}`);
}

main();

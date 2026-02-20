import fs from "node:fs";
import path from "node:path";

function ensureDir(p) {
    fs.mkdirSync(p, { recursive: true });
}

function safeWriteFile(filePath, content) {
    if (fs.existsSync(filePath)) return false; // don't overwrite
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content, "utf8");
    return true;
}

function mdEscape(s) {
    return String(s ?? "").replace(/\|/g, "\\|");
}

function renderFrontMatter(item, pdfName) {
    // Simple "YAML-like" block (not strict YAML to avoid tooling issues)
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

/**
 * Build map: parentId -> immediate children
 * using the fact that outline is in reading order and levels.
 */
function computeImmediateChildren(outline) {
    const childrenById = new Map();
    const stack = []; // stack of items

    for (const it of outline) {
        while (stack.length && stack[stack.length - 1].level >= it.level) {
            stack.pop();
        }
        const parent = stack.length ? stack[stack.length - 1] : null;
        if (parent) {
            if (!childrenById.has(parent.id)) childrenById.set(parent.id, []);
            childrenById.get(parent.id).push(it);
        }
        stack.push(it);
    }
    return childrenById;
}

function main() {
    const input = process.argv[2];
    const docsRoot = process.argv[3] || "docs";
    const overwrite = process.argv.includes("--overwrite");

    if (!input) {
        console.error("Usage: node generate-section-files.mjs outline.preprocessed.json [docs] [--overwrite]");
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(input, "utf8"));
    const outline = data.outline || [];
    const pdfName = data.pdf || null;

    if (!Array.isArray(outline) || outline.length === 0) {
        throw new Error("No outline entries found in input.");
    }

    const sectionsDir = path.join(docsRoot, "10_sections");
    ensureDir(sectionsDir);

    const childrenById = computeImmediateChildren(outline);

    let created = 0;
    let skipped = 0;
    let updated = 0;

    for (const item of outline) {
        const relFile = item.file || `10_sections/${item.id}__${item.slug}.md`;
        const filePath = path.join(docsRoot, relFile);

        const childrenImmediate = childrenById.get(item.id) || [];
        const content =
            renderFrontMatter(item, pdfName) +
            renderBodyTemplate(item, childrenImmediate);

        if (fs.existsSync(filePath)) {
            if (!overwrite) {
                skipped++;
                continue;
            }
            fs.writeFileSync(filePath, content, "utf8");
            updated++;
        } else {
            safeWriteFile(filePath, content);
            created++;
        }
    }

    console.log("OK: section files generated");
    console.log(` - root: ${docsRoot}`);
    console.log(` - created: ${created}`);
    console.log(` - updated: ${updated}`);
    console.log(` - skipped: ${skipped}`);
    console.log("");
    console.log("Next: extract text per section using start_page/end_page and append under '## Contenu extrait'.");
}

main();

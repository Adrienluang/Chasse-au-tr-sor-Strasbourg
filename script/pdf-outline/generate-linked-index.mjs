import fs from "node:fs";
import path from "node:path";

function ensureDir(p) {
    fs.mkdirSync(p, { recursive: true });
}

function mdEscape(s) {
    return String(s ?? "").replace(/\|/g, "\\|");
}

function hasFlag(flag) {
    return process.argv.includes(flag);
}

function parseArg(flag, def = null) {
    const i = process.argv.indexOf(flag);
    if (i === -1) return def;
    const v = process.argv[i + 1];
    if (!v || v.startsWith("--")) return def;
    return v;
}

// Same rule as v2: directory derived from breadcrumb_slugs ancestors
function sectionDirFromBreadcrumbSlugs(item, maxDepthDirs = 3) {
    const parts = String(item.breadcrumb_slugs || "").split("/").filter(Boolean);
    const ancestors = parts.slice(0, Math.max(0, parts.length - 1));
    const selected = ancestors.slice(0, maxDepthDirs);
    return selected.join("/");
}

function expectedSectionFileRelative(item, maxDepthDirs) {
    const subDir = sectionDirFromBreadcrumbSlugs(item, maxDepthDirs);
    const filename = `${item.id}__${item.slug}.md`;
    return path.posix.join("10_sections", subDir, filename);
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

function pagesLabel(it) {
    if (Number.isInteger(it.start_page) && Number.isInteger(it.end_page)) {
        return `p.${it.start_page}-${it.end_page}`;
    }
    if (Number.isInteger(it.start_page)) return `p.${it.start_page}`;
    return `p.?`;
}

function relLink(fromFileRel, toFileRel) {
    // fromFileRel and toFileRel are posix-like relative paths from docs root
    const fromDir = path.posix.dirname(fromFileRel);
    return path.posix.relative(fromDir, toFileRel) || path.posix.basename(toFileRel);
}

const START = "<!-- AUTO:SUBSECTIONS:START -->";
const END   = "<!-- AUTO:SUBSECTIONS:END -->";

function upsertSubsectionsBlock(filePathAbs, linesBlock) {
    let content = fs.readFileSync(filePathAbs, "utf8");

    const startIdx = content.indexOf(START);
    const endIdx = content.indexOf(END);

    const block = [
        "## Sous-sections",
        START,
        ...linesBlock,
        END,
        "",
    ].join("\n");

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        // replace only between START..END inclusive + keep the heading above if present
        // We'll replace from the line "## Sous-sections" if it exists just before START; else replace START..END.
        const beforeStart = content.slice(0, startIdx);
        const headingPos = beforeStart.lastIndexOf("## Sous-sections");
        const replaceFrom = headingPos !== -1 ? headingPos : startIdx;
        const replaceTo = endIdx + END.length;

        content = content.slice(0, replaceFrom) + block + content.slice(replaceTo);
    } else {
        // append at end (don’t destroy extracted text)
        if (!content.endsWith("\n")) content += "\n";
        content += "\n" + block;
    }

    fs.writeFileSync(filePathAbs, content, "utf8");
}

function writeRootIndex(docsRoot, level1Items, fileRelById) {
    const indexPath = path.join(docsRoot, "index.md");
    const lines = [];

    lines.push("# Index");
    lines.push("");
    lines.push("## Niveau 1");
    lines.push(START);

    for (const it of level1Items) {
        const targetRel = fileRelById.get(it.id);
        // link relative to docs/index.md => just targetRel
        const link = targetRel ? targetRel : "#";
        lines.push(`- [${mdEscape(it.title)}](${link}) (${pagesLabel(it)}) \`id:${it.id}\``);
    }

    lines.push(END);
    lines.push("");

    ensureDir(docsRoot);
    fs.writeFileSync(indexPath, lines.join("\n"), "utf8");
    console.log("OK: wrote " + indexPath);
}

function main() {
    const input = process.argv[2];
    const docsRoot = process.argv[3] || "docs";

    // These should match your generation choices
    const maxDepthDirs = Number(parseArg("--max-depth-dirs", "3"));
    const maxLevelFiles = Number(parseArg("--max-level-files", "2")); // you currently generate <=2
    const linkToAllLevels = hasFlag("--link-all-levels"); // if set, link children even if not generated as files

    if (!input) {
        console.error("Usage: node generate-linked-index.mjs outline.preprocessed.json [docs] [--max-depth-dirs 3] [--max-level-files 2] [--link-all-levels]");
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(input, "utf8"));
    const outline = data.outline || [];
    if (!Array.isArray(outline) || outline.length === 0) {
        throw new Error("No outline entries found in input.");
    }

    // Build deterministic file paths from breadcrumb_slugs
    const fileRelById = new Map();
    for (const it of outline) {
        const fileRel = expectedSectionFileRelative(it, maxDepthDirs);
        fileRelById.set(it.id, fileRel);
    }

    const childrenById = computeImmediateChildren(outline);

    // Root index: only level 1
    const level1 = outline.filter((x) => x.level === 1);
    writeRootIndex(docsRoot, level1, fileRelById);

    // Update each section file that exists (or that should exist up to maxLevelFiles)
    let updated = 0;
    let skippedMissing = 0;

    for (const it of outline) {
        // Only update files you actually generate (<= maxLevelFiles),
        // unless you explicitly want linking across all levels.
        if (!linkToAllLevels && it.level > maxLevelFiles) continue;

        const fileRel = fileRelById.get(it.id);
        const fileAbs = path.join(docsRoot, fileRel);

        if (!fs.existsSync(fileAbs)) {
            skippedMissing++;
            continue;
        }

        const kids = childrenById.get(it.id) || [];
        const lines = [];

        for (const child of kids) {
            // If not linking across all levels: only link to child files that should exist (<= maxLevelFiles)
            if (!linkToAllLevels && child.level > maxLevelFiles) continue;

            const childRel = fileRelById.get(child.id);
            const link = relLink(fileRel, childRel);
            lines.push(`- [${mdEscape(child.title)}](${link}) (${pagesLabel(child)}) \`id:${child.id}\``);
        }

        if (lines.length === 0) {
            lines.push("- (aucune)");
        }

        upsertSubsectionsBlock(fileAbs, lines);
        updated++;
    }

    console.log(`OK: updated subsection links in ${updated} files`);
    if (skippedMissing) {
        console.log(`Note: ${skippedMissing} files missing (not generated yet) -> skipped`);
    }
}

main();

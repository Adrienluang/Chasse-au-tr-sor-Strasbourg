import fs from "node:fs";
import path from "node:path";

function ensureDir(p) {
    fs.mkdirSync(p, { recursive: true });
}

function toTree(outline) {
    // Build a nested tree based on level
    const root = { id: "root", title: "ROOT", level: 0, children: [] };
    const stack = [root];

    for (const item of outline) {
        const node = {
            id: item.id,
            title: item.title,
            slug: item.slug,
            level: item.level,
            start_page: item.start_page,
            end_page: item.end_page,
            breadcrumb: item.breadcrumb,
            file: item.file,
            children: [],
        };

        // Adjust stack to parent level
        while (stack.length > 0 && stack[stack.length - 1].level >= node.level) {
            stack.pop();
        }
        const parent = stack[stack.length - 1] || root;
        parent.children.push(node);
        stack.push(node);
    }

    return root.children;
}

function buildFlatIndex(outline) {
    // Minimal fields that are useful for retrieval + CLI search
    return outline.map((x) => ({
        id: x.id,
        level: x.level,
        title: x.title,
        slug: x.slug,
        start_page: x.start_page,
        end_page: x.end_page,
        breadcrumb: x.breadcrumb,
        file: x.file,
        // helpful for quick ranking / grouping:
        range_pages:
            Number.isInteger(x.start_page) && Number.isInteger(x.end_page)
                ? x.end_page - x.start_page + 1
                : null,
    }));
}

function mdEscape(s) {
    return String(s ?? "").replace(/\|/g, "\\|");
}

function renderIndexMd(tree, depth = 0) {
    // Markdown nested list. Keep it readable, include pages and id.
    let lines = [];
    for (const node of tree) {
        const indent = "  ".repeat(depth);
        const pages =
            Number.isInteger(node.start_page) && Number.isInteger(node.end_page)
                ? `p.${node.start_page}-${node.end_page}`
                : Number.isInteger(node.start_page)
                    ? `p.${node.start_page}`
                    : `p.?`;

        lines.push(
            `${indent}- **${mdEscape(node.title)}** (${pages}) \`id:${node.id}\``
        );
        if (node.children?.length) {
            lines = lines.concat(renderIndexMd(node.children, depth + 1));
        }
    }
    return lines;
}

function main() {
    const input = process.argv[2];
    const outDir = process.argv[3] || "docs/00_index";

    if (!input) {
        console.error("Usage: node build-index.mjs outline.preprocessed.json [docs/00_index]");
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(input, "utf8"));
    const outline = data.outline || [];

    if (!Array.isArray(outline) || outline.length === 0) {
        throw new Error("No outline entries found in input.");
    }

    ensureDir(outDir);

    const tree = toTree(outline);
    const flat = buildFlatIndex(outline);

    const flatPath = path.join(outDir, "index.flat.json");
    const treePath = path.join(outDir, "index.tree.json");
    const mdPath = path.join(outDir, "index.md");

    fs.writeFileSync(flatPath, JSON.stringify({
        pdf: data.pdf ?? null,
        page_count: data.page_count ?? null,
        outline_count: outline.length,
        warnings: data.warnings ?? [],
        items: flat,
    }, null, 2), "utf8");

    fs.writeFileSync(treePath, JSON.stringify({
        pdf: data.pdf ?? null,
        page_count: data.page_count ?? null,
        outline_count: outline.length,
        warnings: data.warnings ?? [],
        tree,
    }, null, 2), "utf8");

    const mdLines = [];
    mdLines.push(`# Index`);
    if (data.pdf) mdLines.push(`- Source: **${data.pdf}**`);
    if (data.page_count) mdLines.push(`- Pages (PDF): **${data.page_count}**`);
    if ((data.warnings ?? []).length) {
        mdLines.push(`- Warnings: **${data.warnings.length}** (voir index.*.json)`);
    }
    mdLines.push("");
    mdLines.push("## Table des matières");
    mdLines.push(...renderIndexMd(tree));
    mdLines.push("");

    fs.writeFileSync(mdPath, mdLines.join("\n"), "utf8");

    console.log("OK:");
    console.log(" - " + flatPath);
    console.log(" - " + treePath);
    console.log(" - " + mdPath);
}

main();

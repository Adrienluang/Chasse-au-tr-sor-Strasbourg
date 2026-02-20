import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

// pdfjs-dist (legacy build works well in Node)
const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

async function resolveDestToPageIndex(pdf, dest) {
    // dest can be: string (named dest) or explicit destination array
    let explicitDest = dest;

    if (typeof explicitDest === "string") {
        explicitDest = await pdf.getDestination(explicitDest);
    }
    if (!Array.isArray(explicitDest) || explicitDest.length === 0) return null;

    const destRef = explicitDest[0];

    // destRef can be an object ref or (sometimes) a page index number
    if (typeof destRef === "number") {
        return destRef; // likely 0-based index
    }

    try {
        const pageIndex = await pdf.getPageIndex(destRef);
        return pageIndex; // 0-based
    } catch {
        return null;
    }
}

async function walkOutline(pdf, nodes, level = 1, out = []) {
    for (const node of nodes) {
        const title = (node.title ?? "").trim();

        const pageIndex = await resolveDestToPageIndex(pdf, node.dest);
        const pagePdf1Based = pageIndex === null ? null : pageIndex + 1;

        out.push({
            level,
            title,
            page_pdf_1based: pagePdf1Based,
        });

        if (Array.isArray(node.items) && node.items.length) {
            await walkOutline(pdf, node.items, level + 1, out);
        }
    }
    return out;
}

async function main() {
    const pdfPath = process.argv[2];
    if (!pdfPath) {
        console.error("Usage: node extract-outline.mjs /path/to/file.pdf");
        process.exit(1);
    }

    const abs = path.resolve(pdfPath);
    const data = new Uint8Array(fs.readFileSync(abs));

    const loadingTask = pdfjsLib.getDocument({
        data,
        // These flags reduce surprises in Node environments
        disableWorker: true,
        useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;

    const outline = (await pdf.getOutline()) || [];
    const flat = await walkOutline(pdf, outline);

    const result = {
        pdf: path.basename(abs),
        page_count: pdf.numPages,
        outline_count: flat.length,
        outline: flat,
    };

    console.log(JSON.stringify(result, null, 2));
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});

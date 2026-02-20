import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

function normalizeTitle(s) {
    if (!s) return "";
    return String(s)
        .replace(/\u00A0/g, " ")          // NBSP -> space
        .replace(/[\u200B-\u200D\uFEFF]/g, "") // zero-width
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\s+\.+$/g, "")         // trailing dots
        .trim();
}

// Simple ASCII-ish slug. Good enough for filenames + ids.
function slugify(s) {
    const normalized = s
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .toLowerCase();

    const slug = normalized
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-{2,}/g, "-");

    return slug || "untitled";
}

function hashId(input) {
    return crypto.createHash("sha1").update(input).digest("hex").slice(0, 12);
}

/**
 * end_page rule (robust enough):
 * - for item i, find the next item j>i such that:
 *   - start_page is not null
 *   - start_page(j) > start_page(i)
 *   - level(j) <= level(i)
 * - end_page(i) = start_page(j) - 1
 * - if none => page_count
 */
function computeEndPages(items, pageCount) {
    for (let i = 0; i < items.length; i++) {
        const cur = items[i];
        const sp = cur.start_page;
        if (!Number.isInteger(sp)) {
            cur.end_page = null;
            continue;
        }

        let end = pageCount;
        for (let j = i + 1; j < items.length; j++) {
            const nxt = items[j];
            if (!Number.isInteger(nxt.start_page)) continue;
            if (nxt.start_page <= sp) continue;
            if (nxt.level <= cur.level) {
                end = nxt.start_page - 1;
                break;
            }
        }
        cur.end_page = Math.max(sp, Math.min(end, pageCount));
    }
}

function buildBreadcrumbs(items) {
    // stack[level] = { title, slug }
    const stack = [];
    for (const it of items) {
        const lvl = it.level;

        // Ensure stack length = lvl
        stack[lvl - 1] = { title: it.title, slug: it.slug };
        stack.length = lvl;

        it.breadcrumb = stack.map((x) => x.title).join(" > ");
        it.breadcrumb_slugs = stack.map((x) => x.slug).join("/");
    }
}

function validate(items, pageCount) {
    const warnings = [];
    let lastPage = 1;

    for (const it of items) {
        if (!it.title) warnings.push(`Empty title at level=${it.level}, start=${it.start_page}`);
        if (it.start_page !== null) {
            if (it.start_page < 1 || it.start_page > pageCount) {
                warnings.push(`start_page out of range: "${it.title}" -> ${it.start_page}`);
            }
            // not strictly monotone (some PDFs can jump), but warn if it's going backwards
            if (it.start_page < lastPage) {
                warnings.push(`Non-monotone pages: "${it.title}" start=${it.start_page} < prev=${lastPage}`);
            }
            lastPage = Math.max(lastPage, it.start_page);
        }
        if (it.end_page !== null && it.start_page !== null && it.end_page < it.start_page) {
            warnings.push(`end_page < start_page: "${it.title}" ${it.start_page}-${it.end_page}`);
        }
    }

    return warnings;
}

function main() {
    const input = process.argv[2];
    const output = process.argv[3] || "outline.preprocessed.json";

    if (!input) {
        console.error("Usage: node preprocess-outline.mjs outline.json [outline.preprocessed.json]");
        process.exit(1);
    }

    const raw = JSON.parse(fs.readFileSync(input, "utf8"));

    const pageCount = raw.page_count ?? raw.pageCount;
    if (!Number.isInteger(pageCount) || pageCount <= 0) {
        throw new Error("Invalid page_count in input JSON.");
    }

    const srcOutline = raw.outline || [];
    const items = srcOutline.map((x, idx) => {
        const level = Number(x.level);
        const title = normalizeTitle(x.title);
        const start = x.page_pdf_1based;

        const start_page = Number.isInteger(start) ? start : null;
        const slug = slugify(title || `section-${idx + 1}`);

        // id stable based on breadcrumb later; temporary seed here
        return {
            _index: idx,
            level: Number.isFinite(level) ? level : 1,
            title,
            slug,
            start_page,
            end_page: null,
            breadcrumb: "",
            breadcrumb_slugs: "",
            id: "",
        };
    });

    // Build breadcrumbs first, then stable ids based on breadcrumb + start_page
    buildBreadcrumbs(items);

    for (const it of items) {
        const idSeed = `${it.breadcrumb_slugs}|${it.start_page ?? "null"}`;
        it.id = hashId(idSeed);
    }

    // Compute end pages
    computeEndPages(items, pageCount);

    // Final file path (later used in "generate files" step)
    for (const it of items) {
        // Keep filenames short-ish: <id>__<slug>.md
        it.file = `10_sections/${it.id}__${it.slug}.md`;
    }

    const warnings = validate(items, pageCount);

    const out = {
        pdf: raw.pdf || null,
        page_count: pageCount,
        outline_count: items.length,
        warnings,
        outline: items.map(({ _index, ...rest }) => rest),
    };

    fs.writeFileSync(output, JSON.stringify(out, null, 2), "utf8");

    console.log(`OK: wrote ${output}`);
    if (warnings.length) {
        console.warn(`Warnings (${warnings.length}):`);
        for (const w of warnings.slice(0, 20)) console.warn(" - " + w);
        if (warnings.length > 20) console.warn(` - ... (${warnings.length - 20} more)`);
    }
}

main();


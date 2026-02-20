import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import pLimit from "p-limit";

/**
 * Build outline H1/H2/H3 with heading nodes positions (offsets)
 * Then compute section ranges for each H3: [contentStartOffset, contentEndOffset)
 */
function parseMarkdown(md) {
  const tree = unified().use(remarkParse).parse(md);

  const headings = [];
  visit(tree, "heading", (node) => {
    const text = toString(node).trim();
    const depth = node.depth; // 1..6
    const pos = node.position ?? null;
    const startOffset = pos?.start?.offset ?? null;
    const endOffset = pos?.end?.offset ?? null;
    headings.push({
      depth,
      text,
      startOffset,
      endOffset,
      // For convenience, line/col too (sometimes useful)
      startLine: pos?.start?.line ?? null,
      endLine: pos?.end?.line ?? null,
    });
  });

  // Build hierarchy H1->H2->H3 and keep index mapping
  const outline = [];
  let currentH1 = null;
  let currentH2 = null;

  // Keep a flat list of H3 entries with their scope context
  const h3Entries = [];

  for (let i = 0; i < headings.length; i++) {
    const h = headings[i];

    if (h.depth === 1) {
      currentH1 = { title: h.text, h2: [], _h: h };
      outline.push(currentH1);
      currentH2 = null;
    } else if (h.depth === 2 && currentH1) {
      currentH2 = { title: h.text, h3: [], _h: h };
      currentH1.h2.push(currentH2);
    } else if (h.depth === 3 && currentH2 && currentH1) {
      const entry = {
        h1: currentH1.title,
        h2: currentH2.title,
        h3: h.text,
        heading: h,
      };
      currentH2.h3.push({ title: h.text, _h: h });
      h3Entries.push(entry);
    }
  }

  // Helper: find next heading offset with depth <= 3 after a given H3 heading
  // content region is after the H3 line until the next heading with depth <=3 (or EOF)
  function computeH3Ranges() {
    const len = md.length;

    const ranges = h3Entries.map((e) => {
      const h3Start = e.heading.startOffset;
      const h3End = e.heading.endOffset;

      if (h3Start == null || h3End == null) {
        throw new Error(`Missing offsets for heading: ${e.h3}`);
      }

      // Content starts right after the heading line end.
      let contentStart = h3End;

      // Skip a single trailing newline if present
      if (md[contentStart] === "\r" && md[contentStart + 1] === "\n") contentStart += 2;
      else if (md[contentStart] === "\n") contentStart += 1;

      // Find next heading (depth <= 3) with startOffset > h3Start
      let contentEnd = len;
      for (const h of headings) {
        if (h.startOffset != null && h.startOffset > h3Start && h.depth <= 3) {
          contentEnd = Math.min(contentEnd, h.startOffset);
        }
      }

      return {
        ...e,
        contentStart,
        contentEnd,
        existingContent: md.slice(contentStart, contentEnd).trimEnd(),
      };
    });

    return ranges;
  }

  const h3Ranges = computeH3Ranges();

  // Precompute lists for “scope packet”
  const h1List = outline.map((x) => x.title);

  function getH2ListForH1(h1Title) {
    const h1 = outline.find((x) => x.title === h1Title);
    return h1 ? h1.h2.map((x) => x.title) : [];
  }

  function getH3ListForH1H2(h1Title, h2Title) {
    const h1 = outline.find((x) => x.title === h1Title);
    const h2 = h1?.h2.find((x) => x.title === h2Title);
    return h2 ? h2.h3.map((x) => x.title) : [];
  }

  return {
    outline,
    h1List,
    h3Ranges: h3Ranges.map((r) => ({
      ...r,
      h2List: getH2ListForH1(r.h1),
      h3List: getH3ListForH1H2(r.h1, r.h2),
    })),
  };
}

function safeSlug(s) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writePackets({ mdPath, mode, outDir, sourcesText = "" }) {
  const md = fs.readFileSync(mdPath, "utf8");
  const parsed = parseMarkdown(md);

  ensureDir(outDir);

  const packets = [];
  for (const r of parsed.h3Ranges) {
    const id = `${safeSlug(r.h1)}__${safeSlug(r.h2)}__${safeSlug(r.h3)}`;
    const file = path.join(outDir, `${id}.packet.md`);

    const packet = [
      `# Packet`,
      ``,
      `## Mode`,
      `${mode}`,
      ``,
      `## Scope`,
      `- H1 list: ${JSON.stringify(parsed.h1List)}`,
      `- Current H1: ${r.h1}`,
      `- H2 list in current H1: ${JSON.stringify(r.h2List)}`,
      `- Current H2: ${r.h2}`,
      `- H3 list in current H2: ${JSON.stringify(r.h3List)}`,
      `- Target H3: ${r.h3}`,
      ``,
      `## Existing content (may be empty)`,
      r.existingContent ? r.existingContent : `(empty)`,
      ``,
      `## Sources (optional)`,
      sourcesText ? sourcesText : `(none)`,
      ``,
      `## Instruction`,
      mode === "plan"
        ? `Produce a detailed H4 plan for the Target H3. Output MUST be only Markdown that starts with H4 headings (####).`
        : `Write the full content for the Target H3. You may use H4 subheadings. Output MUST be only Markdown.`,
      ``,
    ].join("\n");

    fs.writeFileSync(file, packet, "utf8");
    packets.push({ id, file, h1: r.h1, h2: r.h2, h3: r.h3 });
  }

  return packets;
}

function runClaudeOnce({ packetFile, promptRulesFile, mode, claudeBin = "claude" }) {
  return new Promise((resolve, reject) => {
    const packet = fs.readFileSync(packetFile, "utf8");

    // JSON schema to force machine-mergeable output
    const schema = {
      type: "object",
      additionalProperties: false,
      properties: {
        packetFile: { type: "string" },
        mode: { type: "string", enum: ["plan", "content"] },
        markdown: { type: "string" },
        assumptions: { type: "array", items: { type: "string" } },
      },
      required: ["packetFile", "mode", "markdown", "assumptions"],
    };

    const userQuery =
      mode === "plan"
        ? "Return JSON ONLY matching the schema. Provide markdown containing ONLY H4 headings (#### ...) for the target H3."
        : "Return JSON ONLY matching the schema. Provide markdown content for the target H3 (may include H4).";

    const args = [
      "-p",
      "--no-session-persistence",         // fresh + not saved to disk :contentReference[oaicite:1]{index=1}
      "--tools", '""',                    // disable tools :contentReference[oaicite:2]{index=2}
      "--max-turns", "2",                 // limit agentic wandering :contentReference[oaicite:3]{index=3}
      "--output-format", "json",          // parseable :contentReference[oaicite:4]{index=4}
      "--json-schema", JSON.stringify(schema), // validated structured output :contentReference[oaicite:5]{index=5}
      "--append-system-prompt-file", promptRulesFile, // stable rules :contentReference[oaicite:6]{index=6}
      userQuery,
    ];

    const child = spawn(claudeBin, args, { stdio: ["pipe", "pipe", "pipe"] });

    let out = "";
    let err = "";

    child.stdout.on("data", (d) => (out += d.toString("utf8")));
    child.stderr.on("data", (d) => (err += d.toString("utf8")));

    child.on("error", reject);

    child.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`claude exited ${code}\n${err}\n${out}`));
      }

      try {
        const obj = JSON.parse(out);
        // Defensive: enrich
        obj.packetFile = packetFile;
        obj.mode = mode;
        resolve(obj);
      } catch (e) {
        reject(new Error(`Invalid JSON from claude\n${err}\n---\n${out}`));
      }
    });

    child.stdin.write(packet);
    child.stdin.end();
  });
}

async function runClaudeBatch({ packetsDir, promptRulesFile, outJsonl, mode, concurrency = 4, claudeBin = "claude" }) {
  const files = fs
    .readdirSync(packetsDir)
    .filter((f) => f.endsWith(".packet.md"))
    .map((f) => path.join(packetsDir, f))
    .sort();

  const limit = pLimit(concurrency);
  const results = [];

  const tasks = files.map((packetFile) =>
    limit(async () => {
      const res = await runClaudeOnce({ packetFile, promptRulesFile, mode, claudeBin });
      results.push(res);
      fs.appendFileSync(outJsonl, JSON.stringify(res) + "\n", "utf8");
    })
  );

  await Promise.all(tasks);
  return results;
}

function mergeResults({ mdPath, resultsJsonl, outPath }) {
  const md = fs.readFileSync(mdPath, "utf8");
  const parsed = parseMarkdown(md);

  // Map packet basename -> markdown
  const map = new Map();

  const lines = fs.readFileSync(resultsJsonl, "utf8").split("\n").filter(Boolean);
  for (const line of lines) {
    const obj = JSON.parse(line);

    // 1) Ignore explicit errors / incomplete runs
    const subtype = obj?.subtype || "";
    if (subtype.startsWith("error_")) continue;
    if (obj?.is_error === true) continue;

    // 2) Extract packetFile and markdown from the real CLI wrapper
    const packetFile = obj?.packetFile || obj?.structured_output?.packetFile;
    const markdown =
        obj?.structured_output?.markdown ??
        obj?.markdown ??
        null;

    // 3) Only keep if we have actual content
    if (!packetFile) continue;
    if (!markdown || !String(markdown).trim()) continue;

    const key = path.basename(packetFile); // match by basename
    map.set(key, String(markdown));
  }

  // Apply replacements bottom-up (keep offsets valid)
  const targets = parsed.h3Ranges
      .map((r) => {
        const id = `${safeSlug(r.h1)}__${safeSlug(r.h2)}__${safeSlug(r.h3)}`;
        const key = `${id}.packet.md`;
        return { ...r, key };
      })
      .sort((a, b) => b.contentStart - a.contentStart);

  let updated = md;

  for (const t of targets) {
    const replacement = map.get(t.key);
    if (!replacement) continue; // don't touch if no good output

    const before = updated.slice(0, t.contentStart);
    const after = updated.slice(t.contentEnd);

    // Keep markdown clean
    const rep = replacement.trimEnd() + "\n\n";
    updated = before + rep + after;
  }

  fs.writeFileSync(outPath, updated, "utf8");
}

async function main() {
  const [cmd, ...args] = process.argv.slice(2);

  if (!cmd) {
    console.error(`Usage:
  node tools/mdflow.mjs packets <doc.md> <mode=plan|content> <outDir> [sourcesFile]
  node tools/mdflow.mjs run <packetsDir> <mode=plan|content> <promptRulesFile> <outJsonl> [concurrency] [claudeBin]
  node tools/mdflow.mjs merge <doc.md> <resultsJsonl> <out.md>
`);
    process.exit(1);
  }

  if (cmd === "packets") {
    const [doc, mode, outDir, sourcesFile] = args;
    const sourcesText = sourcesFile ? fs.readFileSync(sourcesFile, "utf8") : "";
    const packets = writePackets({ mdPath: doc, mode, outDir, sourcesText });
    console.log(JSON.stringify({ count: packets.length, outDir }, null, 2));
    return;
  }

  if (cmd === "run") {
    const [packetsDir, mode, promptRulesFile, outJsonl, conc, claudeBin] = args;
    const concurrency = conc ? Number(conc) : 4;
    ensureDir(path.dirname(outJsonl));
    fs.writeFileSync(outJsonl, "", "utf8");

    await runClaudeBatch({
      packetsDir,
      promptRulesFile,
      outJsonl,
      mode,
      concurrency,
      claudeBin: claudeBin || "claude",
    });

    console.log(JSON.stringify({ ok: true, outJsonl }, null, 2));
    return;
  }

  if (cmd === "merge") {
    const [doc, resultsJsonl, outMd] = args;
    mergeResults({ mdPath: doc, resultsJsonl, outPath: outMd });
    console.log(JSON.stringify({ ok: true, outMd }, null, 2));
    return;
  }

  console.error(`Unknown cmd: ${cmd}`);
  process.exit(1);
}

main().catch((e) => {
  console.error(e?.stack || String(e));
  process.exit(1);
});


import fs from "node:fs";
import path from "node:path";



function hexToRgb(hex) {
    const h = String(hex).replace("#", "").trim();
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const num = parseInt(full, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r, g, b) {
    const clamp = (x) => Math.max(0, Math.min(255, Math.round(x)));
    const to2 = (x) => clamp(x).toString(16).padStart(2, "0");
    return `#${to2(r)}${to2(g)}${to2(b)}`;
}

// RGB <-> HSL helpers (standard)
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    const d = max - min;
    if (d !== 0) {
        s = d / (1 - Math.abs(2 * l - 1));
        switch (max) {
            case r: h = ((g - b) / d) % 6; break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
        if (h < 0) h += 360;
    }
    return { h, s, l };
}

function hslToRgb(h, s, l) {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let rp = 0, gp = 0, bp = 0;

    if (h < 60)      { rp = c; gp = x; bp = 0; }
    else if (h < 120){ rp = x; gp = c; bp = 0; }
    else if (h < 180){ rp = 0; gp = c; bp = x; }
    else if (h < 240){ rp = 0; gp = x; bp = c; }
    else if (h < 300){ rp = x; gp = 0; bp = c; }
    else             { rp = c; gp = 0; bp = x; }

    return { r: (rp + m) * 255, g: (gp + m) * 255, b: (bp + m) * 255 };
}

/**
 * Map step -> lightness factor.
 * 50..900 : plus petit = plus clair.
 */
function stepToLightness(step) {
    // 50 => 0.95, 500 => 0.55, 900 => 0.20 (approx)
    const t = (step - 50) / (900 - 50); // 0..1
    const l = 0.95 + (0.20 - 0.95) * t;
    return Math.max(0.05, Math.min(0.98, l));
}

function generateRamp(baseHex, steps) {
    if (steps === undefined)
        steps = [50,100,200,300,400,500,600,700,800,900];
    const { r, g, b } = hexToRgb(baseHex);
    const base = rgbToHsl(r, g, b);

    // conserve hue/saturation, varie surtout lightness (MVP)
    const res = {};
    for (const step of steps) {
        const l = stepToLightness(step);
        const rgb = hslToRgb(base.h, base.s, l);
        res[step] = rgbToHex(rgb.r, rgb.g, rgb.b);
    }
    return res;
}


function resolveSemanticRef(ref, paletteRamps) {
    const s = String(ref).trim();

    // "#fff" direct
    if (s.startsWith("#")) return s;

    // "primary.600"
    const m = /^([a-zA-Z0-9_-]+)\.(\d+)$/.exec(s);
    if (!m) return s; // fallback: assume already a CSS value like "transparent"
    const [, palName, stepStr] = m;
    const step = Number(stepStr);
    const ramp = paletteRamps[palName];
    // process.exit();
    if (!ramp || !ramp[stepStr]) {
        throw new Error(`Semantic ref "${ref}" cannot be resolved (missing palette/step).`);
    }
    return ramp[stepStr];
}

function cssVar(name, value) {
    return `  --${name}: ${value};`;
}

function buildCss(ds) {
    const lines = [];
    lines.push("/* AUTO-GENERATED FILE. DO NOT EDIT. */");

    // 1) build ramps
    const paletteRamps = {};
    for (const [name, cfg] of Object.entries(ds.palette || {})) {
        const ramp = generateRamp(cfg.base, cfg.ramp.steps);
        paletteRamps[name] = ramp;
    }

    // 2) :root
    lines.push(":root {");

    // palette tokens
    for (const [name, ramp] of Object.entries(paletteRamps)) {
        for (const step of Object.keys(ramp).map(Number).sort((a, b) => a - b)) {
            lines.push(cssVar(`color-${name}-${step}`, ramp[step]));
        }
    }

    // typography tokens
    const typo = ds.typography;
    lines.push(cssVar("font-sans", typo.fonts.sans.stack));
    if (typo.fonts.mono) lines.push(cssVar("font-mono", typo.fonts.mono.stack));

    lines.push(cssVar("font-base", `${typo.scale.basePx}px`));
    lines.push(cssVar("type-ratio", String(typo.scale.ratio)));
    lines.push(cssVar("lh-body", String(typo.scale.lineHeight.body)));
    lines.push(cssVar("lh-heading", String(typo.scale.lineHeight.heading)));

    // text steps (materialized because CSS has no pow)
    for (const [key, power] of Object.entries(typo.scale.steps)) {
        const sizePx = typo.scale.basePx * Math.pow(typo.scale.ratio, power);
        lines.push(cssVar(`text-${key}`, `${sizePx.toFixed(3)}px`));
    }

    // space scale
    for (const mult of ds.scales.space.steps) {
        lines.push(cssVar(`space-${mult}`, `${ds.units.spaceBasePx * mult}px`));
    }

    // radius
    for (const [k, v] of Object.entries(ds.scales.radius.valuesPx)) {
        lines.push(cssVar(`radius-${k}`, `${v}px`));
    }

    // shadow
    for (const [k, v] of Object.entries(ds.scales.shadow.values)) {
        lines.push(cssVar(`shadow-${k}`, v));
    }

    // z-index
    for (const [k, v] of Object.entries(ds.scales.zIndex.values)) {
        lines.push(cssVar(`z-${k}`, String(v)));
    }

    // motion
    if (ds.scales.motion) {
        for (const [k, v] of Object.entries(ds.scales.motion.durationMs)) {
            lines.push(cssVar(`motion-${k}`, `${v}ms`));
        }
        for (const [k, v] of Object.entries(ds.scales.motion.easing)) {
            lines.push(cssVar(`ease-${k}`, v));
        }
    }

    // semantic base (canonical semantic, themes are deltas)
    for (const [k, ref] of Object.entries(ds.semantic.color || {})) {
        const resolved = resolveSemanticRef(ref, paletteRamps);
        lines.push(cssVar(`color-${k}`, resolved));
    }

    lines.push("}");

    // 3) themes overrides (delta only)
    if (ds.themes) {
        for (const [themeName, override] of Object.entries(ds.themes)) {
            const themeColors = override?.semantic?.color;
            if (!themeColors) continue;

            lines.push("");
            lines.push(`[data-theme="${themeName}"] {`);
            for (const [k, ref] of Object.entries(themeColors)) {
                const resolved = resolveSemanticRef(ref, paletteRamps);
                lines.push(cssVar(`color-${k}`, resolved));
            }
            lines.push("}");
        }
    }

    return lines.join("\n") + "\n";
}

function buildScssHelper() {
    // SCSS helper: no values, just consumption
    return `/* AUTO-GENERATED FILE. DO NOT EDIT. */
@function token($name) {
  @return var(--#{$name});
}
`;
}

function main() {


    const INPUT = process.argv[2] ?? ".design_system.json";
    // const OUT_DIR = process.argv[3] ?? "out";
    // const HEADING = process.argv[4] ?? "##"; // "#", "##", "###", ...

    // const designSystemJson = fs.readFileSync(INPUT, "utf8");
    // const designSystem = JSON.parse(designSystemJson);
    //
    // const {palette} = designSystem;

    const jsonPath = path.resolve(process.cwd(), "design/design-system.json");
    // const outCss = path.resolve(process.cwd(), "assets/styles/tokens.generated.css");
    // const outScss = path.resolve(process.cwd(), "assets/styles/tokens.generated.scss");

    const raw = fs.readFileSync(INPUT, "utf-8");
    const ds = JSON.parse(raw);

    const css = buildCss(ds);
    // fs.mkdirSync(path.dirname(outCss), { recursive: true });
    // fs.writeFileSync(outCss, css, "utf-8");
    console.log(css);

    // const scss = buildScssHelper();
    // console.log(scss)
    // fs.writeFileSync(outScss, scss, "utf-8");
    //
    // console.log(`Generated:\n- ${outCss}\n- ${outScss}`);
}

main();
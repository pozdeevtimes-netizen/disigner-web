#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const catalog = {
  style: 'styles.csv', color: 'colors.csv', typography: 'typography.csv',
  ux: 'ux-guidelines.csv', landing: 'landing.csv', product: 'products.csv',
  icons: 'icons.csv', motion: 'motion.csv', chart: 'charts.csv',
  web: 'app-interface.csv', react: 'react-performance.csv',
  'google-fonts': 'google-fonts.csv',
};
for (const stack of ['html-tailwind', 'astro', 'react', 'nextjs', 'vue', 'nuxtjs', 'svelte', 'shadcn', 'threejs']) {
  catalog[`stack-${stack}`] = `stacks/${stack}.csv`;
}

export function parseCsv(input) {
  const text = input.replace(/^\uFEFF/, '');
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i++; }
      else quoted = !quoted;
    } else if (char === ',' && !quoted) { row.push(field); field = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      if (row.some(Boolean)) rows.push(row);
      row = []; field = '';
    } else field += char;
  }
  if (quoted) throw new Error('Unterminated CSV quoted field');
  if (field || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const [headers, ...body] = rows;
  return body.map((cells) => Object.fromEntries(headers.map((key, i) => [key, cells[i] ?? ''])));
}

function tokens(text) {
  return (text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).filter((x) => x.length > 1).map((word) => {
    if (/^[a-z]+$/.test(word) && word.length > 4) {
      if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
      if (word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
    }
    return word;
  });
}

export function rankRows(rows, query, limit = 3) {
  const terms = [...new Set(tokens(query))];
  if (!terms.length) throw new Error('Provide a meaningful search query');
  const docs = rows.map((row) => tokens(Object.values(row).join(' ')));
  const lengths = docs.map((doc) => doc.length);
  const average = lengths.reduce((sum, n) => sum + n, 0) / Math.max(1, docs.length);
  const df = new Map(terms.map((term) => [term, docs.filter((doc) => doc.includes(term)).length]));
  const results = rows.map((row, index) => {
    const doc = docs[index];
    const matched = terms.filter((term) => doc.includes(term));
    let score = 0;
    for (const term of matched) {
      const tf = doc.filter((word) => word === term).length;
      const idf = Math.log(1 + (docs.length - df.get(term) + 0.5) / (df.get(term) + 0.5));
      score += idf * tf * 2.2 / (tf + 1.2 * (0.25 + 0.75 * doc.length / Math.max(1, average)));
    }
    return { score: Number(score.toFixed(4)), matched, row: index + 2, data: row };
  });
  return results.filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log('Usage: node search-catalog.mjs --domain typography --query "creative agency" --limit 3\nDomains: ' + Object.keys(catalog).join(', '));
    return;
  }
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    if (!['--domain', '--query', '--limit'].includes(args[i]) || args[i + 1] === undefined) throw new Error('Invalid arguments; use --help');
    options[args[i]] = args[i + 1];
  }
  const domain = options['--domain'] ?? 'ux';
  if (!Object.hasOwn(catalog, domain)) throw new Error('Unknown domain; use --help');
  const limit = Number(options['--limit'] ?? 3);
  if (!Number.isInteger(limit) || limit < 1 || limit > 20) throw new Error('Limit must be an integer from 1 to 20');
  const query = options['--query'] ?? '';
  const relative = `references/upstream/ui-ux-pro-max/data/${catalog[domain]}`;
  const rows = parseCsv(await readFile(resolve(root, relative), 'utf8'));
  const results = rankRows(rows, query, limit);
  const matched = new Set(results.flatMap((result) => result.matched));
  const unmatchedTerms = [...new Set(tokens(query))].filter((term) => !matched.has(term));
  console.log(JSON.stringify({ domain, query, source: relative, count: rows.length, unmatchedTerms, results }, null, 2));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}

// Ship the editorial image to the sandbox output directory.
// Node 22, standard library only: no network, no randomness, so both graded runs write identical bytes.
import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outputDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outputDir) {
  throw new Error('MAKEFUN_OUTPUT_DIR must name the output directory');
}

const here = dirname(fileURLToPath(import.meta.url));
const imagePath = join(here, 'entry.png');
const bytes = readFileSync(imagePath);
const pngMagic = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

if (!bytes.subarray(0, 8).equals(pngMagic)) {
  throw new Error('entry.png is not a PNG');
}
if (bytes.length > 1048576) {
  throw new Error('entry.png exceeds the 1 MiB limit');
}
if (bytes.readUInt32BE(16) !== 1024 || bytes.readUInt32BE(20) !== 1024) {
  throw new Error('entry.png must be 1024 by 1024 pixels');
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(imagePath, join(outputDir, 'entry.png'));
console.log(`wrote ${statSync(join(outputDir, 'entry.png')).size} bytes to ${join(outputDir, 'entry.png')}`);
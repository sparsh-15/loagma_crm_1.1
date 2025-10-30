// Pre-build script to copy shared folder into client/src
// This allows Vercel to build the frontend with access to shared types
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceDir = join(__dirname, '..', '..', 'shared');
const targetDir = join(__dirname, '..', 'src', 'shared');

// Create target directory if it doesn't exist
if (!existsSync(targetDir)) {
  mkdirSync(targetDir, { recursive: true });
}

// Copy schema.ts
const sourceFile = join(sourceDir, 'schema.ts');
const targetFile = join(targetDir, 'schema.ts');

copyFileSync(sourceFile, targetFile);
console.log('✓ Copied shared/schema.ts to client/src/shared/schema.ts');

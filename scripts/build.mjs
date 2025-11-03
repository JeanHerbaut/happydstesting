import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generate } from './generate-scenarios.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

const ENTRIES_TO_COPY = ['index.html', 'assets', 'data', 'js'];

async function prepareDistDirectory() {
  await fs.rm(DIST_DIR, { recursive: true, force: true });
  await fs.mkdir(DIST_DIR, { recursive: true });
}

async function copyEntry(entry) {
  const source = path.join(ROOT_DIR, entry);
  const destination = path.join(DIST_DIR, entry);

  try {
    const stats = await fs.stat(source);
    if (stats.isDirectory()) {
      await fs.cp(source, destination, { recursive: true });
    } else {
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.copyFile(source, destination);
    }
    console.log(`📁 Copie de ${entry} terminée.`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`⚠️  ${entry} est introuvable et ne sera pas copié.`);
      return;
    }
    throw error;
  }
}

async function build() {
  console.log('🚀 Génération des fichiers JSON…');
  await generate();

  console.log('🧹 Préparation du dossier dist…');
  await prepareDistDirectory();

  for (const entry of ENTRIES_TO_COPY) {
    await copyEntry(entry);
  }

  console.log('✅ Construction terminée. Les fichiers sont disponibles dans dist/.');
}

build().catch((error) => {
  console.error('❌ Échec de la construction du site statique :', error);
  process.exitCode = 1;
});

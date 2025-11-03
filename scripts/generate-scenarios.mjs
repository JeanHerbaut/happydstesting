import { promises as fs } from 'node:fs';
import path from 'node:path';

const GHERKIN_DIR = path.resolve('gherkin');
const DATA_DIR = path.resolve('data');
const OUTPUT_JSON = path.join(DATA_DIR, 'scenarios.json');
const FILES_JSON = path.join(DATA_DIR, 'gherkin-files.json');

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function makeScenarioId(file, feature, scenario) {
  return `${file}::${feature}::${scenario}`;
}

async function readExistingStatuses() {
  try {
    const raw = await fs.readFile(OUTPUT_JSON, 'utf-8');
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.features)) {
      return new Map();
    }
    const map = new Map();
    data.features.forEach((feature) => {
      (feature.scenarios || []).forEach((scenario) => {
        if (scenario.id) {
          map.set(scenario.id, {
            status: scenario.status,
            comment: scenario.comment,
          });
        }
      });
    });
    return map;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return new Map();
    }
    console.warn('Impossible de lire le JSON existant :', error.message);
    return new Map();
  }
}

async function listGherkinFiles() {
  const entries = await fs.readdir(GHERKIN_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function parseGherkinContent(content, fileName) {
  const features = [];
  const blocks = Array.from(content.matchAll(/```gherkin([\s\S]*?)```/g));

  blocks.forEach((block) => {
    const text = block[1];
    const lines = text.split(/\r?\n/);
    let currentFeature = null;
    let currentScenario = null;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return;
      }
      if (trimmed.startsWith('Feature:')) {
        if (currentScenario && currentFeature) {
          currentFeature.scenarios.push(currentScenario);
          currentScenario = null;
        }
        if (currentFeature) {
          features.push(currentFeature);
        }
        const name = trimmed.substring('Feature:'.length).trim();
        currentFeature = {
          id: `${fileName}::${name}`,
          title: name,
          file: fileName,
          scenarios: [],
        };
      } else if (trimmed.startsWith('Scenario')) {
        if (!currentFeature) {
          return;
        }
        if (currentScenario) {
          currentFeature.scenarios.push(currentScenario);
        }
        const name = trimmed.replace(/^Scenario(?: Outline)?:/, '').trim();
        currentScenario = {
          id: makeScenarioId(fileName, currentFeature.title, name),
          name,
          steps: [],
          status: 'N/A',
          comment: '',
        };
      } else if (currentScenario) {
        currentScenario.steps.push(trimmed);
      }
    });

    if (currentScenario && currentFeature) {
      currentFeature.scenarios.push(currentScenario);
    }
    if (currentFeature) {
      features.push(currentFeature);
    }
  });

  return features;
}

async function generate() {
  await ensureDataDir();
  const [files, existing] = await Promise.all([
    listGherkinFiles(),
    readExistingStatuses(),
  ]);

  const allFeatures = [];

  for (const file of files) {
    const fullPath = path.join(GHERKIN_DIR, file);
    const content = await fs.readFile(fullPath, 'utf-8');
    const features = parseGherkinContent(content, file);
    features.forEach((feature) => {
      feature.scenarios.forEach((scenario) => {
        const found = existing.get(scenario.id);
        if (found) {
          scenario.status = found.status || 'N/A';
          scenario.comment = found.comment || '';
        }
      });
      allFeatures.push(feature);
    });
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    features: allFeatures,
  };

  await Promise.all([
    fs.writeFile(
      OUTPUT_JSON,
      `${JSON.stringify(payload, null, 2)}\n`,
      'utf-8',
    ),
    fs.writeFile(
      FILES_JSON,
      `${JSON.stringify(files, null, 2)}\n`,
      'utf-8',
    ),
  ]);

  console.log(`✅ ${allFeatures.length} fonctionnalités exportées dans ${OUTPUT_JSON}`);
  console.log(`✅ Liste des fichiers sauvegardée dans ${FILES_JSON}`);
}

generate().catch((error) => {
  console.error('Erreur lors de la génération des scénarios:', error);
  process.exitCode = 1;
});

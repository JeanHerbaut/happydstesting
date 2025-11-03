const STATUS_OPTIONS = [
  { value: '-', label: '-', badgeClass: 'badge badge-outline' },
  { value: 'OK', label: 'OK', badgeClass: 'badge badge-success' },
  { value: 'KO', label: 'KO', badgeClass: 'badge badge-error' },
  { value: 'N/A', label: 'N/A', badgeClass: 'badge badge-neutral' },
  { value: 'FIX', label: 'FIX', badgeClass: 'badge badge-warning' },
];

const STORAGE_KEY = 'gherkin-scenarios-state';
const tabsContainer = document.getElementById('tabsContainer');
const statusMessage = document.getElementById('statusMessage');
const generateButton = document.getElementById('generateButton');
const downloadButton = document.getElementById('downloadButton');

const state = {
  features: [],
  activeFeatureId: null,
};

function makeScenarioId(file, feature, scenario) {
  return `${file}::${feature}::${scenario}`;
}

function loadPersistedState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed;
  } catch (error) {
    console.error('Impossible de lire le stockage local', error);
    return {};
  }
}

function persistState(data) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    updateStatusMessage('Sauvegardé localement.');
  } catch (error) {
    console.error('Sauvegarde impossible', error);
    updateStatusMessage("Erreur lors de l'enregistrement local.");
  }
}

function updateStatusMessage(message) {
  if (statusMessage) {
    const now = new Date().toLocaleTimeString();
    statusMessage.textContent = `${message} (${now})`;
  }
}

function getPersistedScenarioMap() {
  const persisted = loadPersistedState();
  return persisted.scenarios || {};
}

function setPersistedScenarioMap(map) {
  persistState({ scenarios: map });
}

function applyPersistedState(features) {
  const persisted = getPersistedScenarioMap();
  features.forEach((feature) => {
    feature.scenarios.forEach((scenario) => {
      scenario.featureId = feature.id;
      const existing = persisted[scenario.id];
      if (existing) {
        scenario.status = existing.status || '-';
        scenario.comment = existing.comment || '';
      } else if (!scenario.status) {
        scenario.status = '-';
      }
    });
  });
}

function renderTabs() {
  if (!tabsContainer) return;
  tabsContainer.innerHTML = '';

  if (!state.features.length) {
    const empty = document.createElement('div');
    empty.className = 'p-6 text-center text-base-content/70';
    empty.textContent = 'Aucun scénario à afficher.';
    tabsContainer.appendChild(empty);
    return;
  }

  if (!state.activeFeatureId) {
    state.activeFeatureId = state.features[0].id;
  }

  const header = document.createElement('div');
  header.setAttribute('role', 'tablist');
  header.className = 'tabs tabs-boxed bg-base-200 p-2 flex flex-wrap gap-2';

  state.features.forEach((feature) => {
    const summary = computeFeatureSummary(feature);
    const tab = document.createElement('button');
    tab.setAttribute('role', 'tab');
    tab.dataset.featureId = feature.id;
    tab.className = `tab tab-with-status whitespace-nowrap ${
      feature.id === state.activeFeatureId ? 'tab-active' : ''
    }`;
    const tabTitle = document.createElement('span');
    tabTitle.textContent = feature.title;
    tab.appendChild(tabTitle);

    const badge = document.createElement('span');
    badge.className = `tab-status-badge ${summary.badgeClass}`;
    badge.dataset.featureId = feature.id;
    badge.textContent = summary.badgeLabel;
    tab.appendChild(badge);
    tab.addEventListener('click', () => {
      state.activeFeatureId = feature.id;
      renderTabs();
    });
    header.appendChild(tab);
  });

  const activeFeature = state.features.find(
    (feature) => feature.id === state.activeFeatureId,
  );

  const content = document.createElement('div');
  content.className = 'p-6 space-y-4';

  if (activeFeature) {
    const title = document.createElement('h2');
    title.className = 'text-xl font-semibold';
    title.textContent = activeFeature.title;
    content.appendChild(title);

    const subtitle = document.createElement('p');
    subtitle.className = 'opacity-70';
    subtitle.textContent = `Source : ${activeFeature.file}`;
    content.appendChild(subtitle);

    const summary = computeFeatureSummary(activeFeature);
    const metrics = document.createElement('p');
    metrics.className = 'feature-summary text-sm font-medium';
    metrics.dataset.featureId = activeFeature.id;
    metrics.textContent = formatFeatureSummaryText(summary);
    content.appendChild(metrics);

    const grid = document.createElement('div');
    grid.className = 'scenario-grid';

    activeFeature.scenarios.forEach((scenario) => {
      grid.appendChild(createScenarioCard(scenario, activeFeature));
    });

    content.appendChild(grid);
  }

  tabsContainer.appendChild(header);
  tabsContainer.appendChild(content);
}

function createScenarioCard(scenario, feature) {
  const card = document.createElement('article');
  card.className = 'card bg-base-100 shadow';

  const body = document.createElement('div');
  body.className = 'card-body gap-4';

  const header = document.createElement('div');
  header.className = 'flex flex-col gap-3 md:flex-row md:items-start md:justify-between';

  const title = document.createElement('h3');
  title.className = 'card-title text-lg';
  title.textContent = scenario.name;
  header.appendChild(title);

  const badgeWrapper = document.createElement('div');
  badgeWrapper.className = 'badge-status';

  const badge = document.createElement('span');
  const badgeInfo = STATUS_OPTIONS.find((option) => option.value === scenario.status);
  badge.className = badgeInfo ? `${badgeInfo.badgeClass}` : 'badge badge-ghost';
  badge.textContent = badgeInfo ? badgeInfo.label : scenario.status || '—';
  badgeWrapper.appendChild(badge);

  header.appendChild(badgeWrapper);
  body.appendChild(header);

  if (scenario.steps.length) {
    const steps = document.createElement('pre');
    steps.className = 'scenario-steps';
    steps.textContent = scenario.steps.join('\n');
    body.appendChild(steps);
  }

  const form = document.createElement('div');
  form.className = 'grid gap-4 md:grid-cols-[200px_1fr]';

  const selectWrapper = document.createElement('div');
  selectWrapper.className = 'form-control';

  const selectLabel = document.createElement('label');
  selectLabel.className = 'label';
  selectLabel.innerHTML = '<span class="label-text">Statut</span>';

  const select = document.createElement('select');
  select.className = 'select select-bordered w-full';
  STATUS_OPTIONS.forEach((option) => {
    const opt = document.createElement('option');
    opt.value = option.value;
    opt.textContent = option.label;
    if (option.value === scenario.status) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });

  select.addEventListener('change', (event) => {
    const value = event.target.value;
    scenario.status = value;
    updateBadge(badge, value);
    saveScenarioChange(scenario);
    updateFeatureIndicators(feature.id);
  });

  selectWrapper.appendChild(selectLabel);
  selectWrapper.appendChild(select);

  const textareaWrapper = document.createElement('div');
  textareaWrapper.className = 'form-control';

  const textareaLabel = document.createElement('label');
  textareaLabel.className = 'label';
  textareaLabel.innerHTML = '<span class="label-text">Commentaire</span>';

  const textarea = document.createElement('textarea');
  textarea.className = 'textarea textarea-bordered';
  textarea.value = scenario.comment || '';
  textarea.rows = 3;
  textarea.placeholder = 'Ajoutez un commentaire…';

  textarea.addEventListener('input', (event) => {
    scenario.comment = event.target.value;
    saveScenarioChange(scenario);
  });

  textareaWrapper.appendChild(textareaLabel);
  textareaWrapper.appendChild(textarea);

  form.appendChild(selectWrapper);
  form.appendChild(textareaWrapper);

  body.appendChild(form);
  card.appendChild(body);
  return card;
}

function updateBadge(badge, status) {
  const info = STATUS_OPTIONS.find((option) => option.value === status);
  if (!info) {
    badge.className = 'badge badge-ghost';
    badge.textContent = status || '—';
    return;
  }
  badge.className = info.badgeClass;
  badge.textContent = info.label;
}

function computeFeatureSummary(feature) {
  const counts = {
    total: feature.scenarios.length,
    tested: 0,
    pending: 0,
    ok: 0,
    ko: 0,
    na: 0,
    fix: 0,
  };

  feature.scenarios.forEach((scenario) => {
    const status = scenario.status || '-';
    if (status !== '-') {
      counts.tested += 1;
    } else {
      counts.pending += 1;
    }
    switch (status) {
      case 'OK':
        counts.ok += 1;
        break;
      case 'KO':
        counts.ko += 1;
        break;
      case 'N/A':
        counts.na += 1;
        break;
      case 'FIX':
        counts.fix += 1;
        break;
      default:
        break;
    }
  });

  const badgeState = determineBadgeState(counts);
  return {
    ...counts,
    badgeClass: badgeState.className,
    badgeLabel: badgeState.label,
  };
}

function determineBadgeState(counts) {
  if (!counts.total || counts.pending === counts.total) {
    return { className: 'tab-status-badge--none', label: 'Non testé' };
  }
  if (counts.ok === counts.total) {
    return { className: 'tab-status-badge--complete', label: 'Terminé' };
  }
  return { className: 'tab-status-badge--progress', label: 'En cours' };
}

function formatFeatureSummaryText(summary) {
  return `Nombre de scénarios: ${summary.total}, nombre de scénario testé: ${summary.tested}, OK ${summary.ok}, KO ${summary.ko}, N/A ${summary.na}, FIX ${summary.fix}`;
}

function updateFeatureIndicators(featureId) {
  const feature = state.features.find((item) => item.id === featureId);
  if (!feature) {
    return;
  }
  const summary = computeFeatureSummary(feature);
  const tab = tabsContainer?.querySelector(
    `[role="tab"][data-feature-id="${featureId}"]`,
  );
  if (tab) {
    const badge = tab.querySelector('.tab-status-badge');
    if (badge) {
      badge.className = `tab-status-badge ${summary.badgeClass}`;
      badge.textContent = summary.badgeLabel;
    }
  }

  if (state.activeFeatureId === featureId) {
    const summaryElement = tabsContainer?.querySelector(
      `.feature-summary[data-feature-id="${featureId}"]`,
    );
    if (summaryElement) {
      summaryElement.textContent = formatFeatureSummaryText(summary);
    }
  }
}

function saveScenarioChange(scenario) {
  const persisted = getPersistedScenarioMap();
  persisted[scenario.id] = {
    status: scenario.status,
    comment: scenario.comment,
  };
  setPersistedScenarioMap(persisted);
}

function downloadJson() {
  const data = {
    generatedAt: new Date().toISOString(),
    features: state.features.map((feature) => ({
      id: feature.id,
      title: feature.title,
      file: feature.file,
      scenarios: feature.scenarios.map((scenario) => ({
        id: scenario.id,
        name: scenario.name,
        steps: scenario.steps,
        status: scenario.status,
        comment: scenario.comment,
      })),
    })),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'scenarios.json';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
  updateStatusMessage('JSON exporté.');
}

async function fetchJsonData() {
  try {
    const response = await fetch('./data/scenarios.json', {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }
    return await response.json();
  } catch (error) {
    console.warn('Impossible de charger le JSON pré-généré', error);
    return null;
  }
}

async function loadInitialData() {
  const jsonData = await fetchJsonData();
  if (jsonData && Array.isArray(jsonData.features)) {
    const features = jsonData.features.map(normalizeFeature);
    applyPersistedState(features);
    state.features = features;
    state.activeFeatureId = features[0]?.id ?? null;
    renderTabs();
    updateStatusMessage('Scénarios chargés depuis le JSON.');
    return;
  }

  await generateFromSources();
}

function normalizeFeature(feature) {
  const fallbackId = `${feature.file || 'source'}::${feature.title}`;
  const featureId = feature.id || fallbackId;
  const scenarios = Array.isArray(feature.scenarios)
    ? feature.scenarios.map((scenario) => ({
        id:
          scenario.id ||
          makeScenarioId(feature.file || 'inconnu', feature.title, scenario.name),
        name: scenario.name,
        steps: Array.isArray(scenario.steps) ? scenario.steps : [],
        status: scenario.status || '-',
        comment: scenario.comment || '',
        featureId,
      }))
    : [];
  return {
    id: featureId,
    title: feature.title,
    file: feature.file,
    scenarios,
  };
}

async function generateFromSources() {
  try {
    const filesResponse = await fetch('./data/gherkin-files.json', {
      cache: 'no-store',
    });
    if (!filesResponse.ok) {
      throw new Error('Impossible de charger la liste des fichiers');
    }
    const files = await filesResponse.json();
    if (!Array.isArray(files) || !files.length) {
      throw new Error('Liste de fichiers vide');
    }

    const persisted = getPersistedScenarioMap();
    const features = [];

    for (const file of files) {
      const content = await fetchText(`./gherkin/${file}`);
      const parsed = parseGherkinContent(content, file);
      parsed.forEach((feature) => {
        feature.scenarios.forEach((scenario) => {
          scenario.featureId = feature.id;
          const existing = persisted[scenario.id];
          if (existing) {
            scenario.status = existing.status || '-';
            scenario.comment = existing.comment || '';
          }
        });
        features.push(feature);
      });
    }

    state.features = features;
    state.activeFeatureId = features[0]?.id ?? null;
    renderTabs();
    updateStatusMessage('Scénarios générés à partir des fichiers Gherkin.');
  } catch (error) {
    console.error('Erreur de génération', error);
    updateStatusMessage('Erreur lors de la génération des scénarios.');
  }
}

async function fetchText(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} pour ${path}`);
  }
  return await response.text();
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
          currentScenario.featureId = currentFeature.id;
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
          currentScenario.featureId = currentFeature.id;
          currentFeature.scenarios.push(currentScenario);
        }
        const name = trimmed.replace(/^Scenario(?: Outline)?:/, '').trim();
        currentScenario = {
          id: makeScenarioId(fileName, currentFeature.title, name),
          name,
          steps: [],
          status: '-',
          comment: '',
          featureId: currentFeature.id,
        };
      } else if (currentScenario) {
        currentScenario.steps.push(trimmed);
      }
    });

    if (currentScenario && currentFeature) {
      currentScenario.featureId = currentFeature.id;
      currentFeature.scenarios.push(currentScenario);
    }
    if (currentFeature) {
      features.push(currentFeature);
    }
  });

  return features;
}

function attachEventListeners() {
  generateButton?.addEventListener('click', () => {
    generateFromSources();
  });

  downloadButton?.addEventListener('click', () => {
    downloadJson();
  });
}

(async function init() {
  attachEventListeners();
  await loadInitialData();
})();

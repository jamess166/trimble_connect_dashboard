export async function cargarOpcionesFiltros(models) {
  const atributos = {
    'PR-NIVEL': new Set(),
    'PO-CARS': new Set(),
    'PO-SECTOR': new Set(),
    'PO-WBS': new Set()
  };

  models.forEach(model => {
    if (!model.attributes) return;

    Object.entries(model.attributes).forEach(([key, values]) => {
      const k = key.toUpperCase();
      if (k.includes('PR-NIVEL')) values.forEach(v => atributos['PR-NIVEL'].add(v));
      if (k.includes('PO-CARS')) values.forEach(v => atributos['PO-CARS'].add(v));
      if (k.includes('PO-SECTOR')) values.forEach(v => atributos['PO-SECTOR'].add(v));
      if (k.includes('PO-WBS')) values.forEach(v => atributos['PO-WBS'].add(v));
    });
  });

  const selectores = [
    { id: 'pr-nivel', key: 'PR-NIVEL' },
    { id: 'po-cars', key: 'PO-CARS' },
    { id: 'po-sector', key: 'PO-SECTOR' },
    { id: 'po-wbs', key: 'PO-WBS' }
  ];

  selectores.forEach(({ id, key }) => {
    const select = document.getElementById(id);
    if (!select) return;

    while (select.children.length > 1) {
      select.removeChild(select.lastChild);
    }

    Array.from(atributos[key]).sort().forEach(value => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  });
}

export function aplicarFiltros(models, workspaceAPI) {
  const filters = {
    nivel: getSelectValues('pr-nivel'),
    cars: getSelectValues('po-cars'),
    sector: getSelectValues('po-sector'),
    wbs: getSelectValues('po-wbs'),
    texto: document.getElementById('search-text').value.toLowerCase(),
    aislar: document.getElementById('isolate-filtered').checked
  };

  const filtrados = models.filter(model => {
    const attr = model.attributes || {};

    const coincide = (filtro, clave) => {
      if (!filtro.length) return true;
      return Object.entries(attr).some(([k, v]) =>
        k.toUpperCase().includes(clave) && v.some(val => filtro.includes(val))
      );
    };

    const porTexto = !filters.texto || (
      (model.name || '').toLowerCase().includes(filters.texto) ||
      (model.description || '').toLowerCase().includes(filters.texto)
    );

    return (
      coincide(filters.nivel, 'PR-NIVEL') &&
      coincide(filters.cars, 'PO-CARS') &&
      coincide(filters.sector, 'PO-SECTOR') &&
      coincide(filters.wbs, 'PO-WBS') &&
      porTexto
    );
  });

  // Visualización en visor
  if (filters.aislar && workspaceAPI.viewer?.isolateModels) {
    workspaceAPI.viewer.isolateModels(filtrados.map(m => m.id));
  } else if (workspaceAPI.viewer?.highlightModels) {
    workspaceAPI.viewer.highlightModels(filtrados.map(m => m.id));
  }

  return filtrados;
}

export function limpiarFiltros() {
  document.getElementById('pr-nivel').selectedIndex = 0;
  document.getElementById('po-cars').selectedIndex = 0;
  document.getElementById('po-sector').selectedIndex = 0;
  document.getElementById('po-wbs').selectedIndex = 0;
  document.getElementById('search-text').value = '';
}

function getSelectValues(id) {
  return Array.from(document.getElementById(id).selectedOptions)
    .map(o => o.value)
    .filter(v => v);
}

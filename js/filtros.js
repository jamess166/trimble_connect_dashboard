export async function cargarOpcionesFiltros(models) {
    // poblar selects como en tu código anterior (con PR-NIVEL, PO-CARS, etc.)
}

export function aplicarFiltros(models, workspaceAPI) {
    const filters = {
        nivel: getSelectValues('pr-nivel'),
        cars: getSelectValues('po-cars'),
        sector: getSelectValues('po-sector'),
        wbs: getSelectValues('po-wbs'),
        texto: document.getElementById('search-text').value.toLowerCase(),
        tipo: document.getElementById('model-type').value,
        aislar: document.getElementById('isolate-filtered').checked
    };

    const filtrados = models.filter(m => {
        // lógica de coincidencia de atributos, texto, tipo
        return true; // simplificado para ejemplo
    });

    if (filters.aislar && workspaceAPI.isolateModels) {
        workspaceAPI.isolateModels(filtrados.map(m => m.id));
    } else if (workspaceAPI.highlightModels) {
        workspaceAPI.highlightModels(filtrados.map(m => m.id));
    }

    return filtrados;
}

export function limpiarFiltros() {
    document.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
    document.getElementById('search-text').value = '';
    document.getElementById('model-type').selectedIndex = 0;
}

function getSelectValues(id) {
    return Array.from(document.getElementById(id).selectedOptions)
        .map(o => o.value).filter(v => v);
}
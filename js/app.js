import { inicializarAPI, cargarElementosConNivel } from './trimble-api.js';
import { mostrarResultados, mostrarError, ocultarLoading, mostrarLoading } from './ui.js';

let workspaceAPI = null;
let todosLosElementos = [];
let elementosFiltrados = [];

document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log("🔄 Inicializando extensión...");
    mostrarLoading();

    // Inicializar API de Trimble Connect
    const api = await inicializarAPI();
    workspaceAPI = api.workspaceAPI;
    console.log("✅ API conectada");

    // Cargar todos los elementos con su nivel
    console.log("🔄 Cargando elementos del modelo...");
    todosLosElementos = await cargarElementosConNivel(workspaceAPI);
    console.log(`✅ ${todosLosElementos.length} elementos cargados`);

    // Extraer niveles únicos
    const nivelesUnicos = [...new Set(todosLosElementos.map(el => el.nivel))].sort();
    console.log("Niveles encontrados:", nivelesUnicos);

    // Crear checkboxes
    crearCheckboxesNiveles(nivelesUnicos);

    ocultarLoading();

    // Mostrar todos inicialmente
    elementosFiltrados = [...todosLosElementos];
    mostrarResultados(elementosFiltrados);

    // Configurar eventos de botones
    document.getElementById('btn-aplicar').addEventListener('click', aplicarFiltros);
    document.getElementById('btn-limpiar').addEventListener('click', limpiarFiltros);
    document.getElementById('btn-seleccionar-todos').addEventListener('click', seleccionarTodos);

  } catch (err) {
    console.error("❌ Error inicializando extensión:", err);
    mostrarError(err.message);
    ocultarLoading();
  }
});

function crearCheckboxesNiveles(niveles) {
  const container = document.getElementById('checkbox-container');
  
  if (niveles.length === 0) {
    container.innerHTML = '<p style="padding: 20px; text-align: center;">No se encontraron niveles en el modelo</p>';
    return;
  }

  container.innerHTML = '';

  niveles.forEach(nivel => {
    const div = document.createElement('div');
    div.className = 'checkbox-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `nivel-${nivel}`;
    checkbox.value = nivel;
    checkbox.checked = true; // Por defecto todos seleccionados

    const label = document.createElement('label');
    label.htmlFor = `nivel-${nivel}`;
    label.textContent = nivel;

    div.appendChild(checkbox);
    div.appendChild(label);
    container.appendChild(div);
  });
}

function aplicarFiltros() {
  const checkboxes = document.querySelectorAll('#checkbox-container input[type="checkbox"]:checked');
  const nivelesSeleccionados = Array.from(checkboxes).map(cb => cb.value);

  console.log("Niveles seleccionados:", nivelesSeleccionados);

  if (nivelesSeleccionados.length === 0) {
    elementosFiltrados = [];
  } else {
    elementosFiltrados = todosLosElementos.filter(el => 
      nivelesSeleccionados.includes(el.nivel)
    );
  }

  console.log(`Filtrados: ${elementosFiltrados.length} elementos`);
  mostrarResultados(elementosFiltrados);

  // Opcional: Resaltar en el visor de Trimble
  if (workspaceAPI.viewer?.highlightObjects && elementosFiltrados.length > 0) {
    const objetosParaResaltar = elementosFiltrados.map(el => ({
      modelId: el.modelId,
      objectId: el.objectId
    }));
    workspaceAPI.viewer.highlightObjects(objetosParaResaltar);
  }
}

function limpiarFiltros() {
  const checkboxes = document.querySelectorAll('#checkbox-container input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = false);
  
  elementosFiltrados = [];
  mostrarResultados(elementosFiltrados);

  // Limpiar resaltado
  if (workspaceAPI.viewer?.clearHighlight) {
    workspaceAPI.viewer.clearHighlight();
  }
}

function seleccionarTodos() {
  const checkboxes = document.querySelectorAll('#checkbox-container input[type="checkbox"]');
  const todosMarcados = Array.from(checkboxes).every(cb => cb.checked);
  
  checkboxes.forEach(cb => cb.checked = !todosMarcados);
}
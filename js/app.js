import { inicializarAPI, cargarModelos } from './trimble-api.js';
import { cargarOpcionesFiltros, aplicarFiltros, limpiarFiltros } from './filtros.js';
import { mostrarResultados, mostrarError } from './ui.js';

let workspaceAPI = null;
let allModels = [];
let filteredModels = [];

document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log("Esperando conexión con TrimbleConnectWorkspace...");
    const api = await inicializarAPI();
    workspaceAPI = api.workspaceAPI;

    console.log("Cargando modelos IFC...");
    allModels = await cargarModelos(workspaceAPI);
    filteredModels = [...allModels];

    console.log("Cargando opciones de filtros...");
    await cargarOpcionesFiltros(allModels);
    mostrarResultados(filteredModels);

    // ✅ Eventos con IDs únicos
    document.getElementById('btn-aplicar').addEventListener('click', () => {
      filteredModels = aplicarFiltros(allModels, workspaceAPI);
      mostrarResultados(filteredModels);
    });

    document.getElementById('btn-limpiar').addEventListener('click', () => {
      limpiarFiltros();
      filteredModels = [...allModels];
      mostrarResultados(filteredModels);
    });

    const btnDiag = document.getElementById('btn-diagnostico');
    if (btnDiag) {
      btnDiag.addEventListener('click', () => {
        console.log("Diagnóstico - Total modelos:", allModels.length);
        console.log("Filtrados actualmente:", filteredModels.length);
      });
    }

  } catch (err) {
    console.error("Error inicializando extensión:", err);
    mostrarError(err.message);
  }
});

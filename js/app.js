import { inicializarTrimble, cargarModelos } from './trimble-api.js';
import { cargarOpcionesFiltros, aplicarFiltros, limpiarFiltros } from './filtros.js';
import { mostrarResultados, mostrarMensaje, mostrarError } from './ui.js';

let workspaceAPI = null;
let allModels = [];
let filteredModels = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        workspaceAPI = await inicializarTrimble();
        allModels = await cargarModelos(workspaceAPI);
        filteredModels = [...allModels];
        await cargarOpcionesFiltros(allModels);
        mostrarResultados(filteredModels);

        document.querySelector('.btn-primary').addEventListener('click', () => {
            filteredModels = aplicarFiltros(allModels, workspaceAPI);
            mostrarResultados(filteredModels);
        });

        document.querySelector('.btn-secondary').addEventListener('click', () => {
            limpiarFiltros();
            filteredModels = [...allModels];
            mostrarResultados(filteredModels);
        });

    } catch (error) {
        mostrarError(error.message);
    }
});

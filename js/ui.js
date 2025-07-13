// ui.js - Funciones para manejar la interfaz de usuario

export function mostrarResultados(models) {
  const container = document.getElementById('results-container');
  if (!container) {
    console.error("❌ Contenedor de resultados no encontrado");
    return;
  }

  if (!models || models.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <p>No se encontraron modelos que coincidan con los filtros aplicados.</p>
      </div>
    `;
    return;
  }

  let html = `
    <div class="results-header">
      <h3>Resultados (${models.length} modelos)</h3>
    </div>
    <div class="results-list">
  `;

  models.forEach((model, index) => {
    const attributes = model.attributes || {};
    const attributesList = Object.entries(attributes)
      .map(([key, values]) => `<li><strong>${key}:</strong> ${Array.isArray(values) ? values.join(', ') : values}</li>`)
      .join('');

    html += `
      <div class="result-item">
        <div class="result-header">
          <h4>${model.name || 'Modelo sin nombre'}</h4>
          <span class="result-index">#${index + 1}</span>
        </div>
        ${model.description ? `<p class="result-description">${model.description}</p>` : ''}
        <div class="result-details">
          <p><strong>ID:</strong> ${model.id || 'N/A'}</p>
          <p><strong>Objetos:</strong> ${model.objects ? model.objects.length : 0}</p>
          ${attributesList ? `
            <div class="attributes">
              <strong>Atributos:</strong>
              <ul>${attributesList}</ul>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  });

  html += `
    </div>
  `;

  container.innerHTML = html;
}

export function mostrarError(mensaje) {
  const errorContainer = document.getElementById('error-container');
  if (!errorContainer) {
    console.error("❌ Contenedor de errores no encontrado");
    alert(`Error: ${mensaje}`);
    return;
  }

  errorContainer.innerHTML = `
    <div class="error-message">
      <strong>Error:</strong> ${mensaje}
      <button onclick="this.parentElement.remove()" class="error-close">×</button>
    </div>
  `;

  // Auto-ocultar después de 10 segundos
  setTimeout(() => {
    const errorMsg = errorContainer.querySelector('.error-message');
    if (errorMsg) {
      errorMsg.remove();
    }
  }, 10000);
}

export function limpiarError() {
  const errorContainer = document.getElementById('error-container');
  if (errorContainer) {
    errorContainer.innerHTML = '';
  }
}

// Función auxiliar para mostrar información de diagnóstico
export function mostrarDiagnostico(info) {
  const container = document.getElementById('results-container');
  if (!container) return;

  container.innerHTML = `
    <div class="diagnostic-info">
      <h3>Información de Diagnóstico</h3>
      <pre>${JSON.stringify(info, null, 2)}</pre>
    </div>
  `;
}
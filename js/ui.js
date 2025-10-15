export function mostrarResultados(elementos) {
  const container = document.getElementById('results-container');
  const countElement = document.getElementById('results-count');

  if (!container || !countElement) {
    console.error("❌ Contenedores no encontrados");
    return;
  }

  // Actualizar contador
  countElement.textContent = `${elementos.length} elementos encontrados`;

  // Si no hay elementos
  if (elementos.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <p>No se encontraron elementos con los filtros seleccionados.</p>
      </div>
    `;
    return;
  }

  // Crear tabla con resultados
  let html = `
    <table class="results-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre del Elemento</th>
          <th>Nivel</th>
          <th>Modelo</th>
        </tr>
      </thead>
      <tbody>
  `;

  elementos.forEach((elemento, index) => {
    html += `
      <tr>
        <td>${index + 1}</td>
        <td>${elemento.objectName}</td>
        <td><strong>${elemento.nivel}</strong></td>
        <td>${elemento.modelName}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  container.innerHTML = html;
}

export function mostrarError(mensaje) {
  const errorContainer = document.getElementById('error-message');
  
  if (!errorContainer) {
    console.error("❌ Contenedor de errores no encontrado");
    alert(`Error: ${mensaje}`);
    return;
  }

  errorContainer.style.display = 'block';
  errorContainer.innerHTML = `
    <strong>❌ Error:</strong> ${mensaje}
  `;

  // Auto-ocultar después de 10 segundos
  setTimeout(() => {
    errorContainer.style.display = 'none';
  }, 10000);
}

export function mostrarLoading() {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.style.display = 'block';
  }
}

export function ocultarLoading() {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.style.display = 'none';
  }
}
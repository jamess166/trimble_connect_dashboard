export function mostrarResultados(modelos) {
    const grid = document.getElementById('model-grid');
    const count = document.getElementById('results-count');

    count.textContent = `${modelos.length} modelos encontrados`;

    grid.innerHTML = modelos.map(m => `
        <div class="model-card">
            <h4>${m.name}</h4>
            <p>${m.description || 'Sin descripción'}</p>
        </div>
    `).join('');
}

export function mostrarMensaje(msg) {
    alert(msg);
}

export function mostrarError(msg) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = msg;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 5000);
}

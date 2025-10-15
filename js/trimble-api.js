export async function inicializarAPI() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Timeout: No se pudo conectar con Trimble Connect'));
    }, 30000);

    window.TrimbleConnectWorkspace.connect(
      (event, data) => {
        console.log('Evento de Trimble:', event, data);
      },
      (error) => {
        clearTimeout(timeout);
        console.error('Error conectando:', error);
        reject(error);
      },
      (workspaceAPI) => {
        clearTimeout(timeout);
        console.log('✅ Conectado a Trimble Connect Workspace API');
        resolve({ workspaceAPI });
      }
    );
  });
}

export async function cargarElementosConNivel(workspaceAPI) {
  const elementos = [];

  try {
    // Obtener todos los modelos
    const modelos = await workspaceAPI.getModels();
    console.log(`📦 Modelos encontrados: ${modelos.length}`);

    // Filtrar solo modelos IFC
    const modelosIFC = modelos.filter(modelo =>
      modelo.name?.toLowerCase().endsWith('.ifc')
    );
    console.log(`📐 Modelos IFC: ${modelosIFC.length}`);

    // Para cada modelo IFC
    for (const modelo of modelosIFC) {
      console.log(`🔍 Procesando modelo: ${modelo.name}`);

      try {
        // Obtener objetos del modelo
        const objetos = await workspaceAPI.getModelObjects(modelo.id);
        console.log(`  📊 Objetos en ${modelo.name}: ${objetos?.length || 0}`);

        if (!objetos || objetos.length === 0) continue;

        // Para cada objeto
        for (const objeto of objetos) {
          try {
            // Obtener propiedades del objeto
            const propiedades = await workspaceAPI.getObjectProperties(modelo.id, objeto.id);

            if (!propiedades) continue;

            // Buscar la propiedad PR-NIVEL
            let nivelEncontrado = null;
            
            for (const prop of propiedades) {
              const nombreProp = prop.name?.toUpperCase() || '';
              
              if (nombreProp.includes('PR-NIVEL') || nombreProp.includes('NIVEL')) {
                nivelEncontrado = prop.value;
                break;
              }
            }

            // Si encontramos el nivel, guardamos el elemento
            if (nivelEncontrado) {
              elementos.push({
                modelId: modelo.id,
                modelName: modelo.name,
                objectId: objeto.id,
                objectName: objeto.name || 'Sin nombre',
                nivel: nivelEncontrado
              });
            }

          } catch (err) {
            console.warn(`  ⚠️ Error obteniendo propiedades del objeto ${objeto.id}:`, err);
          }
        }

      } catch (err) {
        console.error(`❌ Error procesando modelo ${modelo.name}:`, err);
      }
    }

    console.log(`✅ Total elementos con nivel encontrados: ${elementos.length}`);
    return elementos;

  } catch (err) {
    console.error('❌ Error cargando elementos:', err);
    throw err;
  }
}
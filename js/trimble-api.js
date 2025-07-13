export async function cargarModelos(workspaceAPI) {
  const models = await workspaceAPI.getModels();

  const ifcModels = models.filter(model =>
    model.name?.toLowerCase().endsWith('.ifc')
  );

  for (const model of ifcModels) {
    const objects = await workspaceAPI.getModelObjects(model.id);
    model.objects = objects || [];

    const atributos = {};

    for (const obj of model.objects) {
      try {
        const props = await workspaceAPI.getObjectProperties(model.id, obj.id);
        props?.forEach(prop => {
          const nombre = prop.name?.toUpperCase();
          const valor = prop.value;
          if (!nombre || !valor) return;

          if (["PR-NIVEL", "PO-CARS", "PO-SECTOR", "PO-WBS"].some(k => nombre.includes(k))) {
            if (!atributos[nombre]) atributos[nombre] = new Set();
            atributos[nombre].add(valor);
          }
        });
      } catch (err) {
        console.warn("Error al obtener propiedades:", err);
      }
    }

    model.attributes = {};
    Object.entries(atributos).forEach(([k, v]) => {
      model.attributes[k] = Array.from(v);
    });
  }

  return ifcModels;
}

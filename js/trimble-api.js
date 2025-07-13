export async function inicializarTrimble() {
    const workspaceAPI = new TrimbleConnectWorkspace.WorkspaceAPI();
    const project = await workspaceAPI.getProject();
    console.log('Proyecto actual:', project);
    return workspaceAPI;
}

export async function cargarModelos(workspaceAPI) {
    const models = await workspaceAPI.getModels();
    for (let model of models) {
        const objects = await workspaceAPI.getModelObjects(model.id);
        model.objects = objects;
        model.attributes = {}; // puedes añadir procesamiento si deseas
    }
    return models;
}

import * as Extensions from "trimble-connect-project-workspace-api";

(async () => {
  try {
    // Conexión a la API de Trimble Connect
    const API = await Extensions.connect(
      window.parent,
      (event, args) => {
        switch (event) {
          case "extension.command":
            if (args.data === "main_nav_menu_clicked") {
              console.log("Botón del menú principal clickeado");
            }
            break;
          default:
            console.log("Evento no reconocido:", event);
        }
      },
      30000 // Tiempo de espera para la conexión
    );

    // Definir el menú principal
    const mainMenuObject = {
      title: "Mi Extensión de Empresa",
      icon: "https://jamess166.github.io/trimble_connect_dashboard/logo.png", // Asegúrate de que esta URL sea accesible
      command: "main_nav_menu_clicked",
    };

    // Comprobar si la API está disponible y asignar el menú
    if (API && API.ui) {
      await API.ui.setMenu(mainMenuObject);
      console.log("Menú cargado en la barra lateral");
    } else {
      console.log("No se pudo acceder a la API de UI");
    }
  } catch (error) {
    console.error("Error al conectar con la API de Trimble Connect:", error);
  }
})();
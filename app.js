import * as Extensions from "trimble-connect-project-workspace-api";

(async () => {
  // Conexión a la API
  const API = await Extensions.connect(
    window.parent,
    (event, args) => {
      switch (event) {
        case "extension.command":
          if (args.data === "main_nav_menu_clicked") {
            console.log("Botón del menú principal clickeado");
            // Aquí puedes agregar más funcionalidades si lo deseas
          }
          break;
        default:
          console.log("Evento no reconocido:", event);
      }
    },
    30000 // Tiempo de espera de conexión
  );

  // Definir el menú principal
  const mainMenuObject = {
    title: "Mi Extensión de Empresa",
    icon: "https://jamess166.github.io/trimble_connect_dashboard/logo.png",  // Ícono del botón en la barra lateral
    command: "main_nav_menu_clicked",
  };

  // Asignar el menú a la interfaz de usuario de Trimble Connect
  API.ui.setMenu(mainMenuObject);

  console.log("Menú cargado en la barra lateral");
})();

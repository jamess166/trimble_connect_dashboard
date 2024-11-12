import * as Extensions from "trimble-connect-project-workspace-api";

// Conectarse a la API de Trimble Connect
Extensions.connect(
  window.parent,
  (event, args) => {
    switch (event) {
      case "extension.command":
        console.log("Comando ejecutado por el usuario:", args.data);
        break;
      case "extension.accessToken":
        console.log("Token de acceso o estado:", args.data);
        break;
      case "extension.userSettingsChanged":
        console.log("Configuración de usuario cambiada");
        break;
      default:
        console.log("Evento no reconocido:", event);
    }
  },
  30000 // Tiempo de espera de conexión en milisegundos
);

// Puedes agregar funciones adicionales para manejar eventos o agregar interactividad en el futuro
console.log("Extensión inicializada");

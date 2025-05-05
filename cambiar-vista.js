  // Al cargar la página, aplicamos la vista guardada
  document.addEventListener("DOMContentLoaded", function () {
    const botonVista = document.getElementById("botonVista");
    const body = document.body;

    // Leer de localStorage o usar 'pc' por defecto
    const vistaGuardada = localStorage.getItem("tipoVista") || "pc";
    body.classList.add(vistaGuardada === "movil" ? "vista-movil" : "vista-pc");

    function actualizarTextoBoton() {
      if (body.classList.contains("vista-pc")) {
        botonVista.textContent = "Cambiar a vista móvil";
      } else {
        botonVista.textContent = "Cambiar a vista PC";
      }
    }

    botonVista.addEventListener("click", function () {
      if (body.classList.contains("vista-pc")) {
        body.classList.remove("vista-pc");
        body.classList.add("vista-movil");
        localStorage.setItem("tipoVista", "movil");
      } else {
        body.classList.remove("vista-movil");
        body.classList.add("vista-pc");
        localStorage.setItem("tipoVista", "pc");
      }
      actualizarTextoBoton();
    });

    actualizarTextoBoton(); // Al cargar, actualiza el texto
  });
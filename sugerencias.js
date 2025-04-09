document.getElementById("boton-sugerencia").addEventListener("click", function () {
    const destinatario = "tucorreo@gmail.com"; // Cámbialo por el tuyo
    const asunto = encodeURIComponent("Sugerencia para la web");
    const cuerpo = encodeURIComponent("\n\n");
  
    const enlace = `https://mail.google.com/mail/?view=cm&fs=1&to=${destinatario}&su=${asunto}&body=${cuerpo}`;
    window.open(enlace, "_blank");
  });
  
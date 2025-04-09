document.getElementById("boton-sugerencia").addEventListener("click", function () {
    const destinatario = "soporte.cafes.los.angeles@gmail.com"; // Cámbialo por el tuyo
    const asunto = encodeURIComponent("Pregunta de la pagina web");
    const cuerpo = encodeURIComponent("\n\n");
  
    const enlace = `https://mail.google.com/mail/?view=cm&fs=1&to=${destinatario}&su=${asunto}&body=${cuerpo}`;
    window.open(enlace, "_blank");
  });
  
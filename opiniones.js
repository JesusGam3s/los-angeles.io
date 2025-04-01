document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("opinion-form");
    const opinionesContainer = document.getElementById("opiniones-container");
    const filtro = document.getElementById("filtro-opiniones");

    // Verificar si el usuario ya opinó al cargar la página
    verificarEstadoFormulario();
    cargarOpiniones();

    // Enviar opinión
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const comentario = document.getElementById("comentario").value.trim();
        const calificacion = document.getElementById("calificacion").value;

        if (nombre === "" || comentario === "") {
            alert("Por favor, completa todos los campos.");
            return;
        }

        // Verificar si el nombre contiene palabras prohibidas
        if (!validarNombre(nombre)) {
            alert("Este nombre contiene palabras no permitidas.");
            return;
        }

        // Verificar si ya opinó desde este dispositivo
        if (localStorage.getItem("yaOpino")) {
            alert("¡Solo puedes enviar una opinión por dispositivo!");
            return;
        }

        const opinion = {
            nombre,
            comentario,
            calificacion,
            fecha: new Date().toISOString()
        };

        // Guardar en Firestore
        guardarOpinion(opinion).add({
            nombre: nombre,
            opinion: opinion,
            calificacion: calificacion,
            fecha: new Date()
        })
        .then(() => {
            alert("¡Opinión enviada!");
            document.getElementById("nombre").value = "";
            document.getElementById("opinion").value = "";
            document.getElementById("calificacion").value = "";
            mostrarOpiniones(); // Actualizar opiniones en la página
        })
        .catch(error => {
            console.error("Error al enviar opinión: ", error);
        });

        // Reiniciar el formulario
        form.reset();

        // Recargar las opiniones
        cargarOpiniones();
    });

    // Guardar la opinión en localStorage
    function guardarOpinion(opinion) {
        let opiniones = JSON.parse(localStorage.getItem("opiniones")) || [];
        opiniones.push(opinion);
        localStorage.setItem("opiniones", JSON.stringify(opiniones));

        // Marcar que este dispositivo ya ha opinado
        localStorage.setItem("yaOpino", "true");
        localStorage.setItem("usuarioOpino", opinion.nombre);

        // Ocultar formulario después de enviar la opinión
        document.getElementById("opinion-form").style.display = "none";
    }

    // Cargar las opiniones desde localStorage
    function cargarOpiniones(filtroSeleccionado = "todas") {
        let opiniones = JSON.parse(localStorage.getItem("opiniones")) || [];

        // Aplicar el filtro
        if (filtroSeleccionado === "positivas") {
            opiniones = opiniones.filter(op => op.calificacion >= 4);
        } else if (filtroSeleccionado === "negativas") {
            opiniones = opiniones.filter(op => op.calificacion <= 2);
        } else if (filtroSeleccionado === "media") {
            opiniones = opiniones.filter(op => op.calificacion === 3);
        } else if (filtroSeleccionado === "recientes") {
            opiniones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Más recientes primero
        }

        opinionesContainer.innerHTML = ""; // Limpiar antes de cargar

        // Mostrar las opiniones
        opiniones.forEach((opinion, index) => {
            const opinionElemento = document.createElement("div");
            opinionElemento.innerHTML = `
                <p><strong>${opinion.nombre}</strong> (${opinion.calificacion}⭐): ${opinion.comentario}</p>
                <button class="eliminar-btn" data-index="${index}">❌ Eliminar</button>
                <hr>
            `;
            opinionesContainer.appendChild(opinionElemento);

            // Agregar evento para eliminar la opinión
            opinionElemento.querySelector(".eliminar-btn").addEventListener("click", function () {
                eliminarOpinion(index);
            });
        });

        verificarEstadoFormulario(); // Verificar si el formulario debe estar visible o no
    }

    // Eliminar la opinión
    function eliminarOpinion(index) {
        let opiniones = JSON.parse(localStorage.getItem("opiniones")) || [];
        let usuarioActual = localStorage.getItem("usuarioOpino");

        if (opiniones[index].nombre === usuarioActual) {
            // Eliminar la opinión de la lista
            opiniones.splice(index, 1);
            localStorage.setItem("opiniones", JSON.stringify(opiniones));

            // Permitir que el usuario vuelva a opinar
            localStorage.removeItem("yaOpino");
            localStorage.removeItem("usuarioOpino");

            // Mostrar el formulario de nuevo
            document.getElementById("opinion-form").style.display = "block";
        } else {
            alert("¡No puedes eliminar opiniones de otros usuarios!");
        }

        cargarOpiniones(); // Recargar las opiniones después de eliminar
    }

    // Validar el nombre (bloquear palabras malsonantes)
    function validarNombre(nombre) {
        const palabrasBloqueadas = ["Paquito", "idiota", "malo", "feo"]; // Puedes agregar más
        const nombreMinusculas = nombre.toLowerCase();

        return !palabrasBloqueadas.some(palabra => nombreMinusculas.includes(palabra));
    }

    // Verificar el estado del formulario (si ya opinó o no)
    function verificarEstadoFormulario() {
        if (localStorage.getItem("yaOpino")) {
            document.getElementById("opinion-form").style.display = "none"; // Ocultar el formulario
        } else {
            document.getElementById("opinion-form").style.display = "block"; // Mostrar el formulario
        }
    }

    // Filtrar opiniones
    filtro.addEventListener("change", function () {
        cargarOpiniones(this.value);
    });
    function mostrarOpiniones() {
        let contenedor = document.getElementById("listaOpiniones");
        contenedor.innerHTML = "";
    
        db.collection("opiniones").orderBy("fecha", "desc").onSnapshot(snapshot => {
            contenedor.innerHTML = ""; // Limpiar antes de agregar nuevas
            snapshot.forEach(doc => {
                let datos = doc.data();
                contenedor.innerHTML += `
                    <div class="opinion">
                        <strong>${datos.nombre}</strong> - ${datos.calificacion} estrellas
                        <p>${datos.opinion}</p>
                        <small>${new Date(datos.fecha.toDate()).toLocaleString()}</small>
                    </div>
                `;
            });
        });
    }
});

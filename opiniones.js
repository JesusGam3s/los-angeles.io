function obtenerIDDispositivo() {
    let id = localStorage.getItem("dispositivoId");
    if (!id) {
        id = crypto.randomUUID(); // Genera un identificador único
        localStorage.setItem("dispositivoId", id);
    }
    return id;
}

if (!localStorage.getItem("dispositivoId")) {
    localStorage.setItem("dispositivoId", crypto.randomUUID()); // Genera un ID único
}
let dispositivoId = localStorage.getItem("dispositivoId");

import { firebaseConfig } from "./firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// 🔥 Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// 📌 Cargar opiniones al iniciar la página
document.addEventListener("DOMContentLoaded", cargarOpiniones);

import { deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// 📌 Función para eliminar una opinión propia
async function eliminarOpinion(opinionId) {
    if (!confirm("¿Seguro que quieres eliminar tu opinión?")) return;

    try {
        await deleteDoc(doc(db, "opiniones", opinionId));
        localStorage.removeItem("opinionGuardada");
        alert("Opinión eliminada");
        cargarOpiniones();
    } catch (error) {
        console.error("Error al eliminar la opinión:", error);
        alert("No se pudo eliminar la opinión.");
    }
}

// Hacer la función accesible globalmente
window.eliminarOpinion = eliminarOpinion;

// 📌 Modificar la función de enviar opinión para que solo permita 1 por dispositivo
document.getElementById("form-opinion").addEventListener("submit", async function (e) {
    e.preventDefault();

    function generarIdUnico() {
        let id = `${navigator.userAgent}-${Date.now()}`;
        localStorage.setItem("dispositivoId", id);
        return id;
    }

// Obtener identificador del dispositivo (navigator.userAgent)
const dispositivoId = localStorage.getItem("dispositivoId") || generarIdUnico();

if (localStorage.getItem("opinionGuardada") || localStorage.getItem(`opinion_${dispositivoId}`)) {
    alert("Ya has enviado una opinión desde este dispositivo. Elimina la anterior para escribir otra.");
    return;
}
    let nombre = document.getElementById("nombre").value.trim();
    let opinion = document.getElementById("opinion").value.trim();
    let calificacion = document.getElementById("calificacion").value;

    if (nombre === "" || opinion === "" || calificacion === "") {
        alert("Por favor, rellena todos los campos");
        return;
    }

    try {
        const dispositivoId = obtenerIDDispositivo(); // Obtiene el ID del dispositivo

        // Verificar si el dispositivo ya envió una opinión
        const opinionesRef = collection(db, "opiniones");
        const querySnapshot = await getDocs(opinionesRef);
        let yaEnviado = false;
        
        querySnapshot.forEach((docSnap) => {
            if (docSnap.data().dispositivoId === dispositivoId) {
                yaEnviado = true;
            }
        });
        
        if (yaEnviado) {
            alert("Ya has enviado una opinión desde este dispositivo.");
            return;
        }
        
        // Guardar la nueva opinión con el ID del dispositivo
        const docRef = await addDoc(opinionesRef, {
            nombre: nombre,
            opinion: opinion,
            calificacion: calificacion,
            dispositivoId: dispositivoId // 🔥 Guardamos el ID del dispositivo en Firebase
        });
        localStorage.setItem("opinionGuardada", docRef.id);
        alert("¡Opinión enviada!");
        document.getElementById("form-opinion").reset();
        cargarOpiniones();
    } catch (error) {
        console.error("Error al enviar la opinión:", error);
        alert("Error al enviar la opinión");
    }
});

// 📌 Función para cargar opiniones con filtro de calificación (evita duplicados)
async function cargarOpiniones(filtroCalificacion = "todas") {
    const opinionesContainer = document.getElementById("opiniones-lista");
    opinionesContainer.innerHTML = ""; // 🔥 Limpiar contenido antes de agregar opiniones (evita duplicados)

    const dispositivoOpinionId = localStorage.getItem("opinionGuardada"); // Obtener ID de la opinión guardada en el dispositivo

    try {
        const querySnapshot = await getDocs(collection(db, "opiniones"));
        let opinionesHTML = ""; // 🔥 Acumular opiniones en una variable (mejor rendimiento)

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const opinionId = docSnap.id; // ID de la opinión en Firebase

            const esOpinionDelDispositivo = (dispositivoOpinionId === opinionId); // Comparar ID guardada con la de Firebase

            // 📌 Aplicar filtro de calificación
            if (filtroCalificacion !== "todas" && data.calificacion != filtroCalificacion) {
                return; // Si la calificación no coincide, no la muestra
            }

            // 🔥 Agregar la opinión a la variable (sin modificar `innerHTML` en cada iteración)
            opinionesHTML += `
                <div class="opinion">
                    <h3>${data.nombre}</h3>
                    <p>${data.opinion}</p>
                    <span>⭐ ${data.calificacion} / 5</span>
                    ${esOpinionDelDispositivo ? `<button onclick="eliminarOpinion('${opinionId}')">Eliminar</button>` : ""}
                </div>
            `;
        });

        opinionesContainer.innerHTML = opinionesHTML; // 🔥 Agregar todas las opiniones una sola vez (evita parpadeos y duplicaciones)
    } catch (error) {
        console.error("Error al cargar opiniones:", error);
    }
}

    // 📌 Evento para filtrar opiniones cuando cambia el select
    document.getElementById("filtro-opiniones").addEventListener("change", function () {
        let filtroSeleccionado = this.value;
        cargarOpiniones(filtroSeleccionado);
});

// Agregar evento para eliminar después de cargar opiniones
document.querySelectorAll(".eliminar-btn").forEach(button => {
    button.addEventListener("click", function () {
        eliminarOpinion(this.getAttribute("data-id"));
    });
});

localStorage.removeItem(`opinion_${dispositivoId}`);
localStorage.removeItem("opinionGuardada");

document.getElementById("filtro-opiniones").addEventListener("change", function () {
    let filtroSeleccionado = this.value;
    console.log(`Filtro seleccionado: ${filtroSeleccionado}`);
    cargarOpiniones(filtroSeleccionado);
});
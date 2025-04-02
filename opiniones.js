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

    if (localStorage.getItem("opinionGuardada")) {
        alert("Ya has enviado una opinión. Elimina la anterior para escribir otra.");
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
        const docRef = await addDoc(collection(db, "opiniones"), {
            nombre: nombre,
            opinion: opinion,
            calificacion: calificacion
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

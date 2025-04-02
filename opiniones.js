import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { firebaseConfig } from "./firebaseConfig.js";

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para enviar opinión
document.getElementById("opinionForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    let nombre = document.getElementById("nombre").value.trim();
    let opinion = document.getElementById("opinion").value.trim();
    let calificacion = document.getElementById("calificacion").value;

    if (!nombre || !opinion || !calificacion) {
        alert("Por favor, rellena todos los campos.");
        return;
    }

    try {
        await addDoc(collection(db, "opiniones"), {
            nombre: nombre,
            opinion: opinion,
            calificacion: calificacion,
            timestamp: new Date()
        });

        alert("Opinión enviada correctamente.");
        document.getElementById("opinionForm").reset();
        mostrarOpiniones();  // Recargar opiniones después de enviar una nueva
    } catch (error) {
        console.error("Error al enviar opinión: ", error);
    }
});

// Función para mostrar opiniones
async function mostrarOpiniones() {
    const opinionesContainer = document.getElementById("opinionesContainer");
    opinionesContainer.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "opiniones"));
    querySnapshot.forEach((doc) => {
        let data = doc.data();
        let opinionElement = document.createElement("div");
        opinionElement.innerHTML = `
            <p><strong>${data.nombre}</strong> (${data.calificacion}⭐): ${data.opinion}</p>
            <button onclick="eliminarOpinion('${doc.id}')">Eliminar</button>
        `;
        opinionesContainer.appendChild(opinionElement);
    });
}

// Función para eliminar una opinión
async function eliminarOpinion(id) {
    try {
        await deleteDoc(doc(db, "opiniones", id));
        alert("Opinión eliminada.");
        mostrarOpiniones();
    } catch (error) {
        console.error("Error al eliminar opinión: ", error);
    }
}

// Cargar opiniones al cargar la página
document.addEventListener("DOMContentLoaded", mostrarOpiniones);
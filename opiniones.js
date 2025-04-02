import { firebaseConfig } from "./firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// 🔥 Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 📌 Función para cargar y mostrar opiniones
async function cargarOpiniones() {
    const opinionesContainer = document.getElementById("opiniones-lista");
    opinionesContainer.innerHTML = ""; // Limpiar antes de cargar

    try {
        const querySnapshot = await getDocs(collection(db, "opiniones"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const opinionHTML = `
                <div class="opinion">
                    <h3>${data.nombre}</h3>
                    <p>${data.opinion}</p>
                    <span>⭐ ${data.calificacion} / 5</span>
                </div>
            `;
            opinionesContainer.innerHTML += opinionHTML;
        });
    } catch (error) {
        console.error("Error al cargar opiniones:", error);
    }
}

// 📌 Función para enviar una nueva opinión
document.getElementById("form-opinion").addEventListener("submit", async function (e) {
    e.preventDefault(); // ⛔ Evita recargar la página

    let nombre = document.getElementById("nombre").value.trim();
    let opinion = document.getElementById("opinion").value.trim();
    let calificacion = document.getElementById("calificacion").value;

    if (nombre === "" || opinion === "" || calificacion === "") {
        alert("Por favor, rellena todos los campos");
        return;
    }

    try {
        await addDoc(collection(db, "opiniones"), {
            nombre: nombre,
            opinion: opinion,
            calificacion: calificacion
        });

        alert("¡Opinión enviada!");
        document.getElementById("form-opinion").reset();
        cargarOpiniones(); // Recargar las opiniones después de enviar una nueva

    } catch (error) {
        console.error("Error al enviar la opinión:", error);
        alert("Error al enviar la opinión");
    }
});

// 📌 Cargar opiniones al iniciar la página
document.addEventListener("DOMContentLoaded", cargarOpiniones);

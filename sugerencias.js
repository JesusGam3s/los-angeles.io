// Lista de sugerencias predefinidas
const sugerencias = [
    "HTML",
    "CSS",
    "JavaScript",
    "GitHub Copilot",
    "Web Development",
    "Responsive Design"
];

// Función para mostrar las sugerencias dinámicamente
function mostrarSugerencias() {
    const input = document.getElementById("search-input").value.toLowerCase();
    const listaSugerencias = document.getElementById("suggestions-list");
    
    // Limpiar la lista de sugerencias
    listaSugerencias.innerHTML = "";

    // Filtrar y agregar las sugerencias que coincidan con el texto ingresado
    const resultados = sugerencias.filter(sugerencia => 
        sugerencia.toLowerCase().includes(input)
    );

    resultados.forEach(resultado => {
        const item = document.createElement("li");
        item.textContent = resultado;
        listaSugerencias.appendChild(item);
    });
}
document.getElementById('categoria').addEventListener('change', function () {
    var categoryId = this.value;
    // Hacer scroll suavemente hacia la sección seleccionada
    document.querySelector(categoryId).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});
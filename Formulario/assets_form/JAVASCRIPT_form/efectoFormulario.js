// Añadido para el efecto
const form = document.querySelector('form');

form.addEventListener('mousemove', function(e) {
    const rect = form.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Mover el formulario en base a la posición del ratón
    const moveX = (x - rect.width / 2) / 20;
    const moveY = (y - rect.height / 2) / 20;

    form.style.transform = `rotateX(${moveY}deg) rotateY(${moveX}deg)`;
});

form.addEventListener('mouseleave', function() {
    // Restablecer la posición cuando el ratón sale del formulario
    form.style.transform = 'rotateX(0) rotateY(0)';
});

// añadir un efecto tilt a los inputs para que se muevan con el ratón
const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="submit"]');

inputs.forEach(input => {
    input.addEventListener('mousemove', function(e) {
        const rect = input.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const moveX = (x - rect.width / 2) / 15;
        const moveY = (y - rect.height / 2) / 15;

        input.style.transform = `translate(${moveX}px, ${moveY}px)`;
        input.style.boxShadow = `${moveX * 2}px ${moveY * 2}px 10px rgba(0, 0, 0, 0.1)`;
    });

    input.addEventListener('mouseleave', function() {
        // Restablecer el estado inicial cuando el ratón sale del input
        input.style.transform = 'translate(0, 0)';
        input.style.boxShadow = 'none';
    });
});
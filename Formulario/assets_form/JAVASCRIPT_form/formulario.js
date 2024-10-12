document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Evita el envío normal del formulario
    
    const wallet = document.getElementById('wallet').value;
    if (!validateWalletOfSatoshi(wallet)) {
        document.getElementById('error').textContent = "La Wallet of Satoshi no es válida.";
        return;
    }
    
    const formData = new FormData(this);
    const errorElement = document.getElementById('error');
    
    fetch('Formulario/src_form/registro.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            errorElement.textContent = "Registro exitoso. Redirigiendo a la página de pago...";
            window.location.href = data.pay_url;  // Redirige al enlace de pago
        } else {
            errorElement.textContent = data.message || "Error desconocido.";
        }
    })
    .catch(error => {
        errorElement.textContent = "Error al registrar: " + error.message;  // Manejo de errores
    });
});

function validateWalletOfSatoshi(wallet) {
    // Expresión regular para validar una wallet de Satoshi en formato tipo email
    const walletOfSatoshiRegex = /^[a-zA-Z0-9._%+-]+@walletofsatoshi\.com$/;
    
    // Retorna true si cumple con el formato esperado
    return walletOfSatoshiRegex.test(wallet);
}

function checkPaymentStatus() {
    fetch('Formulario/src_form/confirmacionPago.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'paid') {
                // Mostrar botón de redirección
                const redirectButton = document.getElementById('redirectButton');
                redirectButton.style.display = 'block';
                redirectButton.style.backgroundColor = 'lightgray';  
                redirectButton.style.color = 'black';  // Color del texto
            }
        })
        .catch(error => console.error('Error al verificar el pago:', error));
}

// Comprobar el estado de pago cada 5 segundos
setInterval(checkPaymentStatus, 5000);


// Evento 'onclick' en el botón de redirección para ir al juego
document.getElementById('redirectButton').onclick = function() {
    console.log("Redirigiendo al juego...");
    window.location.href = "WebLN/startGame.html";  // Redirigir al hacer clic
};
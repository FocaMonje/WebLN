document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Evita el envío normal del formulario
    
    const wallet = document.getElementById('wallet').value;
    if (!validateWalletOfSatoshi(wallet)) {
        document.getElementById('error').textContent = "La Wallet of Satoshi no es válida.";
        return;
    }
    
    const formData = new FormData(this);
    const errorElement = document.getElementById('error');
    
    fetch('../../src/registro.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Ver el contenido de la respuesta
    
        if (data.status === "success") {
            errorElement.textContent = "Registro exitoso.";
            console.log("Entrando en el bloque de éxito");
    
            // Mostrar el botón de redirección
            const redirectButton = document.getElementById('redirectButton');
            redirectButton.style.display = 'block';  // Cambia el estilo para que se vea
            redirectButton.style.backgroundColor = 'lightgray';  
            redirectButton.style.color = 'black';  // Color del texto
    
            console.log("Botón de redirección mostrado.");  

        } else {
            errorElement.textContent = data.message || "Error desconocido.";
        }
    })
    .catch(error => {
        errorElement.textContent = "Error al registrar: " + error.message;  // Manejo de errores
    });
});

// Evento 'onclick' en el botón de redirección para ir al juego
document.getElementById('redirectButton').onclick = function() {
    console.log("Redirigiendo al juego...");
    window.location.href = "../../../WebLN/startGame.html";  // Redirigir al hacer clic
};

function validateWalletOfSatoshi(wallet) {
    // Expresión regular para validar una wallet de Satoshi en formato tipo email
    const walletOfSatoshiRegex = /^[a-zA-Z0-9._%+-]+@walletofsatoshi\.com$/;
    
    // Retorna true si cumple con el formato esperado
    return walletOfSatoshiRegex.test(wallet);
}
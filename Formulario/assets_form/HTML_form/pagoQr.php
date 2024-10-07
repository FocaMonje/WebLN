<?php 
session_start(); 
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paga tu inscripción</title>
</head>
<body>
    <h1>Paga tu inscripción</h1>
    <div id="qrCode"></div>
    <p>Escanea el código QR para realizar el pago.</p>

    <!-- Cargar la librería para generar el QR -->
    <script src="https://cdn.jsdelivr.net/npm/qrcode"></script>
    <script>
        // Obtener la URL de pago desde la sesión PHP
        const payUrl = "<?php echo isset($_SESSION['pay_url']) ? $_SESSION['pay_url'] : ''; ?>";
        
        if (payUrl) {
            const qrCodeDiv = document.getElementById('qrCode');
            QRCode.toCanvas(qrCodeDiv, payUrl, { width: 256 }, function (error) {
                if (error) console.error(error);
            });
        } else {
            console.error("No se encontró la URL del enlace de pago.");
            alert("Error: No se pudo encontrar la URL del pago. Por favor, intenta registrarte de nuevo.");
        }
    </script>
</body>
</html>

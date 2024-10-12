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
    <div id="qrCode">
        <?php if (isset($_SESSION['pay_url'])): ?>
            <p>Escanea el código QR para realizar el pago:</p>
            <iframe src="<?php echo $_SESSION['pay_url']; ?>" width="300" height="400" frameborder="0"></iframe>
        <?php else: ?>
            <p>Error: No se pudo obtener el enlace de pago.</p>
        <?php endif; ?>
    </div>
    <p>Si el código QR no se muestra, intenta recargar la página.</p>
</body>
</html>

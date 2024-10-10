<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json'); // Asegurar que la respuesta es JSON
require_once 'db_form.php';
require_once 'requetes_form.php';

// Incluye la URL y API de LNBits
define('LNBITS_API_URL', 'Aquí se pone el url');
define('LNBITS_API_KEY', 'Aquí se pone la API'); // aquí va la admin Key de LNBits

function crearPayLink($amount, $memo, $description, $usuario_id, $torneo_id) {
    $url = LNBITS_API_URL;
    $headers = [
        'X-Api-Key: ' . LNBITS_API_KEY,
        'Content-Type: application/json'
    ];

    $webhookUrl = 'Aquí pongo la dirección del archivo que se encarga de confirmar el pago';

    $data = [
        'out' => false,
        'amount' => $amount,
        'min' => $amount,
        'max' => $amount, 
        'description' => $description,
        'webhook' => $webhookUrl,
        'extra' => json_encode([  // Para convertir los datos en formato JSON
            'usuario_id' => $usuario_id,
            'torneo_id' => $torneo_id
        ])
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

    $response = curl_exec($ch);
    $info = curl_getinfo($ch);  // Obtener información de la respuesta
    
    if (curl_errno($ch)) {
        // Retornar un error en formato JSON
        echo json_encode(['status' => 'error', 'message' => 'Error de cURL: ' . curl_error($ch), 'http_code' => $info['http_code']]);
        return false;
    }

    curl_close($ch);

    // Variable para almacenar los logs y devolverlos al cliente
    $logs = [];

    // Imprimir la respuesta completa de la API
    error_log("LNBits API Response: " . $response);
    $logs[] = "LNBits API Response: " . $response;
    $logs[] = "HTTP Status Code: " . $info['http_code'];

    $responseData = json_decode($response, true);

    // Verificar si hay un error en la respuesta de LNBits
    if (isset($responseData['message'])) {
        // Agregar el error al log
        $logs[] = "Error de LNBits: " . $responseData['message'];
        
        // Enviar la respuesta completa de LNBits al cliente para depuración
        echo json_encode([
            'status' => 'error', 
            'message' => 'Error de LNBits: ' . $responseData['message'],
            'api_response' => $response,  // Devolver la respuesta de la API
            'logs' => $logs               // Devolver los logs
        ]);
        return false;
    }

    return isset($responseData['payment_url']) ? $responseData['payment_url'] : false;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['apodo'];
    $wallet = $_POST['wallet'];
    $email = $_POST['email'];

   // Validar el formato de la Wallet of Satoshi
   if (!preg_match('/^[a-zA-Z0-9._%+-]+@walletofsatoshi\.com$/', $wallet)) {
        echo json_encode(['status' => 'error', 'message' => "La wallet proporcionada no es válida. Debe ser una Wallet of Satoshi."]);
        exit();
    }

    // Conexión a la base de datos
    $conn = obtenerConexionDB();
    if (!$conn) {
        echo json_encode(['status' => 'error', 'message' => "Error en la conexión a la base de datos."]);
        exit();
    }

    // Comprobar si el apodo ya existe
    $stmt = $conn->prepare(Requetes::SELECT_COUNT_APODO);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->bind_result($apodoCount);
    $stmt->fetch();
    $stmt->close();
  
    if ($apodoCount > 0) {
        echo json_encode(['status' => 'error', 'message' => "El apodo '$username' ya está en uso. Por favor, elige otro."]);
        exit();
    }
  
    // Comprobar si la wallet ya existe
    $stmt = $conn->prepare(Requetes::SELECT_COUNT_WALLET);
    $stmt->bind_param("s", $wallet);
    $stmt->execute();
    $stmt->bind_result($walletCount);
    $stmt->fetch();
    $stmt->close();
  
    if ($walletCount > 0) {
        echo json_encode(['status' => 'error', 'message' => "La wallet proporcionada ya está registrada. Por favor, elige otra."]);
        exit();
    }

    // Comprobar si el email ya existe
    $stmt = $conn->prepare(Requetes::SELECT_COUNT_EMAIL);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->bind_result($emailCount);
    $stmt->fetch();
    $stmt->close();
 
    if ($emailCount > 0) {
        echo json_encode(['status' => 'error', 'message' => "El correo electrónico '$email' ya está en uso. Por favor, elige otro."]);
        exit();
    }

    // Insertar jugador en la base de datos
    $stmt = $conn->prepare(Requetes::INSERT_USUARIO);
    $stmt->bind_param("sss", $username, $wallet, $email);
    if ($stmt->execute()) {
        $usuario_id = $stmt->insert_id;

        // Crear el torneo si no existe ya para la fecha actual
        $fecha = date('Y-m-d');
        $stmt = $conn->prepare(Requetes::SELECT_TORNEO);
        $stmt->bind_param("s", $fecha);
        $stmt->execute();
        $stmt->bind_result($torneo_id);
        $stmt->fetch();
        $stmt->close();

        // Si no existe, crearlo
        if (!$torneo_id) {
            $stmt = $conn->prepare(Requetes::INSERT_TORNEO);
            $stmt->bind_param("s", $fecha);
            $stmt->execute();
            $torneo_id = $stmt->insert_id;
            $stmt->close();
        }

        // Registrar la inscripción
        $stmt = $conn->prepare(Requetes::INSERT_INSCRIPTION);
        $stmt->bind_param("iis", $usuario_id, $torneo_id, $fecha);
        if ($stmt->execute()) {
            $inscripcion_id = $stmt->insert_id;

            // Insertar la puntuación inicial en la tabla score
            $stmt = $conn->prepare(Requetes::INSERT_SCORE);
            $stmt->bind_param("ii", $usuario_id, $torneo_id);
            if (!$stmt->execute()) {
                echo json_encode(['status' => 'error', 'message' => "Error al insertar puntuación inicial: " . $stmt->error]);
                exit();
            }

            // Crear registro de pago en la tabla pago_inscripcion
            $stmt = $conn->prepare(Requetes::INSERT_PAGO_INSCRIPTION);
            $stmt->bind_param("ii", $usuario_id, $torneo_id);
            $stmt->execute();
            $pago_inscripcion_id = $stmt->insert_id;
            $stmt->close();

            // Almacena los IDs en la sesión
            $_SESSION['usuario_id'] = $usuario_id;
            $_SESSION['torneo_id'] = $torneo_id;
            $_SESSION['inscripcion_id'] = $inscripcion_id;

            // Crear un Pay Link en LNBits para que el jugador pueda pagar
            $amount = 10; // Cuantía de la inscripción en satoshis
            $memo = "Pago inscripción torneo $fecha";
            $description = "Pago para acceder al torneo";

            // Crear el enlace de pago
            $payUrl = crearPayLink($amount, $memo, $description, $usuario_id, $torneo_id);
            if ($payUrl) {
                $_SESSION['pay_url'] = $payUrl;

                // Redirigir a la página donde se muestra el código QR
                header('Location: Formulario\assets_form\HTML_form\pagoQr.php');
                exit();
            } else {
                echo json_encode(['status' => 'error', 'message' => "Error al crear el pago."]);
                exit();
            }

        } else {
            echo json_encode(['status' => 'error', 'message' => "Error en la inserción de inscripción: " . $stmt->error]);
            exit();
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => "Error en la inserción de usuario: " . $stmt->error]);
        exit();
    }

    $stmt->close();
    $conn->close();
}
?>
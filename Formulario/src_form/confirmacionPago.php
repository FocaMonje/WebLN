<?php
session_start();
$input = file_get_contents("php://input");  // Leer el cuerpo de la solicitud
$data = json_decode($input, true);  // Decodificar los datos JSON
header('Content-Type: application/json'); // Respuesta en formato JSON
require_once 'db_form.php';
require_once 'requetes_form.php';

// Intentar leer el cuerpo de la solicitud
if ($input === false) {
    file_put_contents('confirmacion_log.txt', "Error al leer el cuerpo de la solicitud.\n", FILE_APPEND);
    exit();
}

// Registrar la entrada para depuración
file_put_contents('confirmacion_log.txt', "Datos recibidos: " . print_r($data, true), FILE_APPEND);

if ($data && isset($data['paid']) && $data['paid'] === true) {
    // Verificar si se enviaron los datos esperados
    if (isset($data['extra']['usuario_id']) && isset($data['extra']['torneo_id'])) {
        $extra = json_decode($data['extra'], true);
        $usuario_id = $data['extra']['usuario_id'];
        $torneo_id = $data['extra']['torneo_id'];

        // Registrar los valores de usuario_id y torneo_id
        file_put_contents('confirmacion_log.txt', "usuario_id: $usuario_id, torneo_id: $torneo_id\n", FILE_APPEND);

        // Conectar a la base de datos
        $conn = obtenerConexionDB();
        if (!$conn) {
            echo json_encode(['status' => 'error', 'message' => "Error en la conexión a la base de datos."]);
            exit();
        }

        // Actualizar el estado del pago en la base de datos
        $stmt = $conn->prepare(Requetes::UPDATE_PAGO_INSCRIPTION);
        $stmt->bind_param("ii", $usuario_id, $torneo_id);
        if ($stmt->execute()) {
            // Actualización exitosa, se habilita el botón de acceso
            echo json_encode(['status' => 'success', 'message' => "Pago confirmado, acceso habilitado."]);
        } else {
            // Registrar el error de ejecución de la consulta
            file_put_contents('confirmacion_log.txt', "Error al ejecutar la consulta: " . $stmt->error . "\n", FILE_APPEND);
            echo json_encode(['status' => 'error', 'message' => "Error al actualizar el estado de pago."]);
        }

        $conn->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => "Datos insuficientes para completar la operación."]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => "Pago no recibido o datos incorrectos."]);
}
?>

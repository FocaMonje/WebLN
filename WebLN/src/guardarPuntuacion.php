<?php
session_start();

require_once 'db.php';
require_once 'requetes.php';

// Recupera los valores de la sesión
$usuario_id = isset($_SESSION['usuario_id']) ? $_SESSION['usuario_id'] : null;
$torneo_id = isset($_SESSION['torneo_id']) ? $_SESSION['torneo_id'] : null;

header('Content-Type: application/json'); 

// Verifica que el usuario existe y que el torneo exista en la sesión
if (!$usuario_id || !$torneo_id) {
    echo json_encode(["success" => false, "error" => "El usuario no existe o torneo no establecido"]);
    exit;
}

// Recupera los datos de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

// Verifica que la puntuación haya sido enviada
if (isset($data['score'])) {
    $score = $data['score'];
} else {
    echo json_encode(["success" => false, "error" => "Puntuación no enviada"]);
    exit;
}

// Depuración: Verificar los datos recibidos
error_log("Datos recibidos: usuario_id = $usuario_id, torneo_id = $torneo_id, score = $score");
error_log("POST data: " . print_r($data, true));

// Verifica la conexión a la base de datos
$conn = obtenerConexionDB();
if (!$conn) {
    echo json_encode(["success" => false, "error" => "Error en la conexión a la base de datos"]);
    exit;
}

// Verifica si el usuario está inscrito en el torneo
$stmt = $conn->prepare(Requetes::SELECT_INSCRIPTION );
$stmt->bind_param("ii", $usuario_id, $torneo_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Recupera el ID de inscripción
    $inscripcion = $result->fetch_assoc();
    $inscripcion_id = $inscripcion['id'];

    // Actualiza la puntuación en la tabla score
    $stmt = $conn->prepare(Requetes::UPDATE_SCORE);
    $stmt->bind_param("iii", $score, $usuario_id, $torneo_id);
    
    // Ejecutar la actualización
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Puntuación actualizada correctamente."]);
    } else {
        echo json_encode(["success" => false, "error" => "Error al actualizar la puntuación: " . $stmt->error]);
    }
} else {
    echo json_encode(["success" => false, "error" => "No se encontró la inscripción del usuario en el torneo."]);
}

$stmt->close();
$conn->close();
?>
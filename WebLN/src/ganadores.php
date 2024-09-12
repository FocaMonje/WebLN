<?php

session_start();
require_once 'db.php';
require_once 'requetes.php';

// Obtener el torneo_id de la sesión
$torneo_id = isset($_SESSION['torneo_id']) ? $_SESSION['torneo_id'] : null;

if (!$torneo_id) {
    echo "Error: No se ha especificado un torneo.";
    exit();
}

// Conexión a la base de datos
$conn = obtenerConexionDB();
if (!$conn) {
    echo "Error en la conexión a la base de datos: " . mysqli_connect_error();
    exit();
}

// Comprobar si ya se han registrado ganadores para el torneo específico
$checkSql = Requetes::SELECT_COUNT_GANADORES;
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("i", $torneo_id);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();
$checkRow = $checkResult->fetch_assoc();

if ($checkRow['count'] > 0) {
    echo "Los ganadores ya han sido registrados para este torneo.";
    exit();
}

// Seleccionar los jugadores con las puntuaciones más altas para el torneo
$sql = Requetes::SELECT_GANADORES; // Para seleccionar a los 3 mejores jugadores

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $torneo_id);
$stmt->execute();
$result = $stmt->get_result();

$posicion = 1; // Comenzamos con la posición 1

while ($row = $result->fetch_assoc()) {
    // Insertar en la tabla ganadores
    $insertSql = Requetes::INSERT_GANADORES;
    $insertStmt = $conn->prepare($insertSql);
    $insertStmt->bind_param("ii", $row['score_id'], $posicion); // Usamos $row para acceder a score_id

    if ($insertStmt->execute()) {
        echo "Registro insertado en ganadores para el usuario ID: " . $row['usuario_id'] . " en la posición $posicion<br>";
    } else {
        echo "Error al insertar en ganadores: " . $insertStmt->error . "<br>";
    }
    
    $posicion++; // Incrementamos la posición para el siguiente jugador
}

$stmt->close();
$conn->close();
?>
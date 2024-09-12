<?php
// archivo para la conexión a la base de datos

function obtenerConexionDB() {
    // Ruta al archivo param.ini
    $config_file = '../param.ini';
    
    // Verificar si el archivo existe
    if (!file_exists($config_file)) {
        throw new Exception('El archivo de configuración no existe.');
    }
       
    // Leer y analizar los parámetros de la base de datos
    $config = parse_ini_file($config_file, true);
       
    if (!$config) {
        throw new Exception('Error al leer el archivo de configuración.');
    }
       
    // Extraer los parámetros necesarios
    $host = $config['BDD']['host'];
    $dbname = $config['BDD']['dbname'];
    $user = $config['BDD']['user'];
    $password = $config['BDD']['password'];
    $port = $config['BDD']['port'];
   
    // Crear la conexión usando mysqli
    $conn = new mysqli($host, $user, $password, $dbname, $port);
   
    // Comprobar si hay algún error en la conexión
    if ($conn->connect_error) {
        throw new Exception('Error en la conexión a la base de datos: ' . $conn->connect_error);
    }
   
    return $conn;
}

?>

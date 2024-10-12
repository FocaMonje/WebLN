CREATE DATABASE IF NOT EXISTS webln;
USE webln;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    apodo VARCHAR(50) NOT NULL UNIQUE,
    wallet VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de torneos
CREATE TABLE IF NOT EXISTS torneos (
    torneo_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL UNIQUE
);

-- Tabla de inscripciones (relaciona usuarios y torneos)
CREATE TABLE IF NOT EXISTS inscripciones (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    torneo_id INT UNSIGNED NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (torneo_id) REFERENCES torneos(torneo_id) ON DELETE CASCADE
);

-- Tabla de pagos de inscripción
CREATE TABLE IF NOT EXISTS pago_inscripcion (
    pago_inscripcion_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    torneo_id INT UNSIGNED NOT NULL,
    estado ENUM('pendiente', 'pagado') DEFAULT 'pendiente',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (torneo_id) REFERENCES torneos(torneo_id) ON DELETE CASCADE
);

-- Tabla de Score (puntajes obtenidos por los usuarios en los torneos)
CREATE TABLE IF NOT EXISTS score (
    score_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    puntuacion INT NOT NULL,
    usuario_id INT UNSIGNED NOT NULL,
    torneo_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (torneo_id) REFERENCES torneos(torneo_id) ON DELETE CASCADE
);

-- Tabla de ganadores (relaciona Score con la posición en los torneos)
CREATE TABLE IF NOT EXISTS ganadores (
    ganador_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    score_id INT UNSIGNED NOT NULL,
    posicion TINYINT NOT NULL,
    FOREIGN KEY (score_id) REFERENCES score(score_id) ON DELETE CASCADE
);

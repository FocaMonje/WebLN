<?php

class Requetes {
    public const INSERT_PAGO_INSCRIPTION                            = "INSERT INTO pago_inscripcion (usuario_id, torneo_id) VALUES (?, ?)";
    public const UPDATE_PAGO_INSCRIPTION                            = "UPDATE pago_inscripcion SET estado = 'pagado' WHERE usuario_id = ? AND torneo_id = ?";

    public const INSERT_SCORE                                       = "INSERT INTO score (puntuacion, usuario_id, torneo_id) VALUES (0, ?, ?)";
    public const INSERT_INSCRIPTION                                 = "INSERT INTO inscripciones (usuario_id, torneo_id, fecha) VALUES (?, ?, ?)";
    public const INSERT_TORNEO                                      = "INSERT INTO torneos (fecha) VALUES (?)";
    public const INSERT_USUARIO                                     = "INSERT INTO usuarios (apodo, wallet, email) VALUES (?, ?, ?)";
    public const SELECT_TORNEO                                      = "SELECT torneo_id FROM torneos WHERE fecha = ?";

    public const SELECT_COUNT_APODO                                 = "SELECT COUNT(*) FROM usuarios WHERE apodo = ?";
    public const SELECT_COUNT_WALLET                                = "SELECT COUNT(*) FROM usuarios WHERE wallet = ?";

    public const SELECT_COUNT_EMAIL                                 = "SELECT COUNT(*) FROM usuarios WHERE email = ?";

}
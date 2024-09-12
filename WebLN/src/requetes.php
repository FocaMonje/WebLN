<?php
class Requetes {
    public const UPDATE_SCORE                                       = "UPDATE score SET puntuacion = ? WHERE usuario_id = ? AND torneo_id = ?";
    public const SELECT_INSCRIPTION                                 = "SELECT i.id FROM inscripciones i WHERE i.usuario_id = ? AND i.torneo_id = ?";

    public const SELECT_COUNT_GANADORES                             = "SELECT COUNT(*) AS count FROM ganadores g
                                                                            JOIN score s ON g.score_id = s.score_id
                                                                            WHERE s.torneo_id = ?";
    public const SELECT_GANADORES                                   = "SELECT 
                                                                            s.score_id,
                                                                            u.id AS usuario_id,
                                                                            u.apodo,
                                                                            s.puntuacion
                                                                        FROM score s
                                                                        JOIN usuarios u ON s.usuario_id = u.id
                                                                        WHERE s.torneo_id = ?
                                                                        ORDER BY s.puntuacion DESC
                                                                        LIMIT 3";
    public const INSERT_GANADORES                                   = "INSERT INTO ganadores (score_id, posicion) VALUES (?, ?)";
   
}
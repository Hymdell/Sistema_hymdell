<?php

require __DIR__ . '/../config.php';

$stmt = $pdo->query('SELECT * FROM Servicos ORDER BY nome');
$servicos = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($servicos);
?>

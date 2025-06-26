<?php

require __DIR__ . '/../config.php';

$stmt = $pdo->query('SELECT * FROM Meta ORDER BY ano DESC, mes DESC');
$metas = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($metas);
?>

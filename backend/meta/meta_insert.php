<?php

require __DIR__ . '/../config.php';

$ano = $_POST['ano'] ?? '';
$mes = $_POST['mes'] ?? '';
$valor = $_POST['valor'] ?? '';

if ($ano && $mes && $valor) {
    $stmt = $pdo->prepare('INSERT INTO Meta (ano, mes, valor) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE valor=?');
    $ok = $stmt->execute([$ano, $mes, $valor, $valor]);
    echo json_encode(['success' => $ok]);
} else {
    echo json_encode(['success' => false, 'error' => 'Dados incompletos']);
}
?>

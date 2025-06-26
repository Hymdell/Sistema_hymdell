<?php

require __DIR__ . '/../config.php';

$id = $_POST['id'] ?? '';
$valor = $_POST['valor'] ?? '';

if ($id && $valor) {
    $stmt = $pdo->prepare('UPDATE Meta SET valor=? WHERE id=?');
    $ok = $stmt->execute([$valor, $id]);
    echo json_encode(['success' => $ok]);
} else {
    echo json_encode(['success' => false, 'error' => 'Dados incompletos']);
}
?>

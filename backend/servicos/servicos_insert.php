<?php

require __DIR__ . '/../config.php';

$nome = $_POST['nome'] ?? '';
$valor = $_POST['valor'] ?? '';
$comissao = $_POST['comissao'] ?? '';

if ($nome && $valor && $comissao) {
    $stmt = $pdo->prepare('INSERT INTO Servicos (nome, valor, comissao) VALUES (?, ?, ?)');
    $ok = $stmt->execute([$nome, $valor, $comissao]);
    echo json_encode(['success' => $ok]);
} else {
    echo json_encode(['success' => false, 'error' => 'Dados incompletos']);
}
?>

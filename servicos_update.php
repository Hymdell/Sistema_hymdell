<?php
// servicos_update.php - Atualiza um serviço existente
require 'config.php';

$id = $_POST['id'] ?? '';
$nome = $_POST['nome'] ?? '';
$valor = $_POST['valor'] ?? '';
$comissao = $_POST['comissao'] ?? '';

if ($id && $nome && $valor && $comissao) {
    $stmt = $pdo->prepare('UPDATE Servicos SET nome=?, valor=?, comissao=? WHERE id=?');
    $ok = $stmt->execute([$nome, $valor, $comissao, $id]);
    echo json_encode(['success' => $ok]);
} else {
    echo json_encode(['success' => false, 'error' => 'Dados incompletos']);
}
?>

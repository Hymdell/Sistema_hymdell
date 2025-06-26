<?php
// servicos_update.php - Atualiza um serviço existente
require 'config.php';

// Permitir tanto POST tradicional quanto JSON
if ($_SERVER['CONTENT_TYPE'] === 'application/json') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? '';
    $nome = $data['nome'] ?? '';
    $valor = $data['valor'] ?? '';
    $comissao = $data['comissao'] ?? '';
} else {
    $id = $_POST['id'] ?? '';
    $nome = $_POST['nome'] ?? '';
    $valor = $_POST['valor'] ?? '';
    $comissao = $_POST['comissao'] ?? '';
}

if ($id && $nome && $valor && $comissao) {
    $stmt = $pdo->prepare('UPDATE Servicos SET nome=?, valor=?, comissao=? WHERE id=?');
    $ok = $stmt->execute([$nome, $valor, $comissao, $id]);
    echo json_encode(['success' => $ok]);
} else {
    echo json_encode(['success' => false, 'error' => 'Dados incompletos']);
}
?>

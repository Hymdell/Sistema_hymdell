<?php
// chamados_delete.php - Remove um chamado (OS)
require 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;

if ($id) {
    $stmt = $pdo->prepare('DELETE FROM Chamados WHERE id=?');
    $ok = $stmt->execute([$id]);
    echo json_encode(['success' => $ok]);
} else {
    echo json_encode(['success' => false, 'error' => 'ID não informado']);
}
?>

<?php
require __DIR__ . '/../config.php';

$id = $_POST['id'] ?? '';

if ($id) {
    $stmt = $pdo->prepare('DELETE FROM Servicos WHERE id=?');
    $ok = $stmt->execute([$id]);
    echo json_encode(['success' => $ok]);
} else {
    echo json_encode(['success' => false, 'error' => 'ID não informado']);
}
?>

<?php
// chamados_select.php - Lista todos os chamados (OS)
require 'config.php';

$stmt = $pdo->query('SELECT * FROM Chamados ORDER BY data_atualizacao DESC');
$chamados = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($chamados);
?>

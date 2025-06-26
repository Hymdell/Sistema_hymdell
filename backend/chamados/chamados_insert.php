<?php

require __DIR__ . '/../config.php';

$data = json_decode(file_get_contents('php://input'), true);

$campos = [
    'numero_os', 'cliente', 'atendente', 'telefone', 'item', 'data_entrada', 'data_saida',
    'defeito_solucao', 'servico_id', 'tipo_recebimento', 'valor_total', 'status'
];

$valores = [];
foreach ($campos as $campo) {
    $valores[$campo] = $data[$campo] ?? null;
}

if ($valores['cliente'] && $valores['atendente'] && $valores['item'] && $valores['data_entrada'] && $valores['defeito_solucao'] && $valores['servico_id'] && $valores['tipo_recebimento'] && $valores['valor_total'] && $valores['status']) {
    $stmt = $pdo->prepare('INSERT INTO Chamados (numero_os, cliente, atendente, telefone, item, data_entrada, data_saida, defeito_solucao, servico_id, tipo_recebimento, valor_total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $ok = $stmt->execute([
        $valores['numero_os'], $valores['cliente'], $valores['atendente'], $valores['telefone'],
        $valores['item'], $valores['data_entrada'], $valores['data_saida'], $valores['defeito_solucao'],
        $valores['servico_id'], $valores['tipo_recebimento'], $valores['valor_total'], $valores['status']
    ]);
    echo json_encode(['success' => $ok]);
} else {
    echo json_encode(['success' => false, 'error' => 'Dados obrigatórios ausentes']);
}
?>

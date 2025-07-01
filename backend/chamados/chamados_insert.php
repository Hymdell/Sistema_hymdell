<?php

require __DIR__ . '/../config.php';

// Log dos dados recebidos para debug
error_log('Dados recebidos no chamados_insert.php: ' . file_get_contents('php://input'));

$data = json_decode(file_get_contents('php://input'), true);

if ($data === null) {
    error_log('Erro: Dados JSON inválidos ou vazios');
    echo json_encode(['success' => false, 'error' => 'Dados JSON inválidos']);
    exit;
}

$campos = [
    'numero_os', 'cliente', 'atendente', 'telefone', 'item', 'data_entrada', 'data_saida',
    'defeito_solucao', 'servico_id', 'tipo_recebimento', 'valor_total', 'status'
];

$valores = [];
foreach ($campos as $campo) {
    // Tratar campos especiais que podem ser nulos
    if ($campo === 'servico_id' && empty($data[$campo])) {
        $valores[$campo] = null;
    } elseif ($campo === 'valor_total' && empty($data[$campo])) {
        $valores[$campo] = null;
    } else {
        $valores[$campo] = $data[$campo] ?? null;
    }
}

// Log dos valores processados
error_log('Valores processados: ' . json_encode($valores));

// Verificar campos obrigatórios
$camposObrigatorios = ['cliente', 'atendente', 'item', 'data_entrada', 'defeito_solucao', 'tipo_recebimento', 'status'];
$camposFaltando = [];

foreach ($camposObrigatorios as $campo) {
    if (empty($valores[$campo])) {
        $camposFaltando[] = $campo;
    }
}

if (count($camposFaltando) > 0) {
    error_log('Campos obrigatórios faltando: ' . implode(', ', $camposFaltando));
    echo json_encode(['success' => false, 'error' => 'Dados obrigatórios ausentes: ' . implode(', ', $camposFaltando)]);
} else {
    $stmt = $pdo->prepare('INSERT INTO Chamados (numero_os, cliente, atendente, telefone, item, data_entrada, data_saida, defeito_solucao, servico_id, tipo_recebimento, valor_total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $ok = $stmt->execute([
        $valores['numero_os'], $valores['cliente'], $valores['atendente'], $valores['telefone'],
        $valores['item'], $valores['data_entrada'], $valores['data_saida'], $valores['defeito_solucao'],
        $valores['servico_id'], $valores['tipo_recebimento'], $valores['valor_total'], $valores['status']
    ]);
    
    if ($ok) {
        error_log('OS inserida com sucesso');
        echo json_encode(['success' => true]);
    } else {
        error_log('Erro ao inserir OS: ' . implode(', ', $stmt->errorInfo()));
        echo json_encode(['success' => false, 'error' => 'Erro ao inserir no banco de dados']);
    }
}
?>

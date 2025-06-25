// Manipulação das modais
// Agora todo o código só executa após o DOM estar pronto

document.addEventListener('DOMContentLoaded', function () {
  const modals = {
    modalAddOS: document.getElementById('modalAddOS'),
    modalEditOS: document.getElementById('modalEditOS'),
    modalAddService: document.getElementById('modalAddService'),
    modalCharts: document.getElementById('modalCharts'),
    modalManageServices: document.getElementById('modalManageServices'),
    modalEditService: document.getElementById('modalEditService'),
    modalDeleteService: document.getElementById('modalDeleteService'),
    modalEditGoal: document.getElementById('modalEditGoal'),
  };

  // Botões para abrir modais
  document
    .getElementById('btnAddOS')
    .addEventListener('click', () => openModal('modalAddOS'));
  document
    .getElementById('btnAddService')
    .addEventListener('click', () => openModal('modalAddService'));
  document
    .getElementById('btnViewCharts')
    .addEventListener('click', () => openModal('modalCharts'));
  document.getElementById('btnManageServices').addEventListener('click', () => {
    openModal('modalManageServices');
    carregarServicos();
  });

  // Botões de edição de OS
  document.querySelectorAll('.edit-os-btn').forEach((button) => {
    button.addEventListener('click', function () {
      const osNumber = this.getAttribute('data-os');
      document.getElementById('editOsNumber').textContent = `#${osNumber}`;
      openModal('modalEditOS');
    });
  });

  // Botões mobile
  document
    .getElementById('btnMobileActions')
    .addEventListener('click', toggleMobileMenu);
  document.getElementById('btnMobileAddOS').addEventListener('click', () => {
    openModal('modalAddOS');
    closeMobileMenu();
  });
  document
    .getElementById('btnMobileAddService')
    .addEventListener('click', () => {
      openModal('modalAddService');
      closeMobileMenu();
    });
  document
    .getElementById('btnMobileViewCharts')
    .addEventListener('click', () => {
      openModal('modalCharts');
      closeMobileMenu();
    });

  // Botões para fechar modais
  document.querySelectorAll('.closeModal').forEach((button) => {
    button.addEventListener('click', closeAllModals);
  });

  // Fechar modais ao clicar fora
  Object.values(modals).forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAllModals();
    });
  });

  // Funções de manipulação de modais
  function openModal(modalId) {
    closeAllModals();
    modals[modalId].classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    if (modalId === 'modalCharts') {
      animateChartBars();
    }
  }

  function closeAllModals() {
    Object.values(modals).forEach((modal) => {
      modal.classList.add('hidden');
    });
    document.body.style.overflow = '';
  }

  function toggleMobileMenu() {
    const menu = document.getElementById('mobileActionsMenu');
    menu.classList.toggle('hidden');
  }

  function closeMobileMenu() {
    document.getElementById('mobileActionsMenu').classList.add('hidden');
  }

  // Animação das barras do gráfico quando o modal é aberto
  function animateChartBars() {
    setTimeout(() => {
      const bars = document.querySelectorAll('.chart-bar');
      bars.forEach((bar) => {
        const targetHeight = bar.style.getPropertyValue('--target-height');
        bar.style.height = '0%';
        bar.classList.add('bar-animate');
        setTimeout(() => {
          bar.style.height = targetHeight;
        }, 100);
      });
    }, 300);
  }

  // Alternar ano do gráfico
  document.getElementById('filtroAno').addEventListener('change', function () {
    const bars = document.querySelectorAll('.chart-bar');
    const randomHeights = [
      Math.floor(Math.random() * 60) + 20 + '%',
      Math.floor(Math.random() * 60) + 20 + '%',
      Math.floor(Math.random() * 60) + 20 + '%',
      Math.floor(Math.random() * 60) + 20 + '%',
      Math.floor(Math.random() * 60) + 20 + '%',
      Math.floor(Math.random() * 60) + 20 + '%',
    ];

    bars.forEach((bar, index) => {
      bar.style.setProperty('--target-height', randomHeights[index]);
      bar.style.height = '0%';
    });

    setTimeout(() => {
      bars.forEach((bar, index) => {
        bar.style.height = randomHeights[index];
      });
    }, 100);
  });

  // Atualizar valor com base no serviço selecionado
  document
    .getElementById('selectServico')
    .addEventListener('change', function () {
      const valorInput = document.getElementById('valorTotal');
      const valorSelecionado = this.value;

      if (valorSelecionado) {
        // Formatar o valor para o formato brasileiro (R$ 000,00)
        const valorFormatado = parseFloat(valorSelecionado)
          .toFixed(2)
          .replace('.', ',');
        valorInput.value = valorFormatado;
      } else {
        valorInput.value = '';
      }
    });

  // Atualizar valor com base no serviço selecionado (modal de edição)
  document
    .getElementById('selectServicoEditar')
    .addEventListener('change', function () {
      const valorInput = document.getElementById('valorTotalEditar');
      const valorSelecionado = this.value;

      if (valorSelecionado) {
        // Formatar o valor para o formato brasileiro (R$ 000,00)
        const valorFormatado = parseFloat(valorSelecionado)
          .toFixed(2)
          .replace('.', ',');
        valorInput.value = valorFormatado;
      } else {
        valorInput.value = '';
      }
    });

  // Atualizar valor total SEMPRE com valor integral do serviço (criação)
  function atualizarValorTotalOS() {
    const selectServico = document.getElementById('selectServico');
    const valorInput = document.getElementById('valorTotal');
    let valorBase = parseFloat(selectServico.value);
    if (isNaN(valorBase)) {
      valorInput.value = '';
      return;
    }
    valorInput.value = valorBase.toFixed(2).replace('.', ',');
  }
  document
    .getElementById('selectServico')
    .addEventListener('change', atualizarValorTotalOS);
  // O tipo de recebimento não altera o valor exibido

  // Atualizar valor total SEMPRE com valor integral do serviço (edição)
  function atualizarValorTotalEditOS() {
    const selectServicoEditar = document.getElementById('selectServicoEditar');
    const valorInput = document.getElementById('valorTotalEditar');
    let valorBase = parseFloat(selectServicoEditar.value);
    if (isNaN(valorBase)) {
      valorInput.value = '';
      return;
    }
    valorInput.value = valorBase.toFixed(2).replace('.', ',');
  }
  document
    .getElementById('selectServicoEditar')
    .addEventListener('change', atualizarValorTotalEditOS);
  // O tipo de recebimento não altera o valor exibido

  // Função para aplicar máscara de telefone
  function maskPhone(input) {
    input.addEventListener('input', function () {
      let v = input.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      if (v.length > 10) {
        input.value = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (v.length > 6) {
        input.value = v.replace(/(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
      } else if (v.length > 2) {
        input.value = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      } else {
        input.value = v;
      }
    });
  }

  // Validação dos campos obrigatórios e tipos
  function validateOSForm(isEdit = false) {
    const prefix = isEdit ? 'edit' : '';
    const errors = [];
    const clientName = document
      .getElementById(prefix + 'ClientName')
      .value.trim();
    const attendant = document
      .getElementById(prefix + 'Attendant')
      .value.trim();
    const item = document.getElementById(prefix + 'Item').value.trim();
    const entryDate = document.getElementById(prefix + 'EntryDate').value;
    const defectSolution = document
      .getElementById(prefix + 'DefectSolution')
      .value.trim();
    const osNumber = document.getElementById(prefix + 'OsNumber').value.trim();
    const phone = document.getElementById(prefix + 'Phone').value.trim();

    if (osNumber && !/^\d+$/.test(osNumber)) {
      errors.push('Número da OS deve conter apenas números.');
    }
    if (!clientName) {
      errors.push('Nome do Cliente é obrigatório.');
    }
    if (!attendant) {
      errors.push('Atendente é obrigatório.');
    }
    if (phone && !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(phone)) {
      errors.push('Telefone inválido. Use o formato (99) 99999-9999.');
    }
    if (!item) {
      errors.push('Item é obrigatório.');
    }
    if (!entryDate) {
      errors.push('Data de Entrada é obrigatória.');
    }
    if (!defectSolution) {
      errors.push('Defeito/Solução é obrigatório.');
    }
    return errors;
  }

  // Exibir erros na tela
  function showFormErrors(errors, isEdit = false) {
    let errorDiv = document.getElementById(
      isEdit ? 'editOsFormErrors' : 'osFormErrors'
    );
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.id = isEdit ? 'editOsFormErrors' : 'osFormErrors';
      errorDiv.className = 'mb-2 text-red-400 text-sm';
      const form = document.querySelector(
        isEdit ? '#modalEditOS .modal-content' : '#modalAddOS .modal-content'
      );
      form.insertBefore(errorDiv, form.firstChild);
    }
    errorDiv.innerHTML = errors.map((e) => `<div>• ${e}</div>`).join('');
  }
  function clearFormErrors(isEdit = false) {
    const errorDiv = document.getElementById(
      isEdit ? 'editOsFormErrors' : 'osFormErrors'
    );
    if (errorDiv) errorDiv.innerHTML = '';
  }

  // Máscara de telefone
  maskPhone(document.getElementById('phone'));
  maskPhone(document.getElementById('editPhone'));

  // --- Adicionar Serviço: Validação e Comissão ---
  function maskMoney(input) {
    input.addEventListener('input', function () {
      let v = input.value.replace(/\D/g, '');
      v = (parseInt(v, 10) / 100).toFixed(2) + '';
      v = v.replace('.', ',');
      v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      input.value = v;
    });
  }
  const serviceName = document.getElementById('serviceName');
  const servicePrice = document.getElementById('servicePrice');
  const serviceCommission = document.getElementById('serviceCommission');
  const btnUpdateCommission = document.getElementById('btnUpdateCommission');

  if (servicePrice) {
    maskMoney(servicePrice);
  }
  if (btnUpdateCommission) {
    btnUpdateCommission.addEventListener('click', function () {
      let valor = servicePrice.value.replace(/\./g, '').replace(',', '.');
      valor = parseFloat(valor);
      if (!isNaN(valor)) {
        const metade = (valor / 2).toFixed(2).replace('.', ',');
        serviceCommission.value = metade;
      } else {
        serviceCommission.value = '';
      }
    });
  }
  // Validação do modal de serviço
  function validateServiceForm() {
    const errors = [];
    const nome = serviceName ? serviceName.value.trim() : '';
    const preco = servicePrice ? servicePrice.value.trim() : '';
    if (!nome) errors.push('Nome do Serviço é obrigatório.');
    if (!preco || isNaN(parseFloat(preco.replace('.', '').replace(',', '.'))))
      errors.push(
        'Preço Total do Serviço é obrigatório e deve ser um valor válido.'
      );
    return errors;
  }
  function showServiceFormErrors(errors) {
    let errorDiv = document.getElementById('serviceFormErrors');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.id = 'serviceFormErrors';
      errorDiv.className = 'mb-2 text-red-400 text-sm';
      const form = document.querySelector('#modalAddService .p-6');
      form.insertBefore(errorDiv, form.firstChild);
    }
    errorDiv.innerHTML = errors.map((e) => `<div>• ${e}</div>`).join('');
  }
  function clearServiceFormErrors() {
    const errorDiv = document.getElementById('serviceFormErrors');
    if (errorDiv) errorDiv.innerHTML = '';
  }
  document
    .querySelector('#modalAddService .bg-accent-amber')
    .addEventListener('click', function (e) {
      clearServiceFormErrors();
      const errors = validateServiceForm();
      if (errors.length) {
        showServiceFormErrors(errors);
        e.preventDefault();
        return;
      }
      // Aqui segue o fluxo normal de adição de serviço
    });

  // Exemplo de preenchimento dinâmico dos selects
  const servicos = [
    { nome: 'Formatação', valor: 150.0 },
    { nome: 'Troca de fonte', valor: 250.0 },
    { nome: 'Troca de tela', valor: 350.0 },
    { nome: 'Limpeza', valor: 120.0 },
    { nome: 'Reparo de placa', valor: 200.0 },
  ];
  const statusList = [
    'Aguardando',
    'Em andamento',
    'Aguardando peça',
    'Concluído',
    'Entregue',
  ];

  // --- GRÁFICO DE LUCROS ---
  // Exemplo de dados dinâmicos (pode ser substituído depois)
  const chartData = {
    anos: [2025],
    meses: [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ],
    valoresPorAno: {
      2025: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    meta: 0, // valor de meta para linha de referência (zerado)
  };

  // Atualizar IDs para português
  function fillSelectOptions() {
    const selects = [
      { id: 'selectServico', arr: servicos, isServico: true },
      { id: 'selectServicoEditar', arr: servicos, isServico: true },
      { id: 'selectStatus', arr: statusList },
      { id: 'selectStatusEditar', arr: statusList },
    ];
    selects.forEach((sel) => {
      const select = document.getElementById(sel.id);
      if (!select) return;
      select.innerHTML = '';
      if (sel.isServico) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'Selecione um serviço';
        select.appendChild(opt);
        sel.arr.forEach((s) => {
          const o = document.createElement('option');
          o.value = s.valor;
          o.textContent = s.nome;
          select.appendChild(o);
        });
      } else {
        sel.arr.forEach((s) => {
          const o = document.createElement('option');
          o.value = s;
          o.textContent = s;
          select.appendChild(o);
        });
      }
    });
  }
  fillSelectOptions();

  // Gráfico: atualizar para filtroAno
  function fillYearFilter() {
    const filtroAno = document.getElementById('filtroAno');
    filtroAno.innerHTML = '';
    chartData.anos.forEach((ano) => {
      const opt = document.createElement('option');
      opt.value = ano;
      opt.textContent = ano;
      filtroAno.appendChild(opt);
    });
  }
  if (document.getElementById('filtroAno')) {
    fillYearFilter();
    updateChart(chartData.anos[0]);
    document
      .getElementById('filtroAno')
      .addEventListener('change', function () {
        updateChart(this.value);
      });
  }

  function fillYearFilter() {
    const yearFilter = document.getElementById('filtroAno');
    yearFilter.innerHTML = '';
    chartData.anos.forEach((ano) => {
      const opt = document.createElement('option');
      opt.value = ano;
      opt.textContent = ano;
      yearFilter.appendChild(opt);
    });
  }

  function fillChartYAxis(maxValue) {
    const yAxis = document.getElementById('chartYAxis');
    yAxis.innerHTML = '';
    // Exemplo: 5 divisões
    for (let i = 5; i >= 0; i--) {
      const valor = Math.round((maxValue * i) / 5);
      const span = document.createElement('span');
      span.textContent =
        'R$ ' + valor.toLocaleString('pt-BR', { minimumFractionDigits: 0 });
      yAxis.appendChild(span);
    }
  }

  function fillChartXAxis() {
    const xAxis = document.getElementById('chartXAxis');
    xAxis.innerHTML = '';
    chartData.meses.forEach((mes) => {
      const span = document.createElement('span');
      span.textContent = mes;
      xAxis.appendChild(span);
    });
  }

  function fillChartReferenceLines() {
    const refLines = document.getElementById('chartReferenceLines');
    refLines.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const div = document.createElement('div');
      div.className = 'border-b border-dark-base border-opacity-30 h-0';
      refLines.appendChild(div);
    }
  }

  function fillChartBars(ano) {
    const barsContainer = document.getElementById('chartBarsContainer');
    // Remove barras antigas (exceto linhas de referência e meta)
    barsContainer.querySelectorAll('.chart-bar').forEach((e) => e.remove());
    const valores = chartData.valoresPorAno[ano] || [];
    const max = Math.max(...valores, chartData.meta || 0);
    valores.forEach((valor, idx) => {
      const bar = document.createElement('div');
      bar.className = 'flex-1 flex items-end justify-center';
      const barInner = document.createElement('div');
      barInner.className =
        'w-10 bg-accent-blue bg-opacity-80 rounded-t-sm chart-bar';
      const altura = max > 0 ? (valor / max) * 80 + 10 : 0; // altura relativa (10% a 90%)
      barInner.style.setProperty('--target-height', altura + '%');
      barInner.style.height = '0%';
      bar.appendChild(barInner);
      barsContainer.appendChild(bar);
    });
    // Atualiza linha de meta
    const goalLine = document.getElementById('chartGoalLine');
    if (goalLine) {
      const meta = chartData.meta || 0;
      if (meta > 0 && max > 0) {
        const metaPercent = (meta / max) * 80 + 10;
        goalLine.style.top = 100 - metaPercent + '%';
        goalLine.style.display = '';
      } else {
        goalLine.style.display = 'none';
      }
    }
  }

  function updateChart(ano) {
    const valores = chartData.valoresPorAno[ano] || [];
    const max = Math.max(...valores, chartData.meta || 0);
    fillChartYAxis(max);
    fillChartXAxis();
    fillChartReferenceLines();
    fillChartBars(ano);
    // Preencher total do período
    const total = valores.reduce((acc, v) => acc + v, 0);
    const totalSpan = document.getElementById('chartTotalPeriodo');
    if (totalSpan) {
      totalSpan.textContent =
        total === 0
          ? '-'
          : 'R$ ' + total.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    }
  }

  // Inicialização do gráfico
  if (document.getElementById('filtroAno')) {
    fillYearFilter();
    updateChart(chartData.anos[0]);
    document
      .getElementById('filtroAno')
      .addEventListener('change', function () {
        updateChart(this.value);
      });
  }

  // --- Exclusão de Chamado (OS) ---
  const btnDeletarChamado = document.getElementById('btnDeletarChamado');
  if (btnDeletarChamado) {
    btnDeletarChamado.addEventListener('click', function () {
      if (
        !confirm(
          'Tem certeza que deseja excluir este chamado? Essa ação não pode ser desfeita.'
        )
      )
        return;
      // Recupera o ID do chamado a partir do modal (exemplo: pode ser salvo em um atributo data-id)
      const osId = btnDeletarChamado.getAttribute('data-id');
      if (!osId) {
        alert('ID do chamado não encontrado.');
        return;
      }
      fetch('chamados_delete.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: osId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert('Chamado excluído com sucesso!');
            closeAllModals();
            // Atualize a tabela de OS aqui, se necessário
          } else {
            alert(
              'Erro ao excluir chamado: ' + (data.error || 'Erro desconhecido.')
            );
          }
        })
        .catch(() => alert('Erro de comunicação com o servidor.'));
    });
  }

  // --- GERENCIAMENTO DE SERVIÇOS (LISTAR, EDITAR, EXCLUIR) ---
  const btnManageServices = document.getElementById('btnManageServices');
  const modalManageServices = document.getElementById('modalManageServices');
  const servicesTableBody = document.getElementById('servicesTableBody');
  const modalEditService = document.getElementById('modalEditService');
  const modalDeleteService = document.getElementById('modalDeleteService');
  let servicoEditandoId = null;
  let servicoExcluindoId = null;

  // Abrir modal de gerenciamento e listar serviços
  if (btnManageServices) {
    btnManageServices.addEventListener('click', function () {
      openModal('modalManageServices');
      carregarServicos();
    });
  }

  // Função para carregar serviços via AJAX
  function carregarServicos() {
    fetch('servicos_select.php')
      .then((res) => res.json())
      .then((data) => {
        servicesTableBody.innerHTML = '';
        if (data && Array.isArray(data)) {
          data.forEach((servico) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td class="px-4 py-2 text-gray-200">${servico.nome}</td>
              <td class="px-4 py-2 text-gray-200">R$ ${parseFloat(
                servico.valor
              ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td class="px-4 py-2 text-gray-200">R$ ${parseFloat(
                servico.comissao
              ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td class="px-4 py-2 text-center">
                <button class="btn-editar-servico text-accent-blue hover:underline mr-2" data-id="${
                  servico.id
                }" data-nome="${servico.nome}" data-valor="${
              servico.valor
            }" data-comissao="${servico.comissao}">Editar</button>
                <button class="btn-excluir-servico text-status-red hover:underline" data-id="${
                  servico.id
                }">Excluir</button>
              </td>
            `;
            servicesTableBody.appendChild(tr);
          });
        } else {
          servicesTableBody.innerHTML =
            '<tr><td colspan="4" class="text-center text-gray-400 py-4">Nenhum serviço cadastrado.</td></tr>';
        }
        // Adiciona eventos aos botões de ação
        document.querySelectorAll('.btn-editar-servico').forEach((btn) => {
          btn.addEventListener('click', function () {
            servicoEditandoId = this.getAttribute('data-id');
            document.getElementById('editServiceName').value =
              this.getAttribute('data-nome');
            document.getElementById('editServicePrice').value = parseFloat(
              this.getAttribute('data-valor')
            ).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
            document.getElementById('editServiceCommission').value = parseFloat(
              this.getAttribute('data-comissao')
            ).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
            openModal('modalEditService');
          });
        });
        document.querySelectorAll('.btn-excluir-servico').forEach((btn) => {
          btn.addEventListener('click', function () {
            servicoExcluindoId = this.getAttribute('data-id');
            openModal('modalDeleteService');
          });
        });
      })
      .catch(() => {
        servicesTableBody.innerHTML =
          '<tr><td colspan="4" class="text-center text-red-400 py-4">Erro ao carregar serviços.</td></tr>';
      });
  }

  // Salvar edição de serviço
  const btnSalvarEdicaoServico = document.getElementById(
    'btnSalvarEdicaoServico'
  );
  if (btnSalvarEdicaoServico) {
    btnSalvarEdicaoServico.addEventListener('click', function () {
      const nome = document.getElementById('editServiceName').value.trim();
      const valor = document
        .getElementById('editServicePrice')
        .value.replace('.', '')
        .replace(',', '.');
      const comissao = document
        .getElementById('editServiceCommission')
        .value.replace('.', '')
        .replace(',', '.');
      if (!nome || isNaN(parseFloat(valor)) || isNaN(parseFloat(comissao))) {
        alert('Preencha todos os campos corretamente.');
        return;
      }
      fetch('servicos_update.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: servicoEditandoId, nome, valor, comissao }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert('Serviço atualizado com sucesso!');
            closeAllModals();
            carregarServicos();
          } else {
            alert(
              'Erro ao atualizar serviço: ' +
                (data.error || 'Erro desconhecido.')
            );
          }
        })
        .catch(() => alert('Erro de comunicação com o servidor.'));
    });
  }

  // Confirmar exclusão de serviço
  const btnConfirmarExcluirServico = document.getElementById(
    'btnConfirmarExcluirServico'
  );
  if (btnConfirmarExcluirServico) {
    btnConfirmarExcluirServico.addEventListener('click', function () {
      if (!servicoExcluindoId) return;
      fetch('servicos_delete.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: servicoExcluindoId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert('Serviço excluído com sucesso!');
            closeAllModals();
            carregarServicos();
          } else {
            alert(
              'Erro ao excluir serviço: ' + (data.error || 'Erro desconhecido.')
            );
          }
        })
        .catch(() => alert('Erro de comunicação com o servidor.'));
    });
  }

  // Máscara para edição de preço/comissão
  const editServicePrice = document.getElementById('editServicePrice');
  const editServiceCommission = document.getElementById(
    'editServiceCommission'
  );
  if (editServicePrice) {
    editServicePrice.addEventListener('input', function () {
      let v = this.value.replace(/\D/g, '');
      v = (parseInt(v, 10) / 100).toFixed(2) + '';
      v = v.replace('.', ',');
      v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      this.value = v;
    });
  }
  if (editServiceCommission) {
    editServiceCommission.addEventListener('input', function () {
      let v = this.value.replace(/\D/g, '');
      v = (parseInt(v, 10) / 100).toFixed(2) + '';
      v = v.replace('.', ',');
      v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      this.value = v;
    });
  }

  // Botão Editar Meta
  const btnEditGoal = document.getElementById('btnEditGoal');
  if (btnEditGoal) {
    btnEditGoal.addEventListener('click', () => {
      openModal('modalEditGoal');
      // Aqui pode-se carregar a meta atual via AJAX futuramente
    });
  }

  // --- CAMPOS DE ANO E MÊS NO MODAL DE META ---
  function fillMetaAno() {
    const selectAno = document.getElementById('inputMetaAno');
    if (!selectAno) return;
    selectAno.innerHTML = '';
    const anoAtual = new Date().getFullYear();
    for (let i = anoAtual - 2; i <= anoAtual + 2; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i;
      if (i === anoAtual) opt.selected = true;
      selectAno.appendChild(opt);
    }
  }
  if (document.getElementById('inputMetaAno')) fillMetaAno();

  // Ao abrir o modal de meta, setar ano/mês atuais como padrão
  if (btnEditGoal) {
    btnEditGoal.addEventListener('click', () => {
      openModal('modalEditGoal');
      fillMetaAno();
      const mesAtual = new Date().getMonth() + 1;
      const selectMes = document.getElementById('inputMetaMes');
      if (selectMes) selectMes.value = mesAtual;
      // Aqui pode-se carregar a meta atual via AJAX futuramente
    });
  }

  // Clique em salvar meta (agora captura ano, mês e mensal)
  const btnSalvarMeta = document.getElementById('btnSalvarMeta');
  if (btnSalvarMeta) {
    btnSalvarMeta.addEventListener('click', function () {
      const ano = document.getElementById('inputMetaAno').value;
      const mes = document.getElementById('inputMetaMes').value;
      const mensal = document.getElementById('inputMetaMensal').value;
      // Aqui você pode integrar com meta_update.php via AJAX, enviando ano, mes, mensal
      alert(`Meta salva! Ano: ${ano}, Mês: ${mes}, Mensal: ${mensal}`);
      closeAllModals();
    });
  }
});

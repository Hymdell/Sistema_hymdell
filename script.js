// Manipulação das modais
// Agora todo o código só executa após o DOM estar pronto

document.addEventListener('DOMContentLoaded', function () {
  const modals = {
    modalAddOS: document.getElementById('modalAddOS'),
    modalEditOS: document.getElementById('modalEditOS'),
    modalAddService: document.getElementById('modalAddService'),
    modalCharts: document.getElementById('modalCharts'),
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
  document.getElementById('yearFilter').addEventListener('change', function () {
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
    .getElementById('servicoSelect')
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
    .getElementById('editServicoSelect')
    .addEventListener('change', function () {
      const valorInput = document.getElementById('editValorTotal');
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
    const servicoSelect = document.getElementById('servicoSelect');
    const valorInput = document.getElementById('valorTotal');
    let valorBase = parseFloat(servicoSelect.value);
    if (isNaN(valorBase)) {
      valorInput.value = '';
      return;
    }
    valorInput.value = valorBase.toFixed(2).replace('.', ',');
  }
  document
    .getElementById('servicoSelect')
    .addEventListener('change', atualizarValorTotalOS);
  // O tipo de recebimento não altera o valor exibido

  // Atualizar valor total SEMPRE com valor integral do serviço (edição)
  function atualizarValorTotalEditOS() {
    const servicoSelect = document.getElementById('editServicoSelect');
    const valorInput = document.getElementById('editValorTotal');
    let valorBase = parseFloat(servicoSelect.value);
    if (isNaN(valorBase)) {
      valorInput.value = '';
      return;
    }
    valorInput.value = valorBase.toFixed(2).replace('.', ',');
  }
  document
    .getElementById('editServicoSelect')
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
  function fillSelectOptions() {
    const selects = [
      { id: 'servicoSelect', arr: servicos, isServico: true },
      { id: 'editServicoSelect', arr: servicos, isServico: true },
      { id: 'statusSelect', arr: statusList },
      { id: 'editStatusSelect', arr: statusList },
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

  // Exemplo de uso na submissão do formulário (criação)
  document
    .querySelector('#modalAddOS .bg-accent-blue')
    .addEventListener('click', function (e) {
      clearFormErrors();
      const errors = validateOSForm(false);
      if (errors.length) {
        showFormErrors(errors, false);
        e.preventDefault();
        return;
      }
      // Aqui segue o fluxo normal de criação da OS
    });
  // Edição
  document
    .querySelector('#modalEditOS .bg-accent-blue')
    .addEventListener('click', function (e) {
      clearFormErrors(true);
      const errors = validateOSForm(true);
      if (errors.length) {
        showFormErrors(errors, true);
        e.preventDefault();
        return;
      }
      // Aqui segue o fluxo normal de edição da OS
    });

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

  function fillYearFilter() {
    const yearFilter = document.getElementById('yearFilter');
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
  if (document.getElementById('yearFilter')) {
    fillYearFilter();
    updateChart(chartData.anos[0]);
    document
      .getElementById('yearFilter')
      .addEventListener('change', function () {
        updateChart(this.value);
      });
  }
});

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
    const getValue = (id) => {
      const el = document.getElementById(
        prefix ? prefix + id.charAt(0).toUpperCase() + id.slice(1) : id
      );
      return el && typeof el.value === 'string' ? el.value.trim() : '';
    };
    const clientName = getValue('clientName');
    const attendant = getValue('attendant');
    const item = getValue('item');
    const entryDate = getValue('entryDate');
    const defectSolution = getValue('defectSolution');
    const osNumber = getValue('osNumber');
    const phone = getValue('phone');

    if (osNumber && !/^[\d]+$/.test(osNumber)) {
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

  // --- Preencher selects de serviço com ID como value ---
  function fillSelectOptions() {
    fetch('servicos_select.php')
      .then((res) => res.json())
      .then((servicos) => {
        // Preencher selectServico (adicionar OS)
        const selectServico = document.getElementById('selectServico');
        if (selectServico) {
          selectServico.innerHTML = '';
          const opt = document.createElement('option');
          opt.value = '';
          opt.textContent = 'Selecione um serviço';
          selectServico.appendChild(opt);
          servicos.forEach((s) => {
            const o = document.createElement('option');
            o.value = s.id;
            o.textContent = s.nome;
            o.setAttribute('data-valor', s.valor);
            selectServico.appendChild(o);
          });
        }
        // Preencher selectServicoEditar (editar OS)
        const selectServicoEditar = document.getElementById(
          'selectServicoEditar'
        );
        if (selectServicoEditar) {
          selectServicoEditar.innerHTML = '';
          const opt = document.createElement('option');
          opt.value = '';
          opt.textContent = 'Selecione um serviço';
          selectServicoEditar.appendChild(opt);
          servicos.forEach((s) => {
            const o = document.createElement('option');
            o.value = s.id;
            o.textContent = s.nome;
            o.setAttribute('data-valor', s.valor);
            selectServicoEditar.appendChild(o);
          });
        }
      });
    // Preencher status
    const statusList = [
      'Aguardando',
      'Em andamento',
      'Aguardando peça',
      'Concluído',
      'Entregue',
    ];
    const selectStatus = document.getElementById('selectStatus');
    if (selectStatus) {
      selectStatus.innerHTML = '';
      statusList.forEach((s) => {
        const o = document.createElement('option');
        o.value = s;
        o.textContent = s;
        selectStatus.appendChild(o);
      });
    }
    const selectStatusEditar = document.getElementById('selectStatusEditar');
    if (selectStatusEditar) {
      selectStatusEditar.innerHTML = '';
      statusList.forEach((s) => {
        const o = document.createElement('option');
        o.value = s;
        o.textContent = s;
        selectStatusEditar.appendChild(o);
      });
    }
  }
  fillSelectOptions();

  // Atualizar valor total ao selecionar serviço (usando data-valor)
  document
    .getElementById('selectServico')
    .addEventListener('change', function () {
      const valorInput = document.getElementById('valorTotal');
      const selected = this.options[this.selectedIndex];
      const valor = selected.getAttribute('data-valor');
      if (valor) {
        valorInput.value = parseFloat(valor).toFixed(2).replace('.', ',');
      } else {
        valorInput.value = '';
      }
    });
  document
    .getElementById('selectServicoEditar')
    .addEventListener('change', function () {
      const valorInput = document.getElementById('valorTotalEditar');
      const selected = this.options[this.selectedIndex];
      const valor = selected.getAttribute('data-valor');
      if (valor) {
        valorInput.value = parseFloat(valor).toFixed(2).replace('.', ',');
      } else {
        valorInput.value = '';
      }
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

  // --- SUPORTE AO FILTRO DE MÊS NO GRÁFICO ---
  function getDiasNoMes(ano, mes) {
    return new Date(ano, mes, 0).getDate();
  }

  // Exemplo de dados diários (substitua por dados reais do backend futuramente)
  const chartDataDiario = {
    // chartDataDiario[ano][mes] = [valorDia1, valorDia2, ...]
    2025: {
      6: Array.from({ length: 30 }, (_, i) => Math.floor(Math.random() * 500)), // Junho 2025
      7: Array.from({ length: 31 }, (_, i) => Math.floor(Math.random() * 500)), // Julho 2025
    },
  };

  function fillChartXAxisDias(ano, mes) {
    const xAxis = document.getElementById('chartXAxis');
    xAxis.innerHTML = '';
    const dias = getDiasNoMes(ano, mes);
    for (let d = 1; d <= dias; d++) {
      const span = document.createElement('span');
      span.textContent = d;
      xAxis.appendChild(span);
    }
  }

  function fillChartBarsDias(ano, mes) {
    const barsContainer = document.getElementById('chartBarsContainer');
    barsContainer.querySelectorAll('.chart-bar').forEach((e) => e.remove());
    const valores = (chartDataDiario[ano] && chartDataDiario[ano][mes]) || [];
    const max = Math.max(...valores, chartData.meta || 0);
    valores.forEach((valor, idx) => {
      const bar = document.createElement('div');
      bar.className = 'flex-1 flex items-end justify-center';
      const barInner = document.createElement('div');
      barInner.className =
        'w-4 bg-accent-blue bg-opacity-80 rounded-t-sm chart-bar';
      const altura = max > 0 ? (valor / max) * 80 + 10 : 0;
      barInner.style.setProperty('--target-height', altura + '%');
      barInner.style.height = '0%';
      bar.appendChild(barInner);
      barsContainer.appendChild(bar);
    });
    // Atualiza linha de meta (opcional)
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

  function updateChartDiario(ano, mes) {
    const valores = (chartDataDiario[ano] && chartDataDiario[ano][mes]) || [];
    const max = Math.max(...valores, chartData.meta || 0);
    fillChartYAxis(max);
    fillChartXAxisDias(ano, mes);
    fillChartReferenceLines();
    fillChartBarsDias(ano, mes);
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

  // Inicialização do gráfico diário
  if (
    document.getElementById('filtroAno') &&
    document.getElementById('filtroMes')
  ) {
    const filtroAno = document.getElementById('filtroAno');
    const filtroMes = document.getElementById('filtroMes');
    filtroMes.value = (new Date().getMonth() + 1).toString();
    filtroAno.addEventListener('change', function () {
      updateChartDiario(Number(filtroAno.value), Number(filtroMes.value));
    });
    filtroMes.addEventListener('change', function () {
      updateChartDiario(Number(filtroAno.value), Number(filtroMes.value));
    });
    // Exibe gráfico diário ao abrir
    updateChartDiario(Number(filtroAno.value), Number(filtroMes.value));
  }

  // --- TOGGLE ENTRE VISUALIZAÇÃO ANUAL E MENSAL ---
  let visaoGrafico = 'anual'; // 'anual' ou 'mensal'
  const toggleVisaoGrafico = document.getElementById('toggleVisaoGrafico');
  if (
    toggleVisaoGrafico &&
    document.getElementById('filtroAno') &&
    document.getElementById('filtroMes')
  ) {
    const filtroAno = document.getElementById('filtroAno');
    const filtroMes = document.getElementById('filtroMes');
    function atualizarVisaoGrafico() {
      if (visaoGrafico === 'anual') {
        toggleVisaoGrafico.textContent = 'Anual';
        filtroMes.disabled = true;
        updateChart(Number(filtroAno.value));
      } else {
        toggleVisaoGrafico.textContent = 'Mensal';
        filtroMes.disabled = false;
        updateChartDiario(Number(filtroAno.value), Number(filtroMes.value));
      }
    }
    toggleVisaoGrafico.addEventListener('click', function () {
      visaoGrafico = visaoGrafico === 'anual' ? 'mensal' : 'anual';
      atualizarVisaoGrafico();
    });
    filtroAno.addEventListener('change', atualizarVisaoGrafico);
    filtroMes.addEventListener('change', function () {
      if (visaoGrafico === 'mensal') atualizarVisaoGrafico();
    });
    // Inicialização: começa em anual
    filtroMes.disabled = true;
    atualizarVisaoGrafico();
  }

  // --- CRUD DE METAS (AJAX) ---
  function buscarMeta(ano, mes) {
    return fetch('meta_select.php')
      .then((res) => res.json())
      .then((metas) => {
        if (!Array.isArray(metas)) return null;
        return metas.find(
          (m) => Number(m.ano) === Number(ano) && Number(m.mes) === Number(mes)
        );
      });
  }

  function inserirOuAtualizarMeta(ano, mes, valor) {
    // Tenta buscar meta existente
    return buscarMeta(ano, mes).then((meta) => {
      if (meta) {
        // Atualizar
        const formData = new FormData();
        formData.append('id', meta.id);
        formData.append('valor', valor);
        return fetch('meta_update.php', {
          method: 'POST',
          body: formData,
        }).then((res) => res.json());
      } else {
        // Inserir
        const formData = new FormData();
        formData.append('ano', ano);
        formData.append('mes', mes);
        formData.append('valor', valor);
        return fetch('meta_insert.php', {
          method: 'POST',
          body: formData,
        }).then((res) => res.json());
      }
    });
  }

  function deletarMeta(id) {
    const formData = new FormData();
    formData.append('id', id);
    return fetch('meta_delete.php', {
      method: 'POST',
      body: formData,
    }).then((res) => res.json());
  }

  // --- Integração com o modal de meta ---
  if (btnEditGoal) {
    btnEditGoal.addEventListener('click', () => {
      openModal('modalEditGoal');
      fillMetaAno();
      const mesAtual = new Date().getMonth() + 1;
      const selectMes = document.getElementById('inputMetaMes');
      const selectAno = document.getElementById('inputMetaAno');
      if (selectMes) selectMes.value = mesAtual;
      // Buscar meta existente e preencher campo
      buscarMeta(selectAno.value, selectMes.value).then((meta) => {
        document.getElementById('inputMetaMensal').value = meta
          ? Number(meta.valor).toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
            })
          : '';
        document
          .getElementById('inputMetaMensal')
          .setAttribute('data-meta-id', meta ? meta.id : '');
      });
      // Atualizar campo ao trocar ano/mês
      selectAno.addEventListener('change', function () {
        buscarMeta(this.value, selectMes.value).then((meta) => {
          document.getElementById('inputMetaMensal').value = meta
            ? Number(meta.valor).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })
            : '';
          document
            .getElementById('inputMetaMensal')
            .setAttribute('data-meta-id', meta ? meta.id : '');
        });
      });
      selectMes.addEventListener('change', function () {
        buscarMeta(selectAno.value, this.value).then((meta) => {
          document.getElementById('inputMetaMensal').value = meta
            ? Number(meta.valor).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })
            : '';
          document
            .getElementById('inputMetaMensal')
            .setAttribute('data-meta-id', meta ? meta.id : '');
        });
      });
    });
  }

  if (btnSalvarMeta) {
    btnSalvarMeta.addEventListener('click', function () {
      const ano = document.getElementById('inputMetaAno').value;
      const mes = document.getElementById('inputMetaMes').value;
      let mensal = document.getElementById('inputMetaMensal').value;
      mensal = mensal.replace(/\./g, '').replace(',', '.');
      if (!ano || !mes || !mensal || isNaN(Number(mensal))) {
        alert('Preencha todos os campos corretamente.');
        return;
      }
      inserirOuAtualizarMeta(ano, mes, mensal).then((res) => {
        if (res.success) {
          alert('Meta salva com sucesso!');
          closeAllModals();
        } else {
          alert('Erro ao salvar meta: ' + (res.error || 'Erro desconhecido.'));
        }
      });
    });
  }

  // --- INSERÇÃO DE SERVIÇO VIA AJAX ---
  const btnSalvarServico = document.querySelector(
    '#modalAddService .bg-accent-amber'
  );
  if (btnSalvarServico) {
    btnSalvarServico.addEventListener('click', function (e) {
      clearServiceFormErrors();
      const errors = validateServiceForm();
      if (errors.length) {
        showServiceFormErrors(errors);
        e.preventDefault();
        return;
      }
      const nome = serviceName.value.trim();
      const valor = servicePrice.value.replace(/\./g, '').replace(',', '.');
      const comissao = serviceCommission.value
        .replace(/\./g, '')
        .replace(',', '.');
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('valor', valor);
      formData.append('comissao', comissao);
      fetch('servicos_insert.php', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert('Serviço adicionado com sucesso!');
            closeAllModals();
            // Limpar formulário
            serviceName.value = '';
            servicePrice.value = '';
            serviceCommission.value = '';
            // Atualizar selects e tabela de serviços
            carregarServicos();
            fillSelectOptions();
          } else {
            alert(
              'Erro ao adicionar serviço: ' +
                (data.error || 'Erro desconhecido.')
            );
          }
        })
        .catch(() => alert('Erro de comunicação com o servidor.'));
    });
  }

  // --- LISTAGEM DINÂMICA DE CHAMADOS/OS ---
  function carregarChamados() {
    fetch('chamados_select.php')
      .then((res) => res.json())
      .then((data) => {
        const osTableBody = document.getElementById('osTableBody');
        osTableBody.innerHTML = '';
        if (data && Array.isArray(data) && data.length > 0) {
          data.forEach((os) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td class="px-4 py-2 text-gray-200">${os.id}</td>
              <td class="px-4 py-2 text-gray-200">${os.numero_os || '-'}</td>
              <td class="px-4 py-2 text-gray-200">${os.cliente}</td>
              <td class="px-4 py-2 text-gray-200">${os.item}</td>
              <td class="px-4 py-2 text-gray-200">${
                os.data_entrada ? formatarData(os.data_entrada) : '-'
              }</td>
              <td class="px-4 py-2 text-gray-200">${
                os.data_atualizacao ? formatarData(os.data_atualizacao) : '-'
              }</td>
              <td class="px-4 py-2 text-gray-200">${os.status}</td>
              <td class="px-4 py-2 text-gray-200">R$ ${parseFloat(
                os.valor
              ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td class="px-4 py-2 text-center">
                <button class="btn-editar-os text-accent-blue hover:underline mr-2" data-id="${
                  os.id
                }">Editar</button>
                <button class="btn-excluir-os text-status-red hover:underline" data-id="${
                  os.id
                }">Excluir</button>
              </td>
            `;
            osTableBody.appendChild(tr);
          });
        } else {
          osTableBody.innerHTML =
            '<tr><td colspan="9" class="text-center text-gray-400 py-4">Nenhuma OS cadastrada.</td></tr>';
        }
        // Adicionar eventos aos botões de ação (editar/excluir)
        document.querySelectorAll('.btn-editar-os').forEach((btn) => {
          btn.addEventListener('click', function () {
            abrirModalEditarOS(this.getAttribute('data-id'));
          });
        });
        document.querySelectorAll('.btn-excluir-os').forEach((btn) => {
          btn.addEventListener('click', function () {
            excluirChamado(this.getAttribute('data-id'));
          });
        });
      })
      .catch(() => {
        const osTableBody = document.getElementById('osTableBody');
        osTableBody.innerHTML =
          '<tr><td colspan="9" class="text-center text-red-400 py-4">Erro ao carregar OS.</td></tr>';
      });
  }

  // Função utilitária para formatar datas (YYYY-MM-DD para DD/MM/YYYY)
  function formatarData(dataStr) {
    if (!dataStr) return '';
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  // Chamar ao carregar a página
  carregarChamados();

  // --- EDIÇÃO E EXCLUSÃO DE OS VIA AJAX ---
  let osEditandoId = null;

  // Abrir modal de edição e preencher campos
  function abrirModalEditarOS(id) {
    fetch('chamados_select.php')
      .then((res) => res.json())
      .then((data) => {
        const os = data.find((c) => String(c.id) === String(id));
        if (!os) return alert('OS não encontrada!');
        osEditandoId = os.id;
        document.getElementById('editOsNumber').textContent = os.numero_os
          ? `#${os.numero_os}`
          : '';
        document.getElementById('editClientName').value = os.cliente || '';
        document.getElementById('editAttendant').value = os.atendente || '';
        document.getElementById('editPhone').value = os.telefone || '';
        document.getElementById('editItem').value = os.item || '';
        document.getElementById('editEntryDate').value = os.data_entrada || '';
        document.getElementById('editExitDate').value = os.data_saida || '';
        document.getElementById('editDefectSolution').value =
          os.defeito_solucao || '';
        // Preencher selects de serviço e status
        fetch('servicos_select.php')
          .then((res) => res.json())
          .then((servicos) => {
            const selectServicoEditar = document.getElementById(
              'selectServicoEditar'
            );
            selectServicoEditar.innerHTML = '';
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'Selecione um serviço';
            selectServicoEditar.appendChild(opt);
            servicos.forEach((s, idx) => {
              const o = document.createElement('option');
              o.value = s.id;
              o.textContent = s.nome;
              if (String(s.id) === String(os.servico_id)) o.selected = true;
              selectServicoEditar.appendChild(o);
            });
          });
        // Status
        const statusList = [
          'Aguardando',
          'Em andamento',
          'Aguardando peça',
          'Concluído',
          'Entregue',
        ];
        const selectStatusEditar =
          document.getElementById('selectStatusEditar');
        selectStatusEditar.innerHTML = '';
        statusList.forEach((s) => {
          const o = document.createElement('option');
          o.value = s;
          o.textContent = s;
          if (s === os.status) o.selected = true;
          selectStatusEditar.appendChild(o);
        });
        // Valor total
        document.getElementById('valorTotalEditar').value = parseFloat(
          os.valor_total
        ).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        // Tipo recebimento
        document.getElementById('selectRecebimentoEditar').value =
          os.tipo_recebimento || 'comissao';
        openModal('modalEditOS');
        // Salvar ID para exclusão
        document
          .getElementById('btnDeletarChamado')
          .setAttribute('data-id', os.id);
      });
  }

  // Salvar edição de OS
  const btnSalvarEdicaoOS = document.querySelector(
    '#modalEditOS .bg-accent-blue'
  );
  if (btnSalvarEdicaoOS) {
    btnSalvarEdicaoOS.addEventListener('click', function (e) {
      clearFormErrors(true);
      const errors = validateOSForm(true);
      if (errors.length) {
        showFormErrors(errors, true);
        e.preventDefault();
        return;
      }
      // Coletar dados do formulário de edição
      const numero_os = document
        .getElementById('editOsNumber')
        .textContent.replace('#', '')
        .trim();
      const cliente = document.getElementById('editClientName').value.trim();
      const atendente = document.getElementById('editAttendant').value.trim();
      const telefone = document.getElementById('editPhone').value.trim();
      const item = document.getElementById('editItem').value.trim();
      const data_entrada = document.getElementById('editEntryDate').value;
      const data_saida = document.getElementById('editExitDate').value;
      const defeito_solucao = document
        .getElementById('editDefectSolution')
        .value.trim();
      const servico_id = document.getElementById('selectServicoEditar').value;
      const tipo_recebimento = document.getElementById(
        'selectRecebimentoEditar'
      ).value;
      const valor_total = document
        .getElementById('valorTotalEditar')
        .value.replace(/\./g, '')
        .replace(',', '.');
      const status = document.getElementById('selectStatusEditar').value;
      const payload = {
        id: osEditandoId,
        numero_os,
        cliente,
        atendente,
        telefone,
        item,
        data_entrada,
        data_saida,
        defeito_solucao,
        servico_id,
        tipo_recebimento,
        valor_total,
        status,
      };
      fetch('chamados_update.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert('Ordem de Serviço atualizada com sucesso!');
            closeAllModals();
            carregarChamados();
          } else {
            alert(
              'Erro ao atualizar OS: ' + (data.error || 'Erro desconhecido.')
            );
          }
        })
        .catch(() => alert('Erro de comunicação com o servidor.'));
    });
  }

  // Excluir OS
  function excluirChamado(id) {
    if (
      !confirm(
        'Tem certeza que deseja excluir este chamado? Essa ação não pode ser desfeita.'
      )
    )
      return;
    fetch('chamados_delete.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert('Chamado excluído com sucesso!');
          closeAllModals();
          carregarChamados();
        } else {
          alert(
            'Erro ao excluir chamado: ' + (data.error || 'Erro desconhecido.')
          );
        }
      })
      .catch(() => alert('Erro de comunicação com o servidor.'));
  }

  // --- ADIÇÃO DE OS (CHAMADO) ---
  const btnSalvarOS = document.querySelector('#modalAddOS .bg-accent-blue');
  if (btnSalvarOS) {
    btnSalvarOS.addEventListener('click', function (e) {
      clearFormErrors();
      const errors = validateOSForm();
      if (errors.length) {
        showFormErrors(errors);
        e.preventDefault();
        return;
      }
      // Coletar dados do formulário de adição
      const numero_os = document.getElementById('osNumber').value.trim();
      const cliente = document.getElementById('clientName').value.trim();
      const atendente = document.getElementById('attendant').value.trim();
      const telefone = document.getElementById('phone').value.trim();
      const item = document.getElementById('item').value.trim();
      const data_entrada = document.getElementById('entryDate').value;
      const data_saida = document.getElementById('exitDate').value;
      const defeito_solucao = document
        .getElementById('defectSolution')
        .value.trim();
      const servico_id = document.getElementById('selectServico').value;
      const tipo_recebimento =
        document.getElementById('selectRecebimento').value;
      const valor_total = document
        .getElementById('valorTotal')
        .value.replace(/\./g, '')
        .replace(',', '.');
      const status = document.getElementById('selectStatus').value;
      const payload = {
        numero_os,
        cliente,
        atendente,
        telefone,
        item,
        data_entrada,
        data_saida,
        defeito_solucao,
        servico_id,
        tipo_recebimento,
        valor_total,
        status,
      };
      fetch('chamados_insert.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert('Ordem de Serviço adicionada com sucesso!');
            closeAllModals();
            carregarChamados();
          } else {
            alert(
              'Erro ao adicionar OS: ' + (data.error || 'Erro desconhecido.')
            );
          }
        })
        .catch(() => alert('Erro de comunicação com o servidor.'));
    });
  }
});

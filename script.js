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
  let todasAsOrdens = [];
  let todosOsServicos = [];
  let servicoEditandoId = null;
  let servicoExcluindoId = null;
  let osEditandoId = null;
  let visaoGrafico = 'anual';
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
  document.querySelectorAll('.closeModal').forEach((button) => {
    button.addEventListener('click', closeAllModals);
  });
  Object.values(modals).forEach((modal) => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAllModals();
      });
    }
  });

  function openModal(modalId) {
    closeAllModals();
    if (modals[modalId]) {
      modals[modalId].classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      if (modalId === 'modalCharts') {
        animateChartBars();
      }
    }
  }

  function closeAllModals() {
    Object.values(modals).forEach((modal) => {
      if (modal) {
        modal.classList.add('hidden');
      }
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
  const filtroAnoGrafico = document.getElementById('filtroAno');
  if (filtroAnoGrafico) {
    filtroAnoGrafico.addEventListener('change', function () {
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
  }

  function atualizarValorTotalOS() {
    const selectServico = document.getElementById('selectServico');
    const valorInput = document.getElementById('valorTotal');
    const selectedOption = selectServico.options[selectServico.selectedIndex];
    const valorBase = selectedOption.getAttribute('data-valor');
    if (!valorBase) {
      valorInput.value = '';
      return;
    }
    valorInput.value = parseFloat(valorBase).toFixed(2).replace('.', ',');
  }
  const selectServico = document.getElementById('selectServico');
  if (selectServico) {
    selectServico.addEventListener('change', atualizarValorTotalOS);
  }

  function atualizarValorTotalEditOS() {
    const selectServicoEditar = document.getElementById('selectServicoEditar');
    const valorInput = document.getElementById('valorTotalEditar');
    const selectedOption =
      selectServicoEditar.options[selectServicoEditar.selectedIndex];
    const valorBase = selectedOption.getAttribute('data-valor');
    if (!valorBase) {
      valorInput.value = '';
      return;
    }
    valorInput.value = parseFloat(valorBase).toFixed(2).replace('.', ',');
  }
  const selectServicoEditar = document.getElementById('selectServicoEditar');
  if (selectServicoEditar) {
    selectServicoEditar.addEventListener('change', atualizarValorTotalEditOS);
  }

  function maskPhone(input) {
    if (!input) return;
    input.addEventListener('input', function () {
      let v = input.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      if (v.length > 10) {
        input.value = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (v.length > 6) {
        input.value = v.replace(/(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
      } else if (v.length > 2) {
        input.value = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      } else if (v.length > 0) {
        input.value = v.replace(/(\d*)/, '($1');
      } else {
        input.value = '';
      }
    });
  }

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
    if (!clientName) errors.push('Nome do Cliente é obrigatório.');
    if (!attendant) errors.push('Atendente é obrigatório.');
    if (!item) errors.push('Item é obrigatório.');
    if (!entryDate) errors.push('Data de Entrada é obrigatória.');
    if (!defectSolution) errors.push('Defeito/Solução é obrigatório.');
    return errors;
  }

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
  maskPhone(document.getElementById('phone'));
  maskPhone(document.getElementById('editPhone'));

  function maskMoney(input) {
    if (!input) return;
    input.addEventListener('input', function (e) {
      let v = e.target.value.replace(/\D/g, '');
      v = (v / 100).toFixed(2) + '';
      v = v.replace('.', ',');
      v = v.replace(/(\d)(?=(\d{3})+(\d{2})*,)/g, '$1.');
      e.target.value = v;
    });
  }
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

  function validateServiceForm() {
    const errors = [];
    const nome = document.getElementById('serviceName')
      ? document.getElementById('serviceName').value.trim()
      : '';
    const preco = document.getElementById('servicePrice')
      ? document.getElementById('servicePrice').value.trim()
      : '';
    if (!nome) errors.push('Nome do Serviço é obrigatório.');
    if (!preco || isNaN(parseFloat(preco.replace(/\./g, '').replace(',', '.'))))
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
    });
  }

  function fillSelectOptions() {
    fetch('servicos_select.php')
      .then((res) => res.json())
      .then((servicos) => {
        if (!Array.isArray(servicos)) return;
        servicos.sort((a, b) => a.nome.localeCompare(b.nome));
        const selectServico = document.getElementById('selectServico');
        if (selectServico) {
          selectServico.innerHTML =
            '<option value="">Selecione um serviço</option>';
          servicos.forEach((s) => {
            const o = document.createElement('option');
            o.value = s.id;
            o.textContent = s.nome;
            o.setAttribute('data-valor', s.valor);
            selectServico.appendChild(o);
          });
        }
        const selectServicoEditar = document.getElementById(
          'selectServicoEditar'
        );
        if (selectServicoEditar) {
          selectServicoEditar.innerHTML =
            '<option value="">Selecione um serviço</option>';
          servicos.forEach((s) => {
            const o = document.createElement('option');
            o.value = s.id;
            o.textContent = s.nome;
            o.setAttribute('data-valor', s.valor);
            selectServicoEditar.appendChild(o);
          });
        }
      });
    const statusList = [
      'Diagnosticando',
      'Aguardando Cliente',
      'Aguardando Peça',
      'Aguardando Retirada',
      'Concluído',
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
  const chartData = {
    anos: [new Date().getFullYear()],
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
      [new Date().getFullYear()]: Array(12).fill(0),
    },
    meta: 0,
  };

  function fillYearFilter() {
    const yearFilter = document.getElementById('filtroAno');
    if (!yearFilter) return;
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
    if (!yAxis) return;
    yAxis.innerHTML = '';
    const maxVal = maxValue > 0 ? maxValue : 1000;
    for (let i = 5; i >= 0; i--) {
      const valor = Math.round((maxVal * i) / 5);
      const span = document.createElement('span');
      span.textContent = 'R$ ' + valor.toLocaleString('pt-BR');
      yAxis.appendChild(span);
    }
  }

  function fillChartXAxis() {
    const xAxis = document.getElementById('chartXAxis');
    if (!xAxis) return;
    xAxis.innerHTML = '';
    chartData.meses.forEach((mes) => {
      const span = document.createElement('span');
      span.textContent = mes;
      xAxis.appendChild(span);
    });
  }

  function fillChartReferenceLines() {
    const refLines = document.getElementById('chartReferenceLines');
    if (!refLines) return;
    refLines.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const div = document.createElement('div');
      div.className = 'border-b border-dark-base border-opacity-30 h-0';
      refLines.appendChild(div);
    }
  }

  function fillChartBars(ano) {
    const barsContainer = document.getElementById('chartBarsContainer');
    if (!barsContainer) return;
    barsContainer.querySelectorAll('.chart-bar').forEach((e) => e.remove());
    const valores = chartData.valoresPorAno[ano] || [];
    const max = Math.max(...valores, chartData.meta || 0);
    const maxVal = max > 0 ? max : 1;
    valores.forEach((valor) => {
      const bar = document.createElement('div');
      bar.className = 'flex-1 flex items-end justify-center';
      const barInner = document.createElement('div');
      barInner.className =
        'w-10 bg-accent-blue bg-opacity-80 rounded-t-sm chart-bar';
      const altura = (valor / maxVal) * 90;
      barInner.style.setProperty('--target-height', altura + '%');
      barInner.style.height = '0%';
      bar.appendChild(barInner);
      barsContainer.appendChild(bar);
    });
    const goalLine = document.getElementById('chartGoalLine');
    if (goalLine) {
      const meta = chartData.meta || 0;
      if (meta > 0 && max > 0) {
        const metaPercent = (meta / max) * 90;
        goalLine.style.bottom = metaPercent + '%';
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
    const total = valores.reduce((acc, v) => acc + v, 0);
    const totalSpan = document.getElementById('chartTotalPeriodo');
    if (totalSpan) {
      totalSpan.textContent =
        total === 0
          ? '-'
          : 'R$ ' +
            total.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
            });
    }
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
  const btnDeletarChamado = document.getElementById('btnDeletarChamado');
  if (btnDeletarChamado) {
    btnDeletarChamado.addEventListener('click', function () {
      const osId = btnDeletarChamado.getAttribute('data-id');
      if (!osId) {
        showSnackbar('ID do chamado não encontrado.', 'error');
        return;
      }
      excluirChamado(osId);
    });
  }

  function renderizarServicos(filtro = '') {
    const servicesTableBody = document.getElementById('servicesTableBody');
    if (!servicesTableBody) return;
    const termoBusca = filtro.toLowerCase();
    const servicosFiltrados = todosOsServicos.filter((servico) =>
      servico.nome.toLowerCase().includes(termoBusca)
    );
    servicosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
    servicesTableBody.innerHTML = '';
    if (servicosFiltrados.length > 0) {
      servicosFiltrados.forEach((servico) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
                    <td class="px-4 py-2 text-gray-200">${servico.nome}</td>
                    <td class="px-4 py-2 text-gray-200">R$ ${parseFloat(
                      servico.valor
                    ).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}</td>
                    <td class="px-4 py-2 text-gray-200">R$ ${parseFloat(
                      servico.comissao
                    ).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}</td>
                    <td class="px-4 py-2 text-center">
                        <button class="btn-editar-servico text-accent-blue hover:underline" data-id="${
                          servico.id
                        }">Editar</button>
                    </td>`;
        servicesTableBody.appendChild(tr);
      });
    } else {
      servicesTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-gray-400 py-4">${
        filtro ? 'Nenhum serviço encontrado.' : 'Nenhum serviço cadastrado.'
      }</td></tr>`;
    }
    document.querySelectorAll('.btn-editar-servico').forEach((btn) => {
      btn.addEventListener('click', function () {
        servicoEditandoId = this.getAttribute('data-id');
        const servico = todosOsServicos.find((s) => s.id == servicoEditandoId);
        if (servico) {
          document.getElementById('editServiceName').value = servico.nome;
          document.getElementById('editServicePrice').value = parseFloat(
            servico.valor
          ).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
          });
          document.getElementById('editServiceCommission').value = parseFloat(
            servico.comissao
          ).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
          });
          openModal('modalEditService');
        }
      });
    });
  }

  function carregarServicos() {
    fetch('servicos_select.php')
      .then((res) => res.json())
      .then((data) => {
        todosOsServicos = Array.isArray(data) ? data : [];
        renderizarServicos();
      })
      .catch(() => {
        const servicesTableBody = document.getElementById('servicesTableBody');
        if (servicesTableBody) {
          servicesTableBody.innerHTML =
            '<tr><td colspan="4" class="text-center text-red-400 py-4">Erro ao carregar serviços.</td></tr>';
        }
      });
  }
  const searchServicoInput = document.getElementById('searchServico');
  if (searchServicoInput) {
    searchServicoInput.addEventListener('input', (e) => {
      renderizarServicos(e.target.value);
    });
  }
  const btnSalvarEdicaoServico = document.getElementById(
    'btnSalvarEdicaoServico'
  );
  if (btnSalvarEdicaoServico) {
    btnSalvarEdicaoServico.addEventListener('click', function () {
      const nome = document.getElementById('editServiceName').value.trim();
      const valor = document
        .getElementById('editServicePrice')
        .value.replace(/\./g, '')
        .replace(',', '.');
      const comissao = document
        .getElementById('editServiceCommission')
        .value.replace(/\./g, '')
        .replace(',', '.');
      if (!nome || isNaN(parseFloat(valor)) || isNaN(parseFloat(comissao))) {
        showSnackbar('Preencha todos os campos corretamente.', 'error');
        return;
      }
      fetch('servicos_update.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: servicoEditandoId,
          nome,
          valor,
          comissao,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            showSnackbar('Serviço atualizado com sucesso!', 'success');
            closeAllModals();
            carregarServicos();
            fillSelectOptions();
          } else {
            showSnackbar(
              'Erro ao atualizar serviço: ' +
                (data.error || 'Erro desconhecido.'),
              'error'
            );
          }
        })
        .catch(() =>
          showSnackbar('Erro de comunicação com o servidor.', 'error')
        );
    });
  }
  const btnExcluirServicoDoModal = document.getElementById(
    'btnExcluirServicoDoModal'
  );
  if (btnExcluirServicoDoModal) {
    btnExcluirServicoDoModal.addEventListener('click', function () {
      servicoExcluindoId = servicoEditandoId;
      closeModal('modalEditService');
      openModal('modalDeleteService');
    });
  }
  const btnConfirmarExcluirServico = document.getElementById(
    'btnConfirmarExcluirServico'
  );
  if (btnConfirmarExcluirServico) {
    btnConfirmarExcluirServico.addEventListener('click', function () {
      if (!servicoExcluindoId) return;
      fetch('servicos_delete.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: servicoExcluindoId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            showSnackbar('Serviço excluído com sucesso!', 'success');
            closeAllModals();
            carregarServicos();
            fillSelectOptions();
          } else {
            showSnackbar(
              'Erro ao excluir serviço: ' +
                (data.error || 'Erro desconhecido.'),
              'error'
            );
          }
        })
        .catch(() =>
          showSnackbar('Erro de comunicação com o servidor.', 'error')
        );
    });
  }
  const editServicePrice = document.getElementById('editServicePrice');
  const editServiceCommission = document.getElementById(
    'editServiceCommission'
  );
  if (editServicePrice) maskMoney(editServicePrice);
  if (editServiceCommission) maskMoney(editServiceCommission);
  const btnEditGoal = document.getElementById('btnEditGoal');
  if (btnEditGoal) {
    btnEditGoal.addEventListener('click', () => {
      openModal('modalEditGoal');
    });
  }

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
  if (btnEditGoal) {
    btnEditGoal.addEventListener('click', () => {
      openModal('modalEditGoal');
      fillMetaAno();
      const mesAtual = new Date().getMonth() + 1;
      const selectMes = document.getElementById('inputMetaMes');
      if (selectMes) selectMes.value = mesAtual;
    });
  }
  const btnSalvarMeta = document.getElementById('btnSalvarMeta');
  if (btnSalvarMeta) {
    btnSalvarMeta.addEventListener('click', function () {
      const ano = document.getElementById('inputMetaAno').value;
      const mes = document.getElementById('inputMetaMes').value;
      const mensal = document.getElementById('inputMetaMensal').value;
      showSnackbar(
        `Meta salva! Ano: ${ano}, Mês: ${mes}, Mensal: ${mensal}`,
        'success'
      );
      closeAllModals();
    });
  }

  function getDiasNoMes(ano, mes) {
    return new Date(ano, mes, 0).getDate();
  }
  const chartDataDiario = {
    2025: {
      6: Array.from(
        {
          length: 30,
        },
        (_, i) => Math.floor(Math.random() * 500)
      ),
      7: Array.from(
        {
          length: 31,
        },
        (_, i) => Math.floor(Math.random() * 500)
      ),
    },
  };

  function fillChartXAxisDias(ano, mes) {
    const xAxis = document.getElementById('chartXAxis');
    if (!xAxis) return;
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
    if (!barsContainer) return;
    barsContainer.querySelectorAll('.chart-bar').forEach((e) => e.remove());
    const valores = (chartDataDiario[ano] && chartDataDiario[ano][mes]) || [];
    const max = Math.max(...valores, chartData.meta || 0);
    const maxVal = max > 0 ? max : 1;
    valores.forEach((valor) => {
      const bar = document.createElement('div');
      bar.className = 'flex-1 flex items-end justify-center';
      const barInner = document.createElement('div');
      barInner.className =
        'w-4 bg-accent-blue bg-opacity-80 rounded-t-sm chart-bar';
      const altura = (valor / maxVal) * 90;
      barInner.style.setProperty('--target-height', altura + '%');
      barInner.style.height = '0%';
      bar.appendChild(barInner);
      barsContainer.appendChild(bar);
    });
    const goalLine = document.getElementById('chartGoalLine');
    if (goalLine) {
      const meta = chartData.meta || 0;
      if (meta > 0 && max > 0) {
        const metaPercent = (meta / max) * 90;
        goalLine.style.bottom = metaPercent + '%';
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
    const total = valores.reduce((acc, v) => acc + v, 0);
    const totalSpan = document.getElementById('chartTotalPeriodo');
    if (totalSpan) {
      totalSpan.textContent =
        total === 0
          ? '-'
          : 'R$ ' +
            total.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
            });
    }
  }
  if (
    document.getElementById('filtroAno') &&
    document.getElementById('filtroMes')
  ) {
    const filtroAno = document.getElementById('filtroAno');
    const filtroMes = document.getElementById('filtroMes');
    filtroMes.value = (new Date().getMonth() + 1).toString();
    const toggleVisaoGrafico = document.getElementById('toggleVisaoGrafico');

    function atualizarVisaoGrafico() {
      if (visaoGrafico === 'anual') {
        if (toggleVisaoGrafico) toggleVisaoGrafico.textContent = 'Anual';
        filtroMes.disabled = true;
        updateChart(Number(filtroAno.value));
      } else {
        if (toggleVisaoGrafico) toggleVisaoGrafico.textContent = 'Mensal';
        filtroMes.disabled = false;
        updateChartDiario(Number(filtroAno.value), Number(filtroMes.value));
      }
    }
    if (toggleVisaoGrafico) {
      toggleVisaoGrafico.addEventListener('click', function () {
        visaoGrafico = visaoGrafico === 'anual' ? 'mensal' : 'anual';
        atualizarVisaoGrafico();
      });
    }
    filtroAno.addEventListener('change', atualizarVisaoGrafico);
    filtroMes.addEventListener('change', function () {
      if (visaoGrafico === 'mensal') atualizarVisaoGrafico();
    });
    filtroMes.disabled = true;
    atualizarVisaoGrafico();
  }

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
    return buscarMeta(ano, mes).then((meta) => {
      const formData = new FormData();
      if (meta) {
        formData.append('id', meta.id);
        formData.append('valor', valor);
        return fetch('meta_update.php', {
          method: 'POST',
          body: formData,
        }).then((res) => res.json());
      } else {
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
  if (btnEditGoal) {
    btnEditGoal.addEventListener('click', () => {
      openModal('modalEditGoal');
      fillMetaAno();
      const mesAtual = new Date().getMonth() + 1;
      const selectMes = document.getElementById('inputMetaMes');
      const selectAno = document.getElementById('inputMetaAno');
      if (selectMes) selectMes.value = mesAtual;
      const inputMetaMensal = document.getElementById('inputMetaMensal');
      const carregarMeta = (ano, mes) => {
        buscarMeta(ano, mes).then((meta) => {
          inputMetaMensal.value = meta
            ? Number(meta.valor).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })
            : '';
          inputMetaMensal.setAttribute('data-meta-id', meta ? meta.id : '');
        });
      };
      if (selectAno && selectMes) {
        carregarMeta(selectAno.value, selectMes.value);
        selectAno.addEventListener('change', () =>
          carregarMeta(selectAno.value, selectMes.value)
        );
        selectMes.addEventListener('change', () =>
          carregarMeta(selectAno.value, selectMes.value)
        );
      }
    });
  }
  if (btnSalvarMeta) {
    btnSalvarMeta.addEventListener('click', function () {
      const ano = document.getElementById('inputMetaAno').value;
      const mes = document.getElementById('inputMetaMes').value;
      let mensal = document
        .getElementById('inputMetaMensal')
        .value.replace(/\./g, '')
        .replace(',', '.');
      if (!ano || !mes || !mensal || isNaN(Number(mensal))) {
        showSnackbar('Preencha todos os campos corretamente.', 'error');
        return;
      }
      inserirOuAtualizarMeta(ano, mes, mensal).then((res) => {
        if (res.success) {
          showSnackbar('Meta salva com sucesso!', 'success');
          closeAllModals();
        } else {
          showSnackbar(
            'Erro ao salvar meta: ' + (res.error || 'Erro desconhecido.'),
            'error'
          );
        }
      });
    });
  }
  if (btnSalvarServico) {
    btnSalvarServico.addEventListener('click', function (e) {
      clearServiceFormErrors();
      const errors = validateServiceForm();
      if (errors.length) {
        showServiceFormErrors(errors);
        e.preventDefault();
        return;
      }
      const nome = document.getElementById('serviceName').value.trim();
      const valor = document
        .getElementById('servicePrice')
        .value.replace(/\./g, '')
        .replace(',', '.');
      const comissao = document
        .getElementById('serviceCommission')
        .value.replace(/\./g, '')
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
            showSnackbar('Serviço adicionado com sucesso!', 'success');
            closeAllModals();
            document.getElementById('serviceName').value = '';
            document.getElementById('servicePrice').value = '';
            document.getElementById('serviceCommission').value = '';
            carregarServicos();
            fillSelectOptions();
          } else {
            showSnackbar(
              'Erro ao adicionar serviço: ' +
                (data.error || 'Erro desconhecido.'),
              'error'
            );
          }
        })
        .catch(() =>
          showSnackbar('Erro de comunicação com o servidor.', 'error')
        );
    });
  }

  function renderizarChamados(filtro = '') {
    const osTableBody = document.getElementById('osTableBody');
    if (!osTableBody) return;
    const termoBusca = filtro.toLowerCase();
    const ordensFiltradas = todasAsOrdens.filter((os) => {
      const osNum = os.numero_os || '';
      const cliente = os.cliente || '';
      const item = os.item || '';
      return (
        osNum.toString().toLowerCase().includes(termoBusca) ||
        cliente.toLowerCase().includes(termoBusca) ||
        item.toLowerCase().includes(termoBusca)
      );
    });
    osTableBody.innerHTML = '';
    if (ordensFiltradas.length > 0) {
      ordensFiltradas.forEach((os) => {
        function formatarDataHora(dataStr) {
          if (!dataStr) return '-';
          const dataObj = new Date(dataStr);
          if (isNaN(dataObj.getTime())) return '-';
          return dataObj
            .toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
            .replace(',', ' às');
        }

        function getStatusBadge(status) {
          if (!status) return '';
          const statusStyles = {
            Diagnosticando: 'bg-status-blue-bg text-status-blue-text',
            'Aguardando Cliente':
              'bg-status-amber bg-opacity-20 text-status-amber',
            'Aguardando Peça': 'bg-status-fuchsia-bg text-status-fuchsia-text',
            'Aguardando Retirada': 'bg-status-slate-bg text-status-slate-text',
            Concluído: 'bg-status-green bg-opacity-20 text-status-green',
          };
          const styleClass =
            statusStyles[status] || 'bg-gray-200 text-gray-800';
          return `<span class="px-3 py-1 rounded-full text-xs font-semibold ${styleClass}">${status}</span>`;
        }
        let valor = '-';
        if (os.valor_total != null && !isNaN(parseFloat(os.valor_total))) {
          valor =
            'R$ ' +
            parseFloat(os.valor_total).toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
            });
        }
        const tr = document.createElement('tr');
        tr.className =
          'os-row transition-all duration-200 hover:bg-dark-elevated hover:bg-opacity-30';
        tr.innerHTML = `
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-center">${
                          os.numero_os || '-'
                        }</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-center">${
                          os.cliente
                        }</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-center">${
                          os.item
                        }</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-center">${formatarDataHora(
                          os.data_entrada
                        )}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-center">${formatarDataHora(
                          os.data_atualizacao
                        )}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-center">${getStatusBadge(
                          os.status
                        )}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-center">${valor}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-center">
                            <button class="btn-editar-os text-accent-blue hover:underline" data-id="${
                              os.id
                            }">Editar</button>
                        </td>`;
        osTableBody.appendChild(tr);
      });
    } else {
      osTableBody.innerHTML = `<tr><td colspan="8" class="text-center text-gray-400 py-4">${
        filtro ? 'Nenhuma OS encontrada.' : 'Nenhuma OS cadastrada.'
      }</td></tr>`;
    }
    document.querySelectorAll('.btn-editar-os').forEach((btn) => {
      btn.addEventListener('click', function () {
        abrirModalEditarOS(this.getAttribute('data-id'));
      });
    });
  }

  function carregarChamados() {
    fetch('chamados_select.php')
      .then((res) => res.json())
      .then((data) => {
        todasAsOrdens = Array.isArray(data) ? data : [];
        renderizarChamados();
      })
      .catch(() => {
        const osTableBody = document.getElementById('osTableBody');
        if (osTableBody)
          osTableBody.innerHTML =
            '<tr><td colspan="8" class="text-center text-red-400 py-4">Erro ao carregar OS.</td></tr>';
      });
  }
  carregarChamados();
  const searchOsInput = document.getElementById('searchOsInput');
  if (searchOsInput) {
    searchOsInput.addEventListener('input', (e) => {
      renderizarChamados(e.target.value);
    });
  }

  function abrirModalEditarOS(id) {
    const os = todasAsOrdens.find((c) => String(c.id) === String(id));
    if (!os) {
      showSnackbar('OS não encontrada!', 'error');
      return;
    }
    osEditandoId = os.id;
    document.getElementById('editOsNumber').textContent = os.numero_os
      ? `#${os.numero_os}`
      : '';
    document.getElementById('editOsInput').value = os.numero_os || '';
    document.getElementById('editClientName').value = os.cliente || '';
    document.getElementById('editAttendant').value = os.atendente || '';
    document.getElementById('editPhone').value = os.telefone || '';
    document.getElementById('editItem').value = os.item || '';
    const formatDate = (dateStr) => (dateStr ? dateStr.split(' ')[0] : '');
    document.getElementById('editEntryDate').value = formatDate(
      os.data_entrada
    );
    document.getElementById('editExitDate').value = formatDate(os.data_saida);
    document.getElementById('editDefectSolution').value =
      os.defeito_solucao || '';
    document.getElementById('selectServicoEditar').value = os.servico_id || '';
    document.getElementById('selectStatusEditar').value = os.status || '';
    document.getElementById('valorTotalEditar').value =
      os.valor_total != null
        ? parseFloat(os.valor_total).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
          })
        : '';
    document.getElementById('selectRecebimentoEditar').value =
      os.tipo_recebimento || 'comissao';
    document.getElementById('btnDeletarChamado').setAttribute('data-id', os.id);
    openModal('modalEditOS');
  }
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
      const payload = {
        id: osEditandoId,
        numero_os: document.getElementById('editOsInput').value.trim(),
        cliente: document.getElementById('editClientName').value.trim(),
        atendente: document.getElementById('editAttendant').value.trim(),
        telefone: document.getElementById('editPhone').value.trim(),
        item: document.getElementById('editItem').value.trim(),
        data_entrada: document.getElementById('editEntryDate').value,
        data_saida: document.getElementById('editExitDate').value,
        defeito_solucao: document
          .getElementById('editDefectSolution')
          .value.trim(),
        servico_id: document.getElementById('selectServicoEditar').value,
        tipo_recebimento: document.getElementById('selectRecebimentoEditar')
          .value,
        valor_total: document
          .getElementById('valorTotalEditar')
          .value.replace(/\./g, '')
          .replace(',', '.'),
        status: document.getElementById('selectStatusEditar').value,
      };
      fetch('chamados_update.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            showSnackbar('Ordem de Serviço atualizada com sucesso!', 'success');
            closeAllModals();
            carregarChamados();
          } else {
            showSnackbar(
              'Erro ao atualizar OS: ' + (data.error || 'Erro desconhecido.'),
              'error'
            );
          }
        })
        .catch(() =>
          showSnackbar('Erro de comunicação com o servidor.', 'error')
        );
    });
  }

  function excluirChamado(id) {
    if (
      !confirm(
        'Tem certeza que deseja excluir este chamado? Essa ação não pode ser desfeita.'
      )
    )
      return;
    fetch('chamados_delete.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showSnackbar('Chamado excluído com sucesso!', 'success');
          closeAllModals();
          carregarChamados();
        } else {
          showSnackbar(
            'Erro ao excluir chamado: ' + (data.error || 'Erro desconhecido.'),
            'error'
          );
        }
      })
      .catch(() =>
        showSnackbar('Erro de comunicação com o servidor.', 'error')
      );
  }
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
      const payload = {
        numero_os: document.getElementById('osNumber').value.trim(),
        cliente: document.getElementById('clientName').value.trim(),
        atendente: document.getElementById('attendant').value.trim(),
        telefone: document.getElementById('phone').value.trim(),
        item: document.getElementById('item').value.trim(),
        data_entrada: document.getElementById('entryDate').value,
        data_saida: document.getElementById('exitDate').value,
        defeito_solucao: document.getElementById('defectSolution').value.trim(),
        servico_id: document.getElementById('selectServico').value,
        tipo_recebimento: document.getElementById('selectRecebimento').value,
        valor_total: document
          .getElementById('valorTotal')
          .value.replace(/\./g, '')
          .replace(',', '.'),
        status: document.getElementById('selectStatus').value,
      };
      fetch('chamados_insert.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            showSnackbar('Ordem de Serviço adicionada com sucesso!', 'success');
            closeAllModals();
            carregarChamados();
          } else {
            showSnackbar(
              'Erro ao adicionar OS: ' + (data.error || 'Erro desconhecido.'),
              'error'
            );
          }
        })
        .catch(() =>
          showSnackbar('Erro de comunicação com o servidor.', 'error')
        );
    });
  }

  function showSnackbar(message, type = 'info') {
    let snackbar = document.getElementById('snackbarCustom');
    if (!snackbar) {
      snackbar = document.createElement('div');
      snackbar.id = 'snackbarCustom';
      snackbar.style.cssText =
        'position:fixed; bottom:32px; left:50%; transform:translateX(-50%); min-width:240px; max-width:90vw; padding:16px 32px; border-radius:8px; font-size:1rem; font-weight:bold; z-index:9999; box-shadow:0 2px 16px rgba(0,0,0,0.2); text-align:center; opacity:0; pointer-events:none; transition:opacity 0.3s;';
      document.body.appendChild(snackbar);
    }
    const colors = {
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e42',
      info: '#2196f3',
    };
    snackbar.style.background = colors[type] || colors.info;
    snackbar.style.color = '#fff';
    snackbar.textContent = message;
    snackbar.style.opacity = '1';
    setTimeout(() => {
      snackbar.style.opacity = '0';
    }, 3000);
  }
});

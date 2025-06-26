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
  let availableChartDates = {};

  function setupEventListeners() {
    document
      .getElementById('btnAddOS')
      .addEventListener('click', () => openModal('modalAddOS'));
    document
      .getElementById('btnAddService')
      .addEventListener('click', () => openModal('modalAddService'));
    document.getElementById('btnViewCharts').addEventListener('click', () => {
      openModal('modalCharts');
      carregarDadosGraficoEAtualizar();
    });
    document
      .getElementById('btnManageServices')
      .addEventListener('click', () => {
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
        carregarDadosGraficoEAtualizar();
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
    const selectServico = document.getElementById('selectServico');
    if (selectServico) {
      selectServico.addEventListener('change', atualizarValorTotalOS);
    }
    const selectServicoEditar = document.getElementById('selectServicoEditar');
    if (selectServicoEditar) {
      selectServicoEditar.addEventListener('change', atualizarValorTotalEditOS);
    }
    maskPhone(document.getElementById('phone'));
    maskPhone(document.getElementById('editPhone'));
    const servicePrice = document.getElementById('servicePrice');
    if (servicePrice) {
      maskMoney(servicePrice);
    }
    const btnUpdateCommission = document.getElementById('btnUpdateCommission');
    if (btnUpdateCommission) {
      btnUpdateCommission.addEventListener('click', function () {
        let valor = servicePrice.value.replace(/\./g, '').replace(',', '.');
        valor = parseFloat(valor);
        if (!isNaN(valor)) {
          serviceCommission.value = (valor / 2).toFixed(2).replace('.', ',');
        } else {
          serviceCommission.value = '';
        }
      });
    }
    const btnSalvarServico = document.querySelector(
      '#modalAddService .bg-accent-amber'
    );
    if (btnSalvarServico) {
      btnSalvarServico.addEventListener('click', handleSalvarServico);
    }
    const btnDeletarChamado = document.getElementById('btnDeletarChamado');
    if (btnDeletarChamado) {
      btnDeletarChamado.addEventListener('click', function () {
        const osId = this.getAttribute('data-id');
        if (osId) excluirChamado(osId);
      });
    }
    const searchServicoInput = document.getElementById('searchServico');
    if (searchServicoInput) {
      searchServicoInput.addEventListener('input', (e) =>
        renderizarServicos(e.target.value)
      );
    }
    const btnSalvarEdicaoServico = document.getElementById(
      'btnSalvarEdicaoServico'
    );
    if (btnSalvarEdicaoServico) {
      btnSalvarEdicaoServico.addEventListener(
        'click',
        handleSalvarEdicaoServico
      );
    }
    const btnExcluirServicoDoModal = document.getElementById(
      'btnExcluirServicoDoModal'
    );
    if (btnExcluirServicoDoModal) {
      btnExcluirServicoDoModal.addEventListener('click', () => {
        servicoExcluindoId = servicoEditandoId;
        closeAllModals();
        openModal('modalDeleteService');
      });
    }
    const btnConfirmarExcluirServico = document.getElementById(
      'btnConfirmarExcluirServico'
    );
    if (btnConfirmarExcluirServico) {
      btnConfirmarExcluirServico.addEventListener(
        'click',
        handleConfirmarExcluirServico
      );
    }
    const editServicePrice = document.getElementById('editServicePrice');
    if (editServicePrice) maskMoney(editServicePrice);
    const editServiceCommission = document.getElementById(
      'editServiceCommission'
    );
    if (editServiceCommission) maskMoney(editServiceCommission);
    const btnEditGoal = document.getElementById('btnEditGoal');
    if (btnEditGoal) {
      btnEditGoal.addEventListener('click', handleAbrirModalMeta);
    }
    const btnSalvarMeta = document.getElementById('btnSalvarMeta');
    if (btnSalvarMeta) {
      btnSalvarMeta.addEventListener('click', handleSalvarMeta);
    }
    const chartYearFilter = document.getElementById('chartYearFilter');
    const chartMonthFilter = document.getElementById('chartMonthFilter');
    if (chartYearFilter && chartMonthFilter) {
      chartYearFilter.addEventListener('change', () => {
        popularFiltroMesGrafico(Number(chartYearFilter.value));
        carregarDadosGraficoEAtualizar();
      });
      chartMonthFilter.addEventListener(
        'change',
        carregarDadosGraficoEAtualizar
      );
    }
    const searchOsInput = document.getElementById('searchOsInput');
    if (searchOsInput) {
      searchOsInput.addEventListener('input', (e) =>
        renderizarChamados(e.target.value)
      );
    }
    const btnSalvarEdicaoOS = document.querySelector(
      '#modalEditOS .bg-accent-blue'
    );
    if (btnSalvarEdicaoOS) {
      btnSalvarEdicaoOS.addEventListener('click', handleSalvarEdicaoOS);
    }
    const btnSalvarOS = document.querySelector('#modalAddOS .bg-accent-blue');
    if (btnSalvarOS) {
      btnSalvarOS.addEventListener('click', handleSalvarOS);
    }
  }

  function openModal(modalId) {
    closeAllModals();
    if (modals[modalId]) {
      modals[modalId].classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeAllModals() {
    Object.values(modals).forEach((modal) => {
      if (modal) modal.classList.add('hidden');
    });
    document.body.style.overflow = '';
  }

  function toggleMobileMenu() {
    document.getElementById('mobileActionsMenu').classList.toggle('hidden');
  }

  function closeMobileMenu() {
    document.getElementById('mobileActionsMenu').classList.add('hidden');
  }

  function atualizarValorTotalOS() {
    const select = document.getElementById('selectServico');
    const valorInput = document.getElementById('valorTotal');
    const selectedOption = select.options[select.selectedIndex];
    valorInput.value = selectedOption.dataset.valor
      ? parseFloat(selectedOption.dataset.valor).toFixed(2).replace('.', ',')
      : '';
  }

  function atualizarValorTotalEditOS() {
    const select = document.getElementById('selectServicoEditar');
    const valorInput = document.getElementById('valorTotalEditar');
    const selectedOption = select.options[select.selectedIndex];
    valorInput.value = selectedOption.dataset.valor
      ? parseFloat(selectedOption.dataset.valor).toFixed(2).replace('.', ',')
      : '';
  }

  function maskPhone(input) {
    if (!input) return;
    input.addEventListener('input', function () {
      let v = input.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10)
        v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
      else if (v.length > 6)
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
      else if (v.length > 2) v = v.replace(/^(\d{2})(\d*)/, '($1) $2');
      else if (v.length > 0) v = v.replace(/^(\d*)/, '($1');
      input.value = v;
    });
  }

  function maskMoney(input) {
    if (!input) return;
    input.addEventListener('input', function (e) {
      let v = e.target.value.replace(/\D/g, '');
      v = (v / 100).toFixed(2).replace('.', ',');
      e.target.value = v.replace(/(\d)(?=(\d{3})+(\d{2}))/g, '$1.');
    });
  }

  function validateOSForm(isEdit = false) {
    const errors = [];
    const getElValue = (id) => {
      const el = document.getElementById(isEdit ? `edit${id}` : id);
      return el ? el.value.trim() : '';
    };
    if (!getElValue('ClientName'))
      errors.push('Nome do Cliente é obrigatório.');
    if (!getElValue('Attendant')) errors.push('Atendente é obrigatório.');
    if (!getElValue('Item')) errors.push('Item é obrigatório.');
    if (!getElValue('EntryDate')) errors.push('Data de Entrada é obrigatória.');
    if (!getElValue('DefectSolution'))
      errors.push('Defeito/Solução é obrigatório.');
    return errors;
  }

  function showFormErrors(errors, isEdit = false) {
    const modalId = isEdit ? '#modalEditOS' : '#modalAddOS';
    let errorDiv = document.querySelector(`${modalId} .form-errors`);
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'form-errors mb-2 text-red-400 text-sm';
      document.querySelector(`${modalId} .modal-content`).prepend(errorDiv);
    }
    errorDiv.innerHTML = errors.map((e) => `<div>• ${e}</div>`).join('');
  }

  function clearFormErrors(isEdit = false) {
    const modalId = isEdit ? '#modalEditOS' : '#modalAddOS';
    const errorDiv = document.querySelector(`${modalId} .form-errors`);
    if (errorDiv) errorDiv.innerHTML = '';
  }

  function validateServiceForm() {
    const errors = [];
    if (!document.getElementById('serviceName').value.trim())
      errors.push('Nome do Serviço é obrigatório.');
    const preco = document.getElementById('servicePrice').value.trim();
    if (!preco || isNaN(parseFloat(preco.replace(/\./g, '').replace(',', '.'))))
      errors.push('Preço Total é obrigatório e deve ser um valor válido.');
    return errors;
  }

  function showServiceFormErrors(errors) {
    let errorDiv = document.querySelector('#modalAddService .form-errors');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'form-errors mb-2 text-red-400 text-sm';
      document.querySelector('#modalAddService .p-6').prepend(errorDiv);
    }
    errorDiv.innerHTML = errors.map((e) => `<div>• ${e}</div>`).join('');
  }

  function fillSelectOptions() {
    fetch('servicos_select.php')
      .then((res) => res.json())
      .then((servicos) => {
        if (!Array.isArray(servicos)) return;
        todosOsServicos = servicos;
        servicos.sort((a, b) => a.nome.localeCompare(b.nome));
        ['selectServico', 'selectServicoEditar'].forEach((selectId) => {
          const select = document.getElementById(selectId);
          if (select) {
            select.innerHTML = '<option value="">Selecione um serviço</option>';
            servicos.forEach((s) => {
              const o = new Option(s.nome, s.id);
              o.dataset.valor = s.valor;
              select.add(o);
            });
          }
        });
      });
    const statusList = [
      'Diagnosticando',
      'Aguardando Cliente',
      'Aguardando Peça',
      'Aguardando Retirada',
      'Concluído',
    ];
    ['selectStatus', 'selectStatusEditar'].forEach((selectId) => {
      const select = document.getElementById(selectId);
      if (select) {
        select.innerHTML = '';
        statusList.forEach((s) => select.add(new Option(s, s)));
      }
    });
  }

  function popularFiltrosGrafico() {
    availableChartDates = {};
    todasAsOrdens
      .filter(
        (os) =>
          os.status === 'Concluído' && (os.data_saida || os.data_atualizacao)
      )
      .forEach((os) => {
        const dataFim = new Date(os.data_saida || os.data_atualizacao);
        if (!isNaN(dataFim.getTime())) {
          const ano = dataFim.getFullYear();
          const mes = dataFim.getMonth() + 1;
          if (!availableChartDates[ano]) {
            availableChartDates[ano] = new Set();
          }
          availableChartDates[ano].add(mes);
        }
      });
    const yearFilter = document.getElementById('chartYearFilter');
    if (!yearFilter) return;
    const anos = Object.keys(availableChartDates).sort((a, b) => b - a);
    yearFilter.innerHTML = '';
    if (anos.length === 0) {
      const anoAtual = new Date().getFullYear();
      yearFilter.add(new Option(anoAtual, anoAtual));
    } else {
      anos.forEach((ano) => yearFilter.add(new Option(ano, ano)));
    }
    popularFiltroMesGrafico(Number(yearFilter.value));
  }

  function popularFiltroMesGrafico(ano) {
    const monthFilter = document.getElementById('chartMonthFilter');
    if (!monthFilter) return;
    const mesesDisponiveis = availableChartDates[ano]
      ? [...availableChartDates[ano]].sort((a, b) => a - b)
      : [];
    const nomesMeses = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    monthFilter.innerHTML = '';
    if (mesesDisponiveis.length > 0) {
      mesesDisponiveis.forEach((mes) => {
        monthFilter.add(new Option(nomesMeses[mes - 1], mes));
      });
      const mesAtual = new Date().getMonth() + 1;
      if (mesesDisponiveis.includes(mesAtual)) {
        monthFilter.value = mesAtual;
      }
    } else {
      monthFilter.add(new Option('Nenhum registro', ''));
    }
  }
  async function carregarDadosGraficoEAtualizar() {
    const yearFilter = document.getElementById('chartYearFilter');
    const monthFilter = document.getElementById('chartMonthFilter');
    const chartContent = document.getElementById('chartContent');
    const totalPeriodo = document.getElementById('chartTotalPeriodo');
    const metaDisplay = document.getElementById('chartMetaDisplay');
    if (
      !yearFilter ||
      !monthFilter ||
      !chartContent ||
      !totalPeriodo ||
      !metaDisplay
    )
      return;
    if (!yearFilter.value || !monthFilter.value) {
      chartContent.innerHTML =
        '<p class="text-gray-400 m-auto">Nenhum dado de lucro para o período selecionado.</p>';
      totalPeriodo.textContent = 'R$ 0,00';
      metaDisplay.textContent = '';
      return;
    }
    const ano = Number(yearFilter.value);
    const mes = Number(monthFilter.value);
    try {
      const [metaObj] = await Promise.all([buscarMeta(ano, mes)]);
      const servicosMap = new Map(
        (todosOsServicos || []).map((s) => [s.id, s])
      );
      const lucrosPorServico = {};
      todasAsOrdens
        .filter((os) => {
          const dataFim = new Date(os.data_saida || os.data_atualizacao);
          return (
            os.status === 'Concluído' &&
            !isNaN(dataFim.getTime()) &&
            dataFim.getFullYear() === ano &&
            dataFim.getMonth() + 1 === mes
          );
        })
        .forEach((os) => {
          const servico = servicosMap.get(os.servico_id);
          const servicoNome = servico ? servico.nome : 'Serviço Avulso';
          const comissao = servico
            ? servico.comissao
            : (parseFloat(os.valor_total) || 0) / 2;
          const lucro =
            os.tipo_recebimento === 'integral'
              ? parseFloat(os.valor_total) || 0
              : parseFloat(comissao) || 0;
          lucrosPorServico[servicoNome] =
            (lucrosPorServico[servicoNome] || 0) + lucro;
        });
      if (metaObj && metaObj.valor > 0) {
        metaDisplay.innerHTML = `Meta do Mês: <span class="font-semibold text-accent-amber">R$ ${parseFloat(
          metaObj.valor
        ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>`;
      } else {
        metaDisplay.innerHTML = ``;
      }
      if (Object.keys(lucrosPorServico).length > 0) {
        renderizarGraficoPizza(lucrosPorServico);
      } else {
        chartContent.innerHTML =
          '<p class="text-gray-400 m-auto">Nenhum dado de lucro para o período selecionado.</p>';
        totalPeriodo.textContent = 'R$ 0,00';
      }
    } catch (error) {
      showSnackbar('Erro ao carregar dados do gráfico.', 'error');
    }
  }

  function renderizarGraficoPizza(dados) {
    const chartContent = document.getElementById('chartContent');
    chartContent.innerHTML = `<div id="pieChartContainer" class="w-64 h-64 rounded-full flex-shrink-0"></div>
                              <div id="pieChartLegend" class="flex flex-col gap-2 self-center md:self-start"></div>`;
    const pieContainer = document.getElementById('pieChartContainer');
    const legendContainer = document.getElementById('pieChartLegend');
    const totalLucro = Object.values(dados).reduce(
      (sum, value) => sum + value,
      0
    );
    document.getElementById(
      'chartTotalPeriodo'
    ).textContent = `R$ ${totalLucro.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
    })}`;
    if (totalLucro === 0) {
      chartContent.innerHTML =
        '<p class="text-gray-400 m-auto">Nenhum lucro registrado para este mês.</p>';
      return;
    }
    const colors = [
      '#A3D5FF',
      '#FFB84C',
      '#4CAF50',
      '#F44336',
      '#9c27b0',
      '#3f51b5',
      '#00bcd4',
      '#ff9800',
    ];
    let accumulatedPercent = 0;
    const gradientParts = Object.entries(dados).map(([label, value], index) => {
      const percent = (value / totalLucro) * 100;
      const color = colors[index % colors.length];
      const startAngle = accumulatedPercent;
      accumulatedPercent += percent;
      const endAngle = accumulatedPercent;
      const legendItem = document.createElement('div');
      legendItem.className = 'flex items-center gap-3 text-sm';
      legendItem.innerHTML = `<div class="w-4 h-4 rounded" style="background-color: ${color}"></div>
                                <div>
                                    <span class="font-semibold">${label}</span>
                                    <span class="text-gray-400 ml-2">${percent.toFixed(
                                      1
                                    )}%</span>
                                    <div class="text-xs text-gray-300">R$ ${value.toLocaleString(
                                      'pt-BR',
                                      { minimumFractionDigits: 2 }
                                    )}</div>
                                </div>`;
      legendContainer.appendChild(legendItem);
      return `${color} ${startAngle}% ${endAngle}%`;
    });
    pieContainer.style.background = `conic-gradient(${gradientParts.join(
      ', '
    )})`;
  }
  async function buscarMeta(ano, mes) {
    try {
      const res = await fetch(`meta_select.php?ano=${ano}&mes=${mes}`);
      if (!res.ok) return null;
      const metas = await res.json();
      return Array.isArray(metas)
        ? metas.find(
            (m) =>
              Number(m.ano) === Number(ano) && Number(m.mes) === Number(mes)
          )
        : null;
    } catch (error) {
      return null;
    }
  }

  function inserirOuAtualizarMeta(ano, mes, valor) {
    return buscarMeta(ano, mes).then((meta) => {
      const formData = new FormData();
      formData.append('valor', valor);
      let url = 'meta_insert.php';
      if (meta && meta.id) {
        formData.append('id', meta.id);
        url = 'meta_update.php';
      } else {
        formData.append('ano', ano);
        formData.append('mes', mes);
      }
      return fetch(url, {
        method: 'POST',
        body: formData,
      }).then((res) => res.json());
    });
  }

  function handleAbrirModalMeta() {
    openModal('modalEditGoal');
    fillMetaAnoSelect();
    const mesAtual = new Date().getMonth() + 1;
    const selectMes = document.getElementById('inputMetaMes');
    const selectAno = document.getElementById('inputMetaAno');
    if (selectMes) selectMes.value = mesAtual;
    const inputMetaMensal = document.getElementById('inputMetaMensal');
    const carregarMeta = async (ano, mes) => {
      const meta = await buscarMeta(ano, mes);
      inputMetaMensal.value = meta
        ? parseFloat(meta.valor).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
          })
        : '';
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
  }

  function fillMetaAnoSelect() {
    const selectAno = document.getElementById('inputMetaAno');
    if (!selectAno) return;
    selectAno.innerHTML = '';
    const anoAtual = new Date().getFullYear();
    for (let i = anoAtual - 2; i <= anoAtual + 2; i++) {
      selectAno.add(new Option(i, i));
    }
    selectAno.value = anoAtual;
  }
  const btnEditGoal = document.getElementById('btnEditGoal');
  if (btnEditGoal) {
    btnEditGoal.addEventListener('click', handleAbrirModalMeta);
  }

  function handleSalvarMeta() {
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
        carregarDadosGraficoEAtualizar();
      } else {
        showSnackbar(
          'Erro ao salvar meta: ' + (res.error || 'Erro desconhecido.'),
          'error'
        );
      }
    });
  }
  const btnSalvarMeta = document.getElementById('btnSalvarMeta');
  if (btnSalvarMeta) {
    btnSalvarMeta.addEventListener('click', handleSalvarMeta);
  }

  function handleSalvarServico(e) {
    const serviceNameEl = document.getElementById('serviceName');
    const servicePriceEl = document.getElementById('servicePrice');
    const serviceCommissionEl = document.getElementById('serviceCommission');
    e.preventDefault();
    clearFormErrors(false, 'serviceFormErrors');
    const errors = validateServiceForm();
    if (errors.length) {
      showServiceFormErrors(errors);
      return;
    }
    const formData = new FormData();
    formData.append('nome', serviceNameEl.value.trim());
    formData.append(
      'valor',
      servicePriceEl.value.replace(/\./g, '').replace(',', '.')
    );
    formData.append(
      'comissao',
      serviceCommissionEl.value.replace(/\./g, '').replace(',', '.')
    );
    fetch('servicos_insert.php', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showSnackbar('Serviço adicionado com sucesso!', 'success');
          closeAllModals();
          [serviceNameEl, servicePriceEl, serviceCommissionEl].forEach(
            (el) => (el.value = '')
          );
          carregarServicos();
          fillSelectOptions();
        } else {
          showSnackbar(`Erro: ${data.error || 'Erro desconhecido.'}`, 'error');
        }
      })
      .catch(() => showSnackbar('Erro de comunicação.', 'error'));
  }

  function handleSalvarEdicaoServico() {
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
          showSnackbar('Serviço atualizado!', 'success');
          closeAllModals();
          carregarServicos();
          fillSelectOptions();
        } else {
          showSnackbar(`Erro: ${data.error || 'Erro desconhecido.'}`, 'error');
        }
      })
      .catch(() => showSnackbar('Erro de comunicação.', 'error'));
  }

  function handleConfirmarExcluirServico() {
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
          showSnackbar('Serviço excluído!', 'success');
          closeAllModals();
          carregarServicos();
          fillSelectOptions();
        } else {
          showSnackbar(`Erro: ${data.error || 'Erro desconhecido.'}`, 'error');
        }
      })
      .catch(() => showSnackbar('Erro de comunicação.', 'error'));
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
        const tr = document.createElement('tr');
        tr.className =
          'os-row transition-all duration-200 hover:bg-dark-elevated hover:bg-opacity-30';
        const formatarDataHora = (dataStr) => {
          if (!dataStr) return '-';
          const dataObj = new Date(dataStr);
          return isNaN(dataObj.getTime())
            ? '-'
            : dataObj
                .toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
                .replace(',', ' às');
        };
        const getStatusBadge = (status) => {
          const statusStyles = {
            Diagnosticando: 'bg-status-blue-bg text-status-blue-text',
            'Aguardando Cliente':
              'bg-status-amber bg-opacity-20 text-status-amber',
            'Aguardando Peça': 'bg-status-fuchsia-bg text-status-fuchsia-text',
            'Aguardando Retirada': 'bg-status-slate-bg text-status-slate-text',
            Concluído: 'bg-status-green bg-opacity-20 text-status-green',
          };
          return `<span class="px-3 py-1 rounded-full text-xs font-semibold ${
            statusStyles[status] || 'bg-gray-200 text-gray-800'
          }">${status || ''}</span>`;
        };
        const valor =
          os.valor_total != null && !isNaN(parseFloat(os.valor_total))
            ? 'R$ ' +
              parseFloat(os.valor_total).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })
            : '-';
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
  async function carregarDadosIniciais() {
    try {
      const [chamadosData, servicosData] = await Promise.all([
        fetch('chamados_select.php').then((res) => res.json()),
        fetch('servicos_select.php').then((res) => res.json()),
      ]);
      todasAsOrdens = Array.isArray(chamadosData) ? chamadosData : [];
      todosOsServicos = Array.isArray(servicosData) ? servicosData : [];
      renderizarChamados();
      fillSelectOptions();
      popularFiltrosGrafico();
    } catch (error) {
      showSnackbar('Erro ao carregar dados iniciais.', 'error');
    }
  }

  function abrirModalEditarOS(id) {
    const os = todasAsOrdens.find((c) => String(c.id) === String(id));
    if (!os) return showSnackbar('OS não encontrada!', 'error');
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

  function handleSalvarEdicaoOS(e) {
    e.preventDefault();
    clearFormErrors(true);
    const errors = validateOSForm(true);
    if (errors.length) {
      showFormErrors(errors, true);
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
          showSnackbar('Ordem de Serviço atualizada!', 'success');
          closeAllModals();
          carregarDadosIniciais();
        } else {
          showSnackbar(`Erro: ${data.error || 'Erro desconhecido.'}`, 'error');
        }
      })
      .catch(() => showSnackbar('Erro de comunicação.', 'error'));
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
          showSnackbar('Chamado excluído!', 'success');
          closeAllModals();
          carregarDadosIniciais();
        } else {
          showSnackbar(`Erro: ${data.error || 'Erro desconhecido.'}`, 'error');
        }
      })
      .catch(() => showSnackbar('Erro de comunicação.', 'error'));
  }

  function handleSalvarOS(e) {
    e.preventDefault();
    clearFormErrors();
    const errors = validateOSForm();
    if (errors.length) {
      showFormErrors(errors);
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
          showSnackbar('Ordem de Serviço adicionada!', 'success');
          closeAllModals();
          carregarDadosIniciais();
        } else {
          showSnackbar(`Erro: ${data.error || 'Erro desconhecido.'}`, 'error');
        }
      })
      .catch(() => showSnackbar('Erro de comunicação.', 'error'));
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
  setupEventListeners();
  carregarDadosIniciais();
});

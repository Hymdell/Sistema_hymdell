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
});

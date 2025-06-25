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
});

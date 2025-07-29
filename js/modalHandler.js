function showModal(modalId) {
  const overlay = document.getElementById('modal-overlay');
  const container = document.getElementById('active-modal');
  const template = document.getElementById(`${modalId}-template`);

  if (template && template.content) {
    container.innerHTML = '';
    container.appendChild(template.content.cloneNode(true));
    overlay.classList.remove('hidden');
  }
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

const helpButton = document.getElementById("help-button")
const statsButton = document.getElementById("stats-button")
const accountButton = document.getElementById("account-button")
const settingsButton = document.getElementById("settings-button")

helpButton.addEventListener('click', () => showModal('help-modal'));
settingsButton.addEventListener('click', () => showModal('settings-modal'));
statsButton.addEventListener('click', () => showModal('stats-modal'));
accountButton.addEventListener('click', () => showModal('account-modal'));
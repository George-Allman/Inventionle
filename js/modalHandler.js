function showModal(modalId) {
  const overlay = document.getElementById('modal-overlay');
  const container = document.getElementById('active-modal');
  const template = document.getElementById(`${modalId}-template`);

  if (template && template.content) {
    container.innerHTML = '';
    container.appendChild(template.content.cloneNode(true));
    overlay.classList.remove('hidden');

    const event = new CustomEvent('modalOpened', { detail: { modalId } });
    document.dispatchEvent(event);

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        closeModal(); // Your existing function to hide modal/overlay
      }
    })

    if (modalId === "settings-modal") {
      const toggle = container.querySelector("#light-theme-toggle");

      if (toggle) {
        // Set initial checkbox based on current theme
        toggle.checked = document.body.classList.contains("light-theme");

        // Toggle theme on change
        toggle.addEventListener("change", () => {
          document.body.classList.toggle("light-theme", toggle.checked);
          if (toggle.checked) {
            document.getElementById("settings-button").style.filter = "invert(1)"
            document.getElementById("stats-button").style.filter = "invert(1)"
            document.getElementById("account-button").style.filter = "invert(1)"
            document.getElementById("help-button").style.filter = "invert(1)"
          }
          else {
            document.getElementById("settings-button").style.filter = "invert(0)"
            document.getElementById("stats-button").style.filter = "invert(0)"
            document.getElementById("account-button").style.filter = "invert(0)"
            document.getElementById("help-button").style.filter = "invert(0)"
          }

        });
      }
    }

    if (modalId === "stats-modal") {
      const played = document.getElementById("played-stat");
      const win = document.getElementById("win-stat");
      //const streak = document.getElementById("streak-stat");

      let nPlayed = localStorage.length;
      let winCount = 0;
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Matches YYYY-MM-DD

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);

        try {
          const entry = JSON.parse(value);
          if (entry) {
            if (entry.win) {
              winCount++
            }
          }
        } catch (e) {
          // ignore invalid JSON
        }
      }

      // ✅ Handle divide by zero
      const winPct = Math.round((winCount / nPlayed) * 100)

      win.textContent = winPct;
      played.textContent = nPlayed;
      //streak.textContent = localStorage.getItem("currentStreak") || 0;
    }
  }
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

const helpButton = document.getElementById("help-button");
const statsButton = document.getElementById("stats-button");
//const accountButton = document.getElementById("account-button");
const settingsButton = document.getElementById("settings-button");

helpButton.addEventListener('click', () => showModal('help-modal'));
settingsButton.addEventListener('click', () => showModal('settings-modal'));
statsButton.addEventListener('click', () => showModal('stats-modal'));
//accountButton.addEventListener('click', () => showModal('account-modal'));
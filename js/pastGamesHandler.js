const pastGamesBtn = document.getElementById("sidebar-header")
const sidebarBody = document.getElementById("sidebar-body");

function loadPastGame(date) {
    console.log(date);
}



async function loadInventions() {
    try {
        const response = await fetch('dailyAnswers.json');
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const data = await response.json();

        const ul = document.getElementById('game-list');  // get the <ul> element

        const numberOfEntries = Object.keys(data).length;

        Object.entries(data).forEach(([date, entry]) => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.className = "past-game-btn"
            btn.textContent = `${date}: ${entry.invention}`;
            btn.addEventListener('click', () => {loadPastGame(date)})
            li.append(btn)
            ul.appendChild(li);
        });

        } catch (err) {
            console.error('Error loading JSON:', err);
        }
    }


pastGamesBtn.addEventListener('click', () => {
        sidebarBody.classList.toggle('active')
    });

    window.addEventListener('DOMContentLoaded', loadInventions);

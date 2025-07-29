function getTodayDateKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // 0-based
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function loadTodayInvention() {
  const dateKey = getTodayDateKey();

  try {
    const response = await fetch('dailyAnswers.json');
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

    const data = await response.json();

    if (data[dateKey]) {
      const todayData = data[dateKey];
      document.getElementById("prompt").textContent = todayData.invention;
    } else {
      console.warn("No data found for today's date in JSON.");
    }

  } catch (err) {
    console.error('Error loading JSON:', err);
  }
}

// Run on page load
window.addEventListener('DOMContentLoaded', loadTodayInvention);
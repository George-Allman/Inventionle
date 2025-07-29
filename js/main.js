let todayData;
let resultMap; // Declare globally

window.addEventListener("DOMContentLoaded", () => {
  const mainMap = initMap('map');
  resultMap = initMap('result-map'); // Save resultMap reference
  setupGuessLogic();
});

function launchConfetti() {
  confetti({
    particleCount: 500,
    spread: 160,
    origin: { y: 0.6 }
  });
}



function guessMade(yearGuess, locationGuess, personGuess) {
  const distance = Math.round(locationGuess.distanceTo(todayData.location) / 1000); // in km

  //#region Map Logic

  // Clear old layers if needed
  resultMap.eachLayer((layer) => {
    if (layer instanceof L.Marker || layer instanceof L.Polyline) {
      resultMap.removeLayer(layer);
    }
  });

  // Markers
  const correctMarker = L.marker(todayData.location, {
    icon: L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })
  }).addTo(resultMap).bindPopup("Correct Location");

  const guessMarker = L.marker(locationGuess, {
    icon: L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })
  }).addTo(resultMap).bindPopup("Your Guess");

  // Draw line
  const line = L.polyline([locationGuess, todayData.location], {
    color: 'orange',
    dashArray: '5, 10'
  }).addTo(resultMap);

  // Distance label (at midpoint)
  const midLat = (locationGuess.lat + todayData.location.lat) * 0.8;
  const midLng = (locationGuess.lng + todayData.location.lng) * 0.8;

  const distanceLabel = L.divIcon({
    className: 'distance-label',
    html: `<div style="font-size:15px; color:black;">${distance} km</div>`,
    iconAnchor: [0, 0]
  });

  L.marker([midLat, midLng], { icon: distanceLabel }).addTo(resultMap);

  // Fit to bounds
  const bounds = L.latLngBounds([locationGuess, todayData.location]);
  resultMap.fitBounds(bounds, { animate: true, duration: 4 });

  setTimeout(() => resultMap.invalidateSize(), 200);

  //#endregion

  //Calculation
  const distanceWeighting = 0.3
  const distanceThreshold = 15
  var distanceScore = 0
  if (distance < distanceThreshold) {
    distanceScore = 2000
  }
  else {
    distanceScore = Math.max((2000 - distance * distanceWeighting), 0)
  }

  const yearWeighting = 20

  var yearDifference = Math.abs(yearGuess - todayData.year)

  var yearScore = Math.max((2000 - yearDifference * yearWeighting), 0)


  //#region Name Checking

  function normalize(str) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
  }

  function levenshtein(a, b) {
    const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
        else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[a.length][b.length];
  }

  function similar(a, b, tolerance = 0.2) {
    a = normalize(a);
    b = normalize(b);
    const maxLen = Math.max(a.length, b.length);
    const dist = levenshtein(a, b);
    return dist <= Math.floor(maxLen * tolerance);
  }

  function getNameScore(correctName, userInput) {
    if (!correctName || !userInput) return 0;

    const correctParts = correctName.trim().split(/\s+/);
    const inputParts = userInput.trim().split(/\s+/);

    const correctFirst = correctParts[0];
    const correctLast = correctParts[correctParts.length - 1];

    const inputFirst = inputParts[0];
    const inputLast = inputParts[inputParts.length - 1];

    const fullMatch = similar(normalize(correctName), normalize(userInput));
    const lastMatch = similar(normalize(correctLast), normalize(inputLast));
    const firstMatch = similar(normalize(correctFirst), normalize(inputFirst));

    if (fullMatch) {
      return 1000;
    }
    else if (lastMatch) {
      return 750
    }
    else if (firstMatch) {
      return 500;
    } else {
      return 0;
    }
  }

  //#endregion

  console.log("Hello");


  personScore = getNameScore(todayData.inventor, personGuess)

  score = yearScore + distanceScore + personScore

  score = Math.round(score)

  if (score > 3600) {
    launchConfetti()
  }
  else {
    document.getElementById("score-bar").classList.add("shake");
    document.getElementById("result-map").classList.add("shake")

    setTimeout(() => {
      document.getElementById("score-bar").classList.remove("shake");
      document.getElementById("result-map").classList.remove("shake")
    }, 500);
  }

  //document.getElementById("score-bar").textContent = String(score)

  const yearAnswerlblB = document.getElementById("year-answerB")
  const nameAnswerlblB = document.getElementById("person-answerB")
  const locationAnswerlblB = document.getElementById("location-answerB")

  const yearAnswerlblS = document.getElementById("year-answerS")
  const nameAnswerlblS = document.getElementById("person-answerS")
  const locationAnswerlblS = document.getElementById("location-answerS")

  yearAnswerlblB.textContent = String(todayData.year)
  yearAnswerlblS.textContent = 'Your answer: ' + yearGuess

  nameAnswerlblB.textContent = todayData.inventor
  nameAnswerlblS.textContent = 'Your answer: ' + personGuess

  locationAnswerlblB.textContent = todayData.locationName
  locationAnswerlblS.textContent = 'Your answer was ' + distance + 'kms away'

  const yearBar = document.getElementById("year-bar")

  const personBar = document.getElementById("name-bar")

  const locationBar = document.getElementById("location-bar")

  locationAmount = Math.round(distanceScore / 20)

  yearAmount = Math.round(yearScore / 20)

  function animateNumber(id, endValue, duration = 1000) {
    const el = document.getElementById(id);
    const startValue = 0;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
      el.textContent = "Score: " + currentValue;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  animateNumber("score-bar", score, 5200)

  setTimeout(() => {
    locationBar.style.width = String(locationAmount) + '%'
    personBar.style.width = String(personScore / 10) + '%'
    yearBar.style.width = String(yearAmount) + '%'
  }, 100)

}


function setupGuessLogic() {
  const guessButton = document.getElementById("guess-btn");
  const nameInput = document.getElementById("name-input");
  const yearInput = document.getElementById("yearDisplay");

  function updateGuessButtonState() {
    const nameValid = nameInput.value.trim() !== '';
    const yearValid = yearInput.value.trim() !== '';
    const markerPlaced = hasGuessBeenPlaced();

    if (markerPlaced && nameValid && yearValid) {
      guessButton.disabled = false;
      guessButton.classList.remove("disabled");
    } else {
      guessButton.disabled = true;
      guessButton.classList.add("disabled");
    }
  }

  nameInput.addEventListener("input", updateGuessButtonState);
  yearInput.addEventListener("input", updateGuessButtonState);
  setOnGuessPlacedCallback(updateGuessButtonState);

  guessButton.addEventListener("click", () => {
    const locationGuess = getMarkerLatLng();
    const yearGuess = yearInput.value.trim();
    const nameGuess = nameInput.value.trim();

    document.getElementById("results").style.display = "flex";
    document.getElementById("main").style.display = "none";

    guessMade(yearGuess, locationGuess, nameGuess);
  });

  updateGuessButtonState(); // Run initially
}

function getTodayDateKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
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
      todayData = data[dateKey];
      document.getElementById("prompt").textContent = todayData.invention;
    } else {
      console.warn("No data found for today's date in JSON.");
    }
  } catch (err) {
    console.error('Error loading JSON:', err);
  }
}


window.addEventListener('DOMContentLoaded', loadTodayInvention);

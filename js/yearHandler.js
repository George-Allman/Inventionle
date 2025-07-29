const yearDisplay = document.getElementById('yearDisplay');
const MIN_YEAR = -9999;
const MAX_YEAR = 2025;

// Utility: test if a string is valid year format and within range
function isValidYearString(str) {
  if (str === '') return true; // allow empty during typing
  if (!/^[-]?\d{0,4}$/.test(str)) return false; // invalid format

  // Parse number ignoring empty string or lone '-'
  const num = parseInt(str, 10);
  if (isNaN(num)) return false;

  return num >= MIN_YEAR && num <= MAX_YEAR;
}

// On beforeinput, prevent invalid input early
yearDisplay.addEventListener('beforeinput', (e) => {
  const inputType = e.inputType;
  const currentValue = yearDisplay.value;
  const selectionStart = yearDisplay.selectionStart;
  const selectionEnd = yearDisplay.selectionEnd;
  const insertedText = e.data || '';

  // Compute what the new value would be after this input
  let newValue;

  if (inputType === 'deleteContentBackward') {
    // simulate deletion
    if (selectionStart === selectionEnd) {
      // delete one char before caret
      newValue = currentValue.slice(0, selectionStart - 1) + currentValue.slice(selectionEnd);
    } else {
      // delete selection
      newValue = currentValue.slice(0, selectionStart) + currentValue.slice(selectionEnd);
    }
  } else if (inputType === 'deleteContentForward') {
    // delete one char after caret or selection
    if (selectionStart === selectionEnd) {
      newValue = currentValue.slice(0, selectionStart) + currentValue.slice(selectionEnd + 1);
    } else {
      newValue = currentValue.slice(0, selectionStart) + currentValue.slice(selectionEnd);
    }
  } else if (inputType === 'insertText' || inputType === 'insertCompositionText') {
    // Insert typed character(s)
    newValue = currentValue.slice(0, selectionStart) + insertedText + currentValue.slice(selectionEnd);
  } else {
    // Other input types allow
    return;
  }

  if (!isValidYearString(newValue)) {
    e.preventDefault();
  }
});

// The rest is same: sanitize on input (just in case) and clamp on buttons

yearDisplay.addEventListener('input', () => {
  let val = yearDisplay.value;
  if (val === '') return;

  // Remove invalid characters but keep format
  if (!/^[-]?\d{0,4}$/.test(val)) {
    let sanitized = '';

    if (val.startsWith('-')) {
      sanitized = '-';
      val = val.slice(1);
    }

    val = val.replace(/\D/g, '').slice(0, 4);
    sanitized += val;
    yearDisplay.value = sanitized;
  }

  // Clamp to min/max after manual input
  const numericVal = parseInt(yearDisplay.value, 10);
  if (!isNaN(numericVal)) {
    if (numericVal > MAX_YEAR) yearDisplay.value = MAX_YEAR.toString();
    if (numericVal < MIN_YEAR) yearDisplay.value = MIN_YEAR.toString();
  }
});

// Button handlers unchanged...

// Get button elements (example, adjust if needed)
const btnYearPlus1 = document.getElementById('yearPlus1');
const btnYearPlus10 = document.getElementById('yearPlus10');
const btnYearMinus1 = document.getElementById('yearMinus1');
const btnYearMinus10 = document.getElementById('yearMinus10');

function updateYear(delta) {
  let currentYear = parseInt(yearDisplay.value, 10);
  if (isNaN(currentYear)) currentYear = 0;
  let newYear = currentYear + delta;

  if (newYear > MAX_YEAR) newYear = MAX_YEAR;
  if (newYear < MIN_YEAR) newYear = MIN_YEAR;

  yearDisplay.value = newYear.toString();
}

function handleYearButtonClick(event) {
  switch (event.target.id) {
    case 'yearPlus1':
      updateYear(1);
      break;
    case 'yearPlus10':
      updateYear(10);
      break;
    case 'yearMinus1':
      updateYear(-1);
      break;
    case 'yearMinus10':
      updateYear(-10);
      break;
  }
}

btnYearPlus1.addEventListener('click', handleYearButtonClick);
btnYearPlus10.addEventListener('click', handleYearButtonClick);
btnYearMinus1.addEventListener('click', handleYearButtonClick);
btnYearMinus10.addEventListener('click', handleYearButtonClick);
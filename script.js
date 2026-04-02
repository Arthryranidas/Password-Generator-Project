const inputElement = document.querySelector('.input');
const copyBtn = document.querySelector('.copy-btn');
const rangeElement = document.querySelector('.range');
const passwordLengthNum = document.querySelector('.password-length-num');
const lowercaseCheckbox = document.getElementById('lowercase');
const uppercaseCheckbox = document.getElementById('uppercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');
const generateBtn = document.querySelector('.generate-btn');
const passwordLevel = document.querySelector('.password-level');
const strengthBar = document.querySelector('.strength-bar');

//character sets
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numberCharacters = "0123456789";
const symbolCharacters = "[!@#$%^&*()-_=+[\]{}|;:,.<>?/]";

rangeElement.addEventListener('input',() => {
  passwordLengthNum.textContent = rangeElement.value;
});

generateBtn.addEventListener('click', makePassword);

function makePassword() {
  const length = Number(rangeElement.value);
  // Store checkbox + character set pairs as array of objects
  const options = [
    {checked: lowercaseCheckbox.checked,chars: lowercaseLetters},
    {checked: uppercaseCheckbox.checked,chars: uppercaseLetters},
    
    {checked: numbersCheckbox.checked, chars: numberCharacters},
    {checked: symbolsCheckbox.checked, chars: symbolCharacters}
  ];

  //check if at least one option is selected
  const anySelected = options.some(
    option => option.checked);

  // if none of them are selected(checked)-
  if (!anySelected) {
    alert("Please select at least one character.");
    return;
  }
  
  const newPassword = createRandomPassword(length, options);

  inputElement.value = newPassword;

  updateStrengthMeter(newPassword);
 }

function updateStrengthMeter(password) {
   if (!password) {
    resetStrengthMeter();
    return;
  }

  const MIN_LENGTH = 8;
  const MAX_LENGTH_SCORE = 40;
  const CHAR_TYPE_SCORE = 15;
  const MAX_SCORE = 100;

  // Character checks
  const checks = [
    /[A-Z]/.test(password),        // uppercase
    /[a-z]/.test(password),        // lowercase
    /[0-9]/.test(password),        // numbers
    /[!@#$%^&*()\-_=+\[\]{}|;:,.<>?/]/.test(password) // symbols
  ];

  let strengthScore = Math.min(password.length * 2, MAX_LENGTH_SCORE);

  
  strengthScore += checks.filter(Boolean).length * CHAR_TYPE_SCORE;

  // Enforce max score for short passwords
  if (password.length < MIN_LENGTH) {
    strengthScore = Math.min(strengthScore, MAX_LENGTH_SCORE);  
  }

  const safeScore = Math.max(5, Math.min(MAX_SCORE, strengthScore));
  strengthBar.style.width = `${safeScore}%`;


  let strength = {
    label: "Weak",
    color: "red"
  }; 

  if (safeScore >= 70) {
    strength = { label: "Strong", color: "green" };
  } else if (safeScore >= 40) {
    strength = { label: "Medium", color: "yellow" };
  }

  strengthBar.style.backgroundColor = strength.color;
  passwordLevel.textContent = strength.label;
}

// OPTIONAL HELPER (CLEAN RESET)
function resetStrengthMeter() {
  strengthBar.style.width = "0%";
  strengthBar.style.backgroundColor = 'transparent';
  passwordLevel.textContent  = '';
}

function createRandomPassword(length, options) {
  let allCharacters = '';

  options.forEach(option => {
    if (option.checked) {
      allCharacters += option.chars;
    }
  });

  console.log('all chars-',allCharacters);

  let password = '';
  for (let i=0; i < length ; i++) {
    const randomIndex= Math.floor(Math.random() * allCharacters.length);

    password += allCharacters[randomIndex];
  }
  return password;
}

copyBtn.addEventListener('click',() => {
  if (!inputElement.value) return;

  navigator.clipboard.writeText(inputElement.value) 
  .then(() => showCopySuccess())
  .catch((error) => console.log('could noy copy:', error) );
});

function showCopySuccess() {
  const icon = copyBtn.querySelector('i');
  console.log('icon-',icon);
  icon.classList.remove('fa-regular','fa-copy');
  icon.classList.add('fa-solid','fa-check');


  icon.style.color = 'blue';

  setTimeout(() => {
     icon.classList.remove('fa-solid','fa-check');
     icon.classList.add('fa-regular','fa-copy');
     icon.style.color = '';
  } , 1500);
}
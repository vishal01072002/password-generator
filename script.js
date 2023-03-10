const inputSlider = document.querySelector("[data-length]");
const lengthNum = document.querySelector("[data-length-num]");
// lengthNum.textContent = "123";

const passwordArea = document.querySelector("[data-password-display]");

const dataCopy = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[copy-msg]");
const uppercaseLetter = document.querySelector("#uppercase");
const lowercaseLetter = document.querySelector("#lowercase");
const numberLetter = document.querySelector("#numbers");
const symbolLetter = document.querySelector("#symbols");
// rangila circle
const strengthColor = document.querySelector(".circle");

const generateBtn = document.querySelector(".generate-btn");
const checkBoxes = document.querySelectorAll("input[type=checkbox]");
const symbolsArr = "@$&_-";

let password = "";
let passwordLength = 10;
let checkCount = 0;
// let strength color state
setIndicator("grey");
sliderHandle();

// to handle slider and update value corresponding to that
function sliderHandle() {
  inputSlider.value = passwordLength;
  lengthNum.innerText = passwordLength;
}

// find random num b/w min and max
// eg max=15 min=5
// 0 to max-min => random*max-min
// add min => min to max

function randomInt(min, max) {
  let tempNum = Math.floor(Math.random() * (max - min)) + min;
  return tempNum;
}

function randomNum() {
  return randomInt(0, 10);
}

function randomLowercase() {
  let char = String.fromCharCode(randomInt(97, 123));
  return char;
}

function randomUppercase() {
  let char = String.fromCharCode(randomInt(65, 91));
  // console.log(char);
  return char;
}

function randomSymbol() {
  let indx = randomInt(0, 5);
  return symbolsArr[indx];
}

function setIndicator(color) {
  strengthColor.style.backgroundColor = color;
  strengthColor.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
function calculateStrength() {
  let num = false;
  let lower = false;
  let upper = false;
  let symbol = false;

  if (uppercaseLetter.checked) upper = true;
  if (lowercaseLetter.checked) lower = true;
  if (numberLetter.checked) num = true;
  if (symbolLetter.checked) symbol = true;

  if (upper && lower && (num || symbol) && passwordLength >= 8) {
    setIndicator("green");
  } else if ((upper || lower) && (symbol || num) && passwordLength >= 6) {
    setIndicator("yellow");
  } else {
    setIndicator("red");
  }
}

async function copyContent() {
  // navigator.clipboard.writeText(value)  return promise
  try {
    await navigator.clipboard.writeText(passwordArea.value);
    // jab ho jaye then
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "failed";
  }

  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function handleCheckbox() {
  checkCount = 0;
  checkBoxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });

  // special case when length is less than checked
  if (passwordLength <= checkCount) {
    passwordLength = checkCount;
    sliderHandle();
  }
}

checkBoxes.forEach((checkbox) => {
  addEventListener("change", handleCheckbox);
});

// 3 event listner copybtn, generate password, slider

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  sliderHandle();
});

// copy jab hoga jab content hoga
dataCopy.addEventListener("click", () => {
  if (passwordArea.value) {
    copyContent();
  }
});

generateBtn.addEventListener("click", () => {
  if (checkCount <= 0) return;

  // remove old password
  password = "";

  // special case when length is less than checked
  if (passwordLength <= checkCount) {
    passwordLength = checkCount;
    sliderHandle();
  }
  // start generating password

  let checkArr = [];

  // add checked function
  if (numberLetter.checked) checkArr.push(randomNum);
  if (uppercaseLetter.checked) checkArr.push(randomUppercase);
  if (lowercaseLetter.checked) checkArr.push(randomLowercase);
  if (symbolLetter.checked) checkArr.push(randomSymbol);

  // comulsury in password
  for (let i = 0; i < checkArr.length; i++) {
    password += checkArr[i]();
  }

  // remaining characters
  for (let i = 0; i < passwordLength - checkArr.length; i++) {
    let randomFuncIndx = randomInt(0, checkArr.length);
    password += checkArr[randomFuncIndx]();
  }

  // shuffle password pass aas array coz string are imutable
  console.log(password);
  password = passwordShuffle(Array.from(password));

  calculateStrength();

  passwordArea.value = password;
});

function passwordShuffle(array) {
  for (let i = 0; i < array.length; i++) {
    let randIndx = randomInt(0, array.length);
    let temp = array[i];
    array[i] = array[randIndx];
    array[randIndx] = temp;
  }
  let str = "";

  array.forEach((e) => {
    str += e;
  });
  return str;
}

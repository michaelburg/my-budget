let actionElement = document.getElementById("action");
let descriptionElement = document.getElementById("actionDescription");
let valueElement = document.getElementById("actionValue");
let redColor = "#F53237";
let greenColor = "rgb(56, 178, 173)";
let borderColor = "rgb(202, 202, 202)";
let totalBudget = 0;
let totalIncome = 0;
let totalExpense = 0;
let docBody = document.querySelector("body");
let isDarkMode = JSON.parse(localStorage.getItem("darkModeActive")) || false;
if (isDarkMode) {
  colorBody();
}
let borderSize = toggleBorderSize();
let transactions =
  JSON.parse(window.localStorage.getItem("transactions")) || [];
changeDarkModeButtons();
addEventListenerToTextInput();
addEventListenerToValueInput();
addEventListenerToAction();
handleSelectChange();
loadPage();
updateDarkModeIcon();

function loadPage() {
  let action;
  document.getElementById(
    "headWithDate"
  ).innerText = `Available budget in ${getDateToTitle()}:`;
  for (const key in transactions) {
    commitAction(key, transactions[key]);
  }
}

function submitAction() {
  let actionDescription = actionDescriptionText.value;
  let actionValue = actionValueText.valueAsNumber;
  if (validateInput(actionDescription, actionValue)) return;
  if (action === "reduce") actionValue *= -1;
  commitAction(actionDescription, actionValue);
  actionDescriptionText.value = "";
  actionValueText.valueAsNumber = NaN;
}

function validateInput(actionDescription, actionValue) {
  return (
    actionDescription === "" ||
    actionValue <= 0 ||
    isNaN(actionValue) ||
    transactions.hasOwnProperty(actionDescription)
  );
}
function commitAction(description, transactionValue) {
  let typeOfTransaction;
  transactionValue < 0
    ? (typeOfTransaction = "expense")
    : (typeOfTransaction = "income");
  transactionValue < 0
    ? (totalExpense += transactionValue)
    : (totalIncome += transactionValue);
  totalBudget += transactionValue;
  transactions[description] = transactionValue;
  createNewAction(typeOfTransaction, description, transactionValue);
  setHead();
  setExpensesPer();
  updateLocalStorage();
}
function createNewAction(typeOfTransaction, description, transactionValue) {
  let parent = document.querySelector(`.${typeOfTransaction}Items`);
  let newAction = document.createElement("div");
  newAction.className = typeOfTransaction + "Wrapper";
  newAction.innerHTML = `
  <p class="description">${description}</p>
  <div class = "transaction">
  <p class="transactionAmount">${numberToPrint(transactionValue)}</p>
  ${typeOfTransaction === "expense" ? `<p id="percent"></p>` : ""}
  <i class="fa-regular fa-circle-xmark xMark transactionCancel" id="cancelExpense" onclick="cancel(this)"></i>
  </div>
  `;
  parent.appendChild(newAction);
}

function setHead() {
  let budget = document.getElementById("totalBudget");
  budget.innerText = numberToPrint(totalBudget);
  document.getElementById("totalIncome").innerText = numberToPrint(totalIncome);
  document.getElementById("totalExpenses").innerText =
    numberToPrint(totalExpense);
  document.getElementById("totalPercent").innerText = `${
    parseInt((totalExpense * 100) / totalIncome) * -1 || 0
  }%`;
}

function setExpensesPer() {
  let expenseDiv = document.querySelectorAll(".expenseWrapper");
  expenseDiv.forEach((div) => {
    let expenseDesc = div.querySelector(".description").innerText;
    let expensePer = div.querySelector("#percent");
    let percent =
      parseInt((foundTransaction["value"] * 100) / totalIncome) * -1 || 0;
    expensePer.innerText = `${percent}%`;
  });
}

function cancel(btn, timeStamp) {
  const foundTransaction = transactions.find(
    (transaction) => transaction.timeStamp === timeStamp
  );
  let div = btn.closest(".incomeWrapper") || btn.closest(".expenseWrapper");
  let cancelAmount;
  let cancelDescription = div.querySelector(".description").innerText;
  if (div === btn.closest(".incomeWrapper")) {
    totalIncome -= transactions[cancelDescription];
  } else if (div === btn.closest(".expenseWrapper")) {
    totalExpense -= transactions[cancelDescription];
  }
  totalBudget -= transactions[cancelDescription];
  setHead();
  setExpensesPer();
  updateLocalStorage();

  div.remove();
}

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function getDateToTitle() {
  const date = new Date();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  return month + " " + year;
}
function validateInput(description, actionValue) {
  return (
    description === "" ||
    isNaN(actionValue) ||
    actionValue <= 0 ||
    transactions.hasOwnProperty(description)
  );
}
function numberToPrint(number) {
  let sign = "+";
  if (number < 0) {
    sign = "-";
    number = number * -1;
  }
  const fixNum = number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign} ${fixNum}`;
}
function changeBorderColor() {
  action = document.getElementById("action").value;
  if (action == "reduce") return redColor;
  return greenColor;
}
function handleSelectChange() {
  document.getElementById("submitAction").style.color = changeBorderColor();
}

function addEventListenerToTextInput() {
  actionDescriptionText.addEventListener("focus", function () {
    actionDescriptionText.style.border = "2px solid " + changeBorderColor();
  });
  actionDescriptionText.addEventListener("blur", function () {
    actionDescriptionText.style.border = "1px solid " + borderColor;
  });
}

function addEventListenerToValueInput() {
  actionValueText.addEventListener("focus", function () {
    actionValueText.style.border = "2px solid " + changeBorderColor();
  });

  actionValueText.addEventListener("blur", function () {
    actionValueText.style.border = "1px solid " + borderColor;
  });
}

document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") submitAction();
});

function toggleDarkMode() {
  isDarkMode = isDarkMode === false ? true : false;
  updateDarkModeIcon();
  colorBody();
  changeDarkModeButtons();
  handleSelectChange();
  borderSize = toggleBorderSize();
  localStorage.setItem("darkModeActive", isDarkMode);
  location.reload();
}
function colorBody() {
  if (isDarkMode) {
    docBody.classList.add("darkMode");
  } else {
    docBody.classList.remove("darkMode");
  }
}

function updateDarkModeIcon() {
  const darkModeToggler = document.querySelector(".darkModeToggler");
  darkModeToggler.innerHTML = isDarkMode
    ? '<i class="fas fa-sun darkModeButton"></i>'
    : '<i class="fas fa-moon darkModeButton"></i>';
}

function changeDarkModeButtons() {
  let checkDiv = document.querySelector(".checkmarkSwitch");
  if (isDarkMode) {
    checkDiv.innerHTML = `<i
    class="fas fa-circle-check checkmark"
    id="submitAction"
    onclick="submitAction()"
  ></i>`;
  } else {
    checkDiv.innerHTML = `<i
    class="far fa-check-circle checkmark"
    id="submitAction"
    onclick="submitAction()"
  ></i>`;
  }
}

function toggleBorderSize() {
  return isDarkMode ? "3px" : "2px";
}

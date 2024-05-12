let actionElement = document.getElementById("action");
let descriptionElement = document.getElementById("actionDescription");
let valueElement = document.getElementById("actionValue");
let redColor = "#F53237";
let greenColor = "rgb(56, 178, 173)";
let borderColor = "rgb(202, 202, 202)";
let totalBudget = 0;
let totalIncome = 0;
let totalExpense = 0;
let isDarkMode = false;
let transactions =
  JSON.parse(window.localStorage.getItem("transactions")) || {};
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
    transactions[key] < 0 ? (action = "expense") : (action = "income");
    commitAction(action, key, transactions[key]);
  }
}

function submitAction() {
  let action = actionElement.value;
  let description = descriptionElement.value;
  let actionValue = valueElement.valueAsNumber;
  if (validateInput(description, actionValue)) return;
  if (action === "expense") actionValue *= -1;
  commitAction(action, description, actionValue);
  descriptionElement.value = "";
  valueElement.value = "";
}

function commitAction(action, description, actionValue) {
  actionValue < 0
    ? (totalExpense += actionValue)
    : (totalIncome += actionValue);
  totalBudget += actionValue;
  transactions[description] = actionValue;
  createNewAction(action, description, actionValue);
  setHead();
  setExpensesPer();
  updateLocalStorage();
}

function createNewAction(action, description, actionValue) {
  let parent = document.querySelector(`.${action}Items`);
  let newAction = document.createElement("div");
  newAction.className = action + "Wrapper";
  newAction.innerHTML = `
  <p class=actionName>${description}</p>
  <div class = "transaction">
  <p class="transactionAmount">${numberToPrint(actionValue)}</p>
  ${action === "expense" ? `<p class="percent"></p>` : ""}
  <i class="fa-regular fa-circle-xmark xMark transactionCancel" onclick="cancel(this)"></i>
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
    let expenseDesc = div.querySelector(".actionName").innerText;
    let expensePer = div.querySelector(".percent");
    let percent =
      parseInt((transactions[expenseDesc] * 100) / totalIncome) * -1 || 0;
    expensePer.innerText = `${percent}%`;
  });
}

function cancel(btn) {
  let div = btn.closest(".incomeWrapper") || btn.closest(".expenseWrapper");
  let cancelDescription = div.querySelector(".actionName").innerText;
  if (div === btn.closest(".incomeWrapper"))
    totalIncome -= transactions[cancelDescription];
  else if (div === btn.closest(".expenseWrapper"))
    totalExpense -= transactions[cancelDescription];
  totalBudget -= transactions[cancelDescription];
  delete transactions[cancelDescription];
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
  const action = document.getElementById("action").value;
  if (action == "expense") return redColor;
  return greenColor;
}
function handleSelectChange() {
  document.getElementById("submitAction").style.color = changeBorderColor();
}

function addEventListenerToTextInput() {
  descriptionElement.addEventListener("focus", function () {
    descriptionElement.style.border = "2px solid " + changeBorderColor();
  });
  descriptionElement.addEventListener("blur", function () {
    descriptionElement.style.border = "1px solid " + borderColor;
  });
}

function addEventListenerToValueInput() {
  valueElement.addEventListener("focus", function () {
    valueElement.style.border = "2px solid " + changeBorderColor();
  });

  valueElement.addEventListener("blur", function () {
    valueElement.style.border = "1px solid " + borderColor;
  });
}

function addEventListenerToAction(){
  actionElement.addEventListener('click', function(){
    actionElement.style.border = '2px solid rgb(56, 178, 173)'
  });
  actionElement.addEventListener("blur", function () {
    actionElement.style.border = "1px solid " + borderColor;
  });
}

document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") submitAction();
});

function toggleDarkMode(){
  isDarkMode = isDarkMode === false ? true : false;
  updateDarkModeIcon();
  console.log(isDarkMode);
}

function updateDarkModeIcon() {
  const darkModeToggler = document.querySelector('.darkModeToggler');
  darkModeToggler.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}
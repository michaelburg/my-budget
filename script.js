let action = document.getElementById("action").value;
let actionDescriptionText = document.getElementById("actionDescription");
let actionValueText = document.getElementById("actionValue");
let redColor = "#F53237";
let greenColor = "rgb(56, 178, 173)";
let borderColor = "rgb(202, 202, 202)";
let totalBudget = 0;
let totalIncome = 0;
let totalExpense = 0;
let transactions =
  JSON.parse(window.localStorage.getItem("transactions")) || {};

addEventListenerToTextInput();
addEventListenerToValueInput();
handleSelectChange();
loadPage();

function loadPage() {
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
      parseInt((transactions[expenseDesc] * 100) / totalIncome) * -1 || 0;
    expensePer.innerText = `${percent}%`;
  });
}

function cancel(btn) {
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
  delete transactions[cancelDescription];
  updateLocalStorage();

  div.remove();
}

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function getDateToTitle() {
  let date = new Date();
  return (
    date.toLocaleString("en-US", { month: "long" }) + " " + date.getFullYear()
  );
}

function numberToPrint(number) {
  const fixNum = number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (number >= 0) return "+ " + fixNum;
  return fixNum;
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

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let action = document.getElementById("action").value;
let actionDescriptionText = document.getElementById("actionDescription");
let actionValueText = document.getElementById("actionValue");

addEventListenerToTextInput();
addEventListenerToValueInput();
handleSelectChange();

let totalBudget = 0;
let totalIncome = 0;
let totalExpense = 0;
let transactions =
  JSON.parse(window.localStorage.getItem("transactions")) || {};
loadPage();
function loadPage() {
  document.getElementById(
    "headWithDate"
  ).innerText = `Available budget in ${getDateToTitle()}`;
  for (const key in transactions) {
    commitAction(key, transactions[key]);
  }
}

function submitAction() {
  let actionDescription = actionDescriptionText.value;
  let actionValue = actionValueText.valueAsNumber;
  if (actionDescription === "" || actionValue <= 0 || isNaN(actionValue))
    return;
  if (action === "reduce") actionValue *= -1;
  commitAction(actionDescription, actionValue);
  actionDescriptionText.value = "";
  actionValueText.valueAsNumber = NaN;
}

function commitAction(description, value) {
  let typeOfTransaction;
  value < 0 ? (typeOfTransaction = "expense") : (typeOfTransaction = "income");
  value < 0 ? (totalExpense += value) : (totalIncome += value);
  totalBudget += value;
  let parent = document.querySelector(`.${typeOfTransaction}Items`);
  let newAction = document.createElement("div");
  newAction.className = typeOfTransaction + "Wrapper";
  newAction.innerHTML = `
  <p class="description">${description}</p>
  <div class = "transaction">
  <span class="transactionAmount">${value}</span>
  ${typeOfTransaction === "expense" ? `<span id="percent"></span>` : ""}
  <i class="fas fa-times checkmark transactionCancel" id="cancelExpense" onclick="cancel(this)"></i>
  </div>
  `;
  parent.appendChild(newAction);
  setHead();
  setExpensesPer();
  transactions[description] = value;
  updateLocalStorage();
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
    let expense = div.querySelector(".transactionAmount").innerText;
    let expensePer = div.querySelector("#percent");
    let percent = parseInt((expense * 100) / totalIncome) || 0;
    expensePer.innerText = `${percent}%`;
  });
}

function cancel(btn) {
  let div = btn.closest(".incomeWrapper") || btn.closest(".expenseWrapper");
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
  return months[date.getMonth()] + " " + date.getFullYear();
}

function numberToPrint(number) {
  if (number >= 0)
    return "+" + number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function handleSelectChange() {
  action = document.getElementById("action").value;
  if (action === "add")
    document.getElementById("submitAction").style.color = "rgb(56, 178, 173)";
  else if (action === "reduce") {
    document.getElementById("submitAction").style.color = "#F53237";
  }
}

function addEventListenerToTextInput() {
  actionDescriptionText.addEventListener("focus", function () {
    if (action === "add") {
      actionDescriptionText.style.border = "2px solid rgb(56, 178, 173)";
    } else {
      actionDescriptionText.style.border = "2px solid #F53237";
    }
  });
  actionDescriptionText.addEventListener("blur", function () {
    actionDescriptionText.style.border = "1px solid grey";
  });
}

function addEventListenerToValueInput() {
  actionValueText.addEventListener("focus", function () {
    if (action === "add") {
      actionValueText.style.border = "2px solid rgb(56, 178, 173)";
    } else {
      actionValueText.style.border = "2px solid #F53237";
    }
  });

  actionValueText.addEventListener("blur", function () {
    actionValueText.style.border = "1px solid grey";
  });
}

document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") submitAction();
});

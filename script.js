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

totalbudget = 0;
totalincome = 0;
totalexpense = 0;
transactions = JSON.parse(window.localStorage.getItem("transactions")) || {};
loadPage();

function loadPage() {
  document.getElementById(
    "headWithDate"
  ).innerText = `Available budjet in ${getDateToTitle()}`;
  for (const key in transactions) {
    commitAction(key, transactions[key]);
  }
}

function submitAction() {
  actionDescription = actionDescriptionText.value;
  actionValue = actionValueText.valueAsNumber;
  if (actionDescription == "" || actionValue <= 0 || isNaN(actionValue)) return;
  if (action == "reduce") actionValue = actionValue * -1;
  commitAction(actionDescription, actionValue);
  actionDescriptionText.value = "";
  actionValueText.valueAsNumber = NaN;
}
function commitAction(description, value) {
  let TypeOfTransaction;
  value < 0 ? (TypeOfTransaction = "expense") : (TypeOfTransaction = "income");
  value < 0 ? (totalexpense += value) : (totalincome += value);
  percent = parseInt((value * 100) / totalincome) || 0;
  totalbudget += value;
  parent = document.getElementById(TypeOfTransaction + "s");
  newAction = document.createElement("div");
  newAction.id = TypeOfTransaction;
  newAction.innerHTML = `
  <p id="description">${description}</p>
  <p id="${TypeOfTransaction}-amount">${numberToPrint(value)}</p>
  ${value < 0 ? `<p id="percent">${percent}%</p>` : ""}
  <button id="cancel" onclick="cancel(this)">Cancel</button>
  `;
  parent.appendChild(newAction);
  setHead();
  setExpensesPer();
  transactions[description] = value;
  updateLocalStorage();
}

function setHead() {
  budjet = document.getElementById("totalbudget");
  if (totalbudget >= 0) budjet.style.color = "green";
  else budjet.style.color = "red";
  budjet.innerText = numberToPrint(totalbudget);
  document.getElementById("totalIncome").innerText = numberToPrint(totalincome);
  document.getElementById("totalExpenses").innerText =
    numberToPrint(totalexpense);
  document.getElementById("totalPercent").innerText = `${
    parseInt((totalexpense * 100) / totalincome) || 0
  }%`;
}
function setExpensesPer() {
  expenseDiv = document.querySelectorAll("#expense");
  expenseDiv.forEach((div) => {
    expense = div.querySelector("#expense-amount").innerText;
    expensePer = div.querySelector("#percent");
    percent = parseInt((expense * 100) / totalincome) || 0;
    expensePer.innerText = `${percent}%`;
  });
}
function cancel(btn) {
  div = btn.parentNode;
  let cancelAmount;
  cancelDescription = div.querySelector("#description").innerText;
  try {
    cancelAmount = div.querySelector("#income-amount").innerText;
    totalincome -= cancelAmount;
  } catch {
    cancelAmount = div.querySelector("#expense-amount").innerText;
    totalexpense -= cancelAmount;
  }
  totalbudget -= cancelAmount;
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
  date = new Date();
  return months[date.getMonth()] + " " + date.getFullYear();
}
function numberToPrint(number) {
  if (number >= 0)
    return "+" + number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function handleSelectChange() {
  action = document.getElementById("action").value;
  if (action == "add")
    document.getElementById("submitAction").style.backgroundColor = "green";
  else if (action == "reduce") {
    document.getElementById("submitAction").style.backgroundColor = "red";
  }
}
function addEventListenerToTextInput() {
  actionDescriptionText.addEventListener("focus", function () {
    if (action == "add") {
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
    if (action == "add") {
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

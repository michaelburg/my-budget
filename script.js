let actionElement = document.getElementById("action");
let descriptionElement = document.getElementById("actionDescription");
let valueElement = document.getElementById("actionValue");
let totalBudget = 0;
let totalIncome = 0;
let totalExpense = 0;
let currentBudget = 0;
let snackbarTimeout;
let isPageLoad = true;
const docBody = document.querySelector("body");
if (isDarkMode) {
  colorBody();
}
let borderSize = toggleBorderSize();
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
  currentBudget = totalBudget;
  transactions.forEach((transaction) => {
    transaction["value"] < 0 ? (action = "expense") : (action = "income");
    commitAction(
      action,
      transaction["description"],
      transaction["value"],
      transaction["timeStamp"]
    );
  });
  isPageLoad = false
}

function submitAction() {
  let action = actionElement.value;
  let description = descriptionElement.value;
  let actionValue = valueElement.valueAsNumber;
  if (validateInput(description, actionValue)){
    showSnackbar();
    return;}
  if (action === "expense") actionValue *= -1;
  time = new Date().getTime();
  transactions.push({
    description: description,
    value: actionValue,
    timeStamp: time,
  });
  currentBudget = totalBudget
  commitAction(action, description, actionValue, time);
  descriptionElement.value = "";
  valueElement.value = "";
}
function commitAction(action, description, actionValue, time) {
  actionValue < 0
    ? (totalExpense += actionValue)
    : (totalIncome += actionValue);
  currentBudget = totalBudget;
  totalBudget += actionValue;
  createNewAction(action, description, actionValue, time);
  setHead();
  setExpensesPer();
  updateLocalStorage();
  
}
function createNewAction(action, description, actionValue, time) {
  let cancelClass = isDarkMode
    ? "fa-solid fa-circle-xmark transactionCancel"
    : "fa-regular fa-circle-xmark xMark transactionCancel";

  let parent = document.querySelector(`.${action}Items`);
  let newAction = document.createElement("div");
  newAction.className = action + "Wrapper";
  newAction.id = time;
  newAction.innerHTML = `
  <p class=actionName>${description}</p>
  <div class = "transaction">
  <p class="transactionAmount">${numberToPrint(actionValue)}</p>
  ${action === "expense" ? `<p class="percent"></p>` : ""}
  <p class="timeStamp">${time}</p>
  <i class="${cancelClass}" onclick="cancel(this,${time})"></i>
  </div>
  `;
  parent.appendChild(newAction);
}

function setHead() {
  animateBudgetChange();
  document.getElementById("totalIncome").innerText = numberToPrint(totalIncome);
  document.getElementById("totalExpenses").innerText =
    numberToPrint(totalExpense, true);
  document.getElementById("totalPercent").innerText = `${
    parseInt((totalExpense * 100) / totalIncome) * -1 || 0
  }%`;
}

function setExpensesPer() {
  let expenseDiv = document.querySelectorAll(".expenseWrapper");
  expenseDiv.forEach((div) => {
    let timeStamp = parseInt(div.querySelector(".timeStamp").innerText);
    const foundTransaction = transactions.find(
      (transaction) => transaction.timeStamp === timeStamp
    );
    let expensePer = div.querySelector(".percent");
    let percent =
      parseInt((foundTransaction["value"] * 100) / totalIncome) * -1 || 0;
    expensePer.innerText = `${percent}%`;
  });
}

function cancel(cancelButton, timeStamp) {
  const foundTransaction = transactions.find(
    (transaction) => transaction.timeStamp === timeStamp
  );
  let actionDiv = cancelButton.closest(".incomeWrapper") || cancelButton.closest(".expenseWrapper");
  if (actionDiv === cancelButton.closest(".incomeWrapper"))
    totalIncome -= foundTransaction["value"];
  else if (actionDiv === cancelButton.closest(".expenseWrapper"))
   totalExpense -= foundTransaction["value"];


   currentBudget = totalBudget;
   totalBudget -= foundTransaction["value"];
  transactions = transactions.filter(
    (transaction) => transaction.timeStamp !== timeStamp
  );
  actionDiv.remove();
  setHead();
  setExpensesPer();
  updateLocalStorage();
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
function numberToPrint(number, isExpenseHead = false) {
  let sign = "+";
  if (number < 0 || isExpenseHead) {
    sign = "-";
    number = Math.abs(number);
  }
  const fixNum = number.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});
  return `${sign} ${fixNum}`;
}

function handleSelectChange() {
  document.getElementById("submitAction").style.color = changeBorderColor();
}

document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") submitAction();
});
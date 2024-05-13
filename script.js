let actionElement = document.getElementById("action");
let descriptionElement = document.getElementById("actionDescription");
let valueElement = document.getElementById("actionValue");
let redColor = "#F53237";
let greenColor = "rgb(56, 178, 173)";
let borderColor = "rgb(202, 202, 202)";
let totalBudget = 0;
let totalIncome = 0;
let totalExpense = 0;
let currentBudget = 0;
let isPageLoad = true
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
    let snackbarMessage = document.getElementById('snackbar')
    snackbarMessage.className = 'show'
    setTimeout(function(){ snackbarMessage.className = snackbarMessage.className.replace("show", ""); }, 2400);
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
  console.log(`current budget is ${currentBudget}`);
  totalBudget += actionValue;
  console.log(`total budget is ${totalBudget}`);
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
    numberToPrint(totalExpense);
  document.getElementById("totalPercent").innerText = `${
    parseInt((totalExpense * 100) / totalIncome) * -1 || 0
  }%`;
}

function animateBudgetChange() {
  if (isPageLoad) {
    updateBudgetDisplay(totalBudget);
    return;
  }
  let from = currentBudget;
  let to = totalBudget;
  let step = to > from ? 423 : -423;
  let interval = 10;
  if (from === to) {
    updateBudgetDisplay(from);
    return;
  }
  let counter = setInterval(function() {
    // If the budget has reached its final value, clear the interval and exit the function
    if (from === to) {
      clearInterval(counter);
      return;
    }
    from += step;
    // If the current budget has reached or passed the total budget, set it to the total budget
    if ((step > 0 && from >= to) || (step < 0 && from <= to)) {
      from = to;
    }
    updateBudgetDisplay(from);
  }, interval);
}


function updateBudgetDisplay(budget) {
  let budgetElement = document.getElementById("totalBudget");
  budgetElement.innerText = numberToPrint(budget);
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

function cancel(btn, timeStamp) {
  const foundTransaction = transactions.find(
    (transaction) => transaction.timeStamp === timeStamp
  );
  let div = btn.closest(".incomeWrapper") || btn.closest(".expenseWrapper");
  if (div === btn.closest(".incomeWrapper"))
    totalIncome -= foundTransaction["value"];
  else if (div === btn.closest(".expenseWrapper"))
    totalExpense -= foundTransaction["value"];
   currentBudget = totalBudget;
  
   totalBudget -= foundTransaction["value"];
  transactions = transactions.filter(
    (transaction) => transaction.timeStamp !== timeStamp
  );
  div.remove();
  setHead();
  setExpensesPer();
  updateLocalStorage();
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
    descriptionElement.style.border = `${borderSize} solid ${changeBorderColor()}`;
  });
  descriptionElement.addEventListener("blur", function () {
    descriptionElement.style.border = `1px solid ${borderColor}`;
  });
}

function addEventListenerToValueInput() {
  valueElement.addEventListener("focus", function () {
    valueElement.style.border = `${borderSize} solid ${changeBorderColor()}`;
  });

  valueElement.addEventListener("blur", function () {
    valueElement.style.border = `1px solid ${borderColor}`;
  });
}

function addEventListenerToAction() {
  actionElement.addEventListener("click", function () {
    actionElement.style.border = `${borderSize} solid ${changeBorderColor()}`;
  });
  actionElement.addEventListener("blur", function () {
    actionElement.style.border = "1px solid " + borderColor;
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

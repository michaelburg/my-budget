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

addEventListenerToTextInput()
addEventListenerToValueInput()

totalBudget = 0;
totalincome = 0;
totalexpense = 0;
data = JSON.parse(window.localStorage.getItem("data")) || {
  incomes: {},
  expenses: {},
};
loadPage();
function loadPage() {
  date = new Date();
  document.getElementById("headWithDate").innerHTML = `Available budget in ${
    months[date.getMonth()] + " " + date.getFullYear()
  }`;
  for (const key in data.expenses) {
    reduce(key, data.expenses[key].value);
  }
  for (const key in data.incomes) {
    add(key, data.incomes[key].value);
  }
}
document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") submitAction();
});
function submitAction() {
  actionDescription = actionDescriptionText.value;
  actionValue = actionValueText.valueAsNumber;
  actionValue = Math.round(parseFloat(actionValue) * 100) / 100;
  if (
    actionDescription == "" ||
    actionValue <= 0 ||
    isNaN(actionValue) ||
    data.incomes.hasOwnProperty(actionDescription)
  )
    return;
  if (action == "add") add(actionDescription, actionValue);
  else if (action == "reduce") reduce(actionDescription, actionValue);
  actionDescriptionText.value = "";
  actionValueText.valueAsNumber = "";
}
function add(actionDescription, actionValue) {
  totalincome += actionValue;
  totalBudget += actionValue;
  parent = document.querySelector(".incomeItems");
  let newAction = document.createElement("div");
  newAction.innerHTML = `
  <div class = "incomeWrapper">
  <p id="description">${actionDescription}</p>
  <div>
  <span id="income-amount">${actionValue}</span>
  <i class="fas fa-times checkmark transactionCancel" id="cancelExpense" onclick="cancelIncome(this)"></i>
  </div>
  </div>
  `;
  parent.appendChild(newAction);
  data.incomes[actionDescription] = { value: actionValue };
  setHead();
  setExpensesPer();
  updateLocalStorage();
}
function reduce(actionDescription, actionValue) {
  totalexpense += actionValue;
  totalBudget -= actionValue;
  percent = parseInt((actionValue * 100) / totalincome) || 0;
  parent = document.querySelector(".expenseItems");
  newAction = document.createElement("div");
  newAction.innerHTML = `
  <div class = "expenseWrapper">
  <p id="description">${actionDescription}</p>
  <div>
  <span id="expense-amount">${actionValue}</span>
  <span id="percent">${percent}%</span>
  <i class="fas fa-times checkmark transactionCancel" id="cancelExpense" onclick="cancelExpense(this)"></i>
  </div>
  </div>
`;
  parent.appendChild(newAction);
  data.expenses[actionDescription] = { value: actionValue };
  setHead();
  setExpensesPer();
  updateLocalStorage();
}
function setHead() {
  budget = document.getElementById("totalBudget");
  if (totalBudget >= 0) {
    budget.innerText = "+" + totalBudget;
  } else {
    budget.innerText = totalBudget;
  }
  document.getElementById("totalIncome").innerText = totalincome;
  document.getElementById("totalExpenses").innerText = totalexpense;
  document.getElementById("totalPercent").innerText = `${
    parseInt((totalexpense * 100) / totalincome) || 0
  }%`;
}
function setExpensesPer() {
  expenseDiv = document.querySelectorAll("#expense");
  expenseDiv.forEach((div) => {
    description = div.querySelector("#description").innerText;
    expense = div.querySelector("#expense-amount").innerText;
    expensePer = div.querySelector("#percent");
    percent = parseInt((expense * 100) / totalincome) || 0;
    expensePer.innerText = `${percent}%`;
  });
  // <p id="percent">${parseInt((actionValue * 100) / income)}%</p>
}
function cancelIncome(btn) {
  // const incomes = document.getElementById("incomes");
  div = btn.closest(".incomeWrapper");
  cancelIncomeDescription = div.querySelector("#description").innerText;
  cancelIncomeAmount = div.querySelector("#income-amount").innerText;
  totalBudget -= cancelIncomeAmount;
  totalincome -= cancelIncomeAmount;
  setHead();
  setExpensesPer();
  delete data.incomes[cancelIncomeDescription];
  updateLocalStorage();

  div.remove();
  if(document.querySelector(".expenseItems").children.length === 0){
    document.querySelector(".expenseItems").style.border = 'none';
}}
function cancelExpense(btn) {
  div = btn.closest(".expenseWrapper");
  cancelexpenseDescription = div.querySelector("#description").innerText;
  cancelexpenseAmount = parseFloat(
    div.querySelector("#expense-amount").innerText
  );
  totalBudget += cancelexpenseAmount;
  totalexpense -= cancelexpenseAmount;
  setHead();
  setExpensesPer();
  delete data.expenses[cancelexpenseDescription];
  updateLocalStorage();
  div.remove();
  if(document.querySelector(".expenseItems").children.length === 0){
    document.querySelector(".expenseItems").style.border = 'none';
}}
function updateLocalStorage() {
  // quizArr = JSON.parse(window.localStorage.getItem("quizArr")) || quizArr;
  localStorage.setItem("data", JSON.stringify(data));
}
function handleSelectChange() {
  action = document.getElementById("action").value;
  if (action == "add")
    document.getElementById("submitAction").style.color = "rgb(56, 178, 173)";
  else if (action == "reduce") {
    document.getElementById("submitAction").style.color = "#F53237";
  }
}
function addEventListenerToTextInput(){
  actionDescriptionText.addEventListener('focus', function(){
    if(action == 'add'){
      actionDescriptionText.style.border = '2px solid rgb(56, 178, 173)';
    }
    else{
      actionDescriptionText.style.border = '2px solid #F53237';
    }
  })

  actionDescriptionText.addEventListener('blur', function(){
    actionDescriptionText.style.border = '1px solid grey';
  })

  
}

function addEventListenerToValueInput(){
  actionValueText.addEventListener('focus', function(){
    if(action == 'add'){
      actionValueText.style.border = '2px solid rgb(56, 178, 173)';
    }
    else{
      actionValueText.style.border = '2px solid #F53237';
    }
  })

  actionValueText.addEventListener('blur', function(){
    actionValueText.style.border = '1px solid grey';
  })
}
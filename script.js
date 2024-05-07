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
totalbudget = 0;
totalincome = 0;
totalexpense = 0;
data = JSON.parse(window.localStorage.getItem("data")) || {
  incomes: {},
  expenses: {},
};
loadPage();
function loadPage() {
  date = new Date();
  document.getElementById("headWithDate").innerHTML = `Available budjet in ${
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
  action = document.getElementById("action").value;
  actionDescriptionText = document.getElementById("actionDescription");
  actionValueText = document.getElementById("actionValue");
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
  totalbudget += actionValue;
  parent = document.getElementById("incomes");
  newAction = document.createElement("div");
  newAction.id = "income";
  newAction.innerHTML = `
    <p id="description">${actionDescription}</p>
    <p id="income-amount">${actionValue}</p>
    <button id="cancelIncome" onclick="cancelIncome(this)">Cancel</button>
  `;
  parent.appendChild(newAction);
  data.incomes[actionDescription] = { value: actionValue };
  setHead();
  setExpensesPer();
  updateLocalStorage();
}
function reduce(actionDescription, actionValue) {
  totalexpense += actionValue;
  totalbudget -= actionValue;
  persante = parseInt((actionValue * 100) / totalincome) || 0;
  parent = document.getElementById("expenses");
  newAction = document.createElement("div");
  newAction.id = "expense";
  newAction.innerHTML = `
  <p id="description">${actionDescription}</p>
  <p id="expense-amount">${actionValue}</p>
  <p id="percent">${persante}%</p>
  <button id="cancelExpense" onclick="cancelExpense(this)">Cancel</button>
`;
  parent.appendChild(newAction);
  data.expenses[actionDescription] = { value: actionValue };
  setHead();
  setExpensesPer();
  updateLocalStorage();
}
function setHead() {
  budjet = document.getElementById("totalbudget");
  if (totalbudget >= 0) {
    budjet.style.color = "green";
    budjet.innerText = "+" + totalbudget;
  } else {
    budjet.style.color = "red";
    budjet.innerText = totalbudget;
  }
  document.getElementById("totalIncome").innerText = totalincome;
  document.getElementById("totalExpenses").innerText = totalexpense;
  document.getElementById("totalPersant").innerText = `${
    parseInt((totalexpense * 100) / totalincome) || 0
  }%`;
}
function setExpensesPer() {
  expenseDiv = document.querySelectorAll("#expense");
  expenseDiv.forEach((div) => {
    description = div.querySelector("#description").innerText;
    expense = div.querySelector("#expense-amount").innerText;
    expensePer = div.querySelector("#percent");
    persant = parseInt((expense * 100) / totalincome) || 0;
    expensePer.innerText = `${persant}%`;
  });
  // <p id="percent">${parseInt((actionValue * 100) / income)}%</p>
}
function cancelIncome(btn) {
  // const incomes = document.getElementById("incomes");
  div = btn.parentNode;
  cancelIncomeDescription = div.querySelector("#description").innerText;
  cancelIncomeAmount = div.querySelector("#income-amount").innerText;
  totalbudget -= cancelIncomeAmount;
  totalincome -= cancelIncomeAmount;
  setHead();
  setExpensesPer();
  delete data.incomes[cancelIncomeDescription];
  updateLocalStorage();

  div.remove();
}
function cancelExpense(btn) {
  div = btn.parentNode;
  cancelexpenseDescription = div.querySelector("#description").innerText;
  cancelexpenseAmount = parseFloat(
    div.querySelector("#expense-amount").innerText
  );
  totalbudget += cancelexpenseAmount;
  totalexpense -= cancelexpenseAmount;
  setHead();
  setExpensesPer();
  delete data.expenses[cancelexpenseDescription];
  updateLocalStorage();
  div.remove();
}
function updateLocalStorage() {
  // quizArr = JSON.parse(window.localStorage.getItem("quizArr")) || quizArr;
  localStorage.setItem("data", JSON.stringify(data));
}
function handleSelectChange() {
  action = document.getElementById("action").value;
  if (action == "add")
    document.getElementById("submitAction").style.backgroundColor = "green";
  else if (action == "reduce") {
    document.getElementById("submitAction").style.backgroundColor = "red";
  }
}

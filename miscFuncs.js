const redColor = "#F53237";
const greenColor = "rgb(56, 178, 173)";
const borderColor = "rgb(202, 202, 202)";

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

function changeBorderColor() {
  const action = document.getElementById("action").value;
  if (action == "expense") return redColor;
  return greenColor;
}

function addEventListenerToAction() {
  actionElement.addEventListener("click", function () {
    actionElement.style.border = `${borderSize} solid ${changeBorderColor()}`;
  });
  actionElement.addEventListener("blur", function () {
    actionElement.style.border = "1px solid " + borderColor;
  });
}

function animateBudgetChange() {
  if (isPageLoad) {
    updateBudgetDisplay(totalBudget);
    return;
  }
  let from = currentBudget;
  const to = totalBudget;
  const numOfTimes = 47;
  const amountToChange = (to - from) / numOfTimes;
  const interval = 20;

  let counter = setInterval(function () {
    // If the budget has reached its final value, clear the interval and exit the function
    if (from === to) {
      clearInterval(counter);
      return;
    }
    from += amountToChange;
    // If the current budget has reached or passed the total budget, set it to the total budget
    if (
      (amountToChange > 0 && from >= to) ||
      (amountToChange < 0 && from <= to)
    ) {
      from = to;
    }
    updateBudgetDisplay(from);
  }, interval);
}

function updateBudgetDisplay(budget) {
    let budgetElement = document.getElementById("totalBudget");
    budgetElement.innerText = numberToPrint(budget);
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

function updateDarkModeIcon() {
  const darkModeToggler = document.querySelector(".darkModeToggler");
  darkModeToggler.innerHTML = isDarkMode
    ? '<i class="fas fa-sun darkModeButton"></i>'
    : '<i class="fas fa-moon darkModeButton"></i>';
}

function colorBody() {
  if (isDarkMode) {
    docBody.classList.add("darkMode");
  } else {
    docBody.classList.remove("darkMode");
  }
}

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

function toggleBorderSize() {
  return isDarkMode ? "3px" : "2px";
}

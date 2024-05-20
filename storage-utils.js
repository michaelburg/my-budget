let isDarkMode = JSON.parse(localStorage.getItem("darkModeActive")) || false;
let transactions =
  JSON.parse(window.localStorage.getItem("transactions")) || [];
function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }
const selectElement = document.querySelector('html');

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  selectElement.value = theme;
}

function toggleTheme() {
  let theme = selectElement.value;
  if (theme === "light") {
    theme = "dark";
  } else {
    theme = "light";
  }
  setTheme(theme);
}
selectElement.addEventListener('change', toggleTheme);

const theme = localStorage.getItem("theme") ?? "light";
setTheme(theme);
//# sourceURL=/scripts/setTheme.js
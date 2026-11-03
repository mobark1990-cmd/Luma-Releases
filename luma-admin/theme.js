// Runs before the page paints: applies the saved day/night choice so there is no flash.
// With no saved choice the page follows the system setting (see styles.css).
(function () {
  try {
    var saved = localStorage.getItem("luma-admin-theme");
    if (saved === "light" || saved === "dark") {
      document.documentElement.setAttribute("data-theme", saved);
    }
  } catch (e) { /* storage blocked: follow the system */ }
})();

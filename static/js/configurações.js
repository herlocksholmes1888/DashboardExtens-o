document.addEventListener("DOMContentLoaded", () => {
  const themeButtons = document.querySelectorAll(".theme-button");
  const backgroundThemeRadios = document.querySelectorAll('input[name="background-theme"]');
  const saveButton = document.querySelector(".save-button");
  const container = document.querySelector(".container");
  const body = document.body;

  function applyCardTheme(theme) {
    themeButtons.forEach(btn => btn.classList.remove("active"));
    const selectedButton = document.querySelector(`.theme-button[data-theme="${theme}"]`);
    if (selectedButton) selectedButton.classList.add("active");

    container.classList.remove("card-light", "card-dark");
    const themeClass = (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches))
      ? "card-dark" : "card-light";
    container.classList.add(themeClass);
  }

  function applyBackgroundTheme(theme) {
    // Remove todas as classes que começam com bg- do body
    body.classList.forEach(c => {
      if (c.startsWith("bg-")) body.classList.remove(c);
    });
    body.classList.add(`bg-${theme}`);

    backgroundThemeRadios.forEach(radio => {
      radio.checked = radio.value === theme;
    });
  }

  function savePreferences() {
    const selectedCardTheme = document.querySelector(".theme-button.active")?.dataset.theme || "light";
    const selectedBackgroundTheme = document.querySelector('input[name="background-theme"]:checked')?.value || "purple";

    localStorage.setItem("cardTheme", selectedCardTheme);
    localStorage.setItem("backgroundTheme", selectedBackgroundTheme);

    alert("Preferências salvas com sucesso!");
  }

  function loadPreferences() {
    const savedCardTheme = localStorage.getItem("cardTheme") || "light";
    const savedBackgroundTheme = localStorage.getItem("backgroundTheme") || "purple";

    applyCardTheme(savedCardTheme);
    applyBackgroundTheme(savedBackgroundTheme);
  }

  themeButtons.forEach(button => {
    button.addEventListener("click", () => {
      applyCardTheme(button.dataset.theme);
    });
  });

  backgroundThemeRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      applyBackgroundTheme(radio.value);
    });
  });

  if (saveButton) {
    saveButton.addEventListener("click", savePreferences);
  }

  loadPreferences();
});

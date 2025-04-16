/**
 * Verifica si el navegador soporta localStorage
 * @returns {boolean} - true si localStorage está disponible
 */
const isLocalStorageSupported = () => {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    console.warn("localStorage no está disponible:", e);
    return false;
  }
};

/**
 * Configuración del tema
 */
const themeConfig = {
  toggle: document.querySelector(".theme-toggle"),
  prefersDarkScheme: window.matchMedia("(prefers-color-scheme: dark)"),
  themes: {
    light: "light",
    dark: "dark",
  },
};

/**
 * Establece el tema en el documento
 * @param {string} theme - El tema a establecer ('light' o 'dark')
 */
function setTheme(theme) {
  if (!theme || !Object.values(themeConfig.themes).includes(theme)) {
    console.error("Tema inválido:", theme);
    return;
  }

  try {
    document.documentElement.setAttribute("data-theme", theme);
    if (isLocalStorageSupported()) {
      localStorage.setItem("theme", theme);
    }
  } catch (error) {
    console.error("Error al establecer el tema:", error);
  }
}

/**
 * Cambia el tema actual
 */
function toggleTheme() {
  if (!themeConfig.toggle) {
    console.warn("Botón de cambio de tema no encontrado");
    return;
  }

  try {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme =
      currentTheme === themeConfig.themes.dark
        ? themeConfig.themes.light
        : themeConfig.themes.dark;
    setTheme(newTheme);
  } catch (error) {
    console.error("Error al cambiar el tema:", error);
  }
}

/**
 * Inicializa el tema basado en preferencias guardadas o del sistema
 */
function initializeTheme() {
  if (!themeConfig.toggle) return;

  try {
    let savedTheme = null;
    if (isLocalStorageSupported()) {
      savedTheme = localStorage.getItem("theme");
    }

    if (savedTheme && Object.values(themeConfig.themes).includes(savedTheme)) {
      setTheme(savedTheme);
    } else if (themeConfig.prefersDarkScheme.matches) {
      setTheme(themeConfig.themes.dark);
    } else {
      setTheme(themeConfig.themes.light);
    }
  } catch (error) {
    console.error("Error al inicializar el tema:", error);
    setTheme(themeConfig.themes.light); // Fallback al tema claro
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();

  if (themeConfig.toggle) {
    themeConfig.toggle.addEventListener("click", toggleTheme);
  }

  // Escuchar cambios en las preferencias del sistema
  themeConfig.prefersDarkScheme.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      setTheme(e.matches ? themeConfig.themes.dark : themeConfig.themes.light);
    }
  });
});

// Script para el menú móvil
const mobileMenuButton = document.querySelector(".mobile-menu-button");
const navLinks = document.querySelector(".nav-links");

if (mobileMenuButton && navLinks) {
  mobileMenuButton.addEventListener("click", () => {
    const isExpanded =
      mobileMenuButton.getAttribute("aria-expanded") === "true";
    mobileMenuButton.setAttribute("aria-expanded", !isExpanded);
    navLinks.classList.toggle("active");
  });
}

// Script para actualizar el aria-current en la navegación
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-link");

if (sections.length && navItems.length) {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute("id");
        navItems.forEach((link) => {
          const href = link.getAttribute("href").substring(1);
          if (href === currentId) {
            link.setAttribute("aria-current", "page");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });
}

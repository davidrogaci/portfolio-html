// Verificar si el navegador soporta localStorage
const isLocalStorageSupported = () => {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

// Script para el cambio de tema
const themeToggle = document.querySelector(".theme-toggle");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// Función para establecer el tema
function setTheme(theme) {
  if (!theme) return;

  document.documentElement.setAttribute("data-theme", theme);
  if (isLocalStorageSupported()) {
    localStorage.setItem("theme", theme);
  }
}

// Función para cambiar el tema
function toggleTheme() {
  if (!themeToggle) return;

  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);
}

// Inicializar el tema
function initializeTheme() {
  if (!themeToggle) return;

  let savedTheme = null;
  if (isLocalStorageSupported()) {
    savedTheme = localStorage.getItem("theme");
  }

  if (savedTheme) {
    setTheme(savedTheme);
  } else if (prefersDarkScheme.matches) {
    setTheme("dark");
  } else {
    setTheme("light");
  }
}

// Event listeners
if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}

if (prefersDarkScheme) {
  prefersDarkScheme.addEventListener("change", (e) => {
    if (!isLocalStorageSupported() || !localStorage.getItem("theme")) {
      setTheme(e.matches ? "dark" : "light");
    }
  });
}

// Inicializar el tema al cargar la página
initializeTheme();

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

// Script para el efecto de scroll en el navbar
const nav = document.querySelector(".main-nav");

if (nav) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
      nav.classList.add("scrolled");
      if (navLinks) {
        navLinks.classList.add("scrolled");
      }
    } else {
      nav.classList.remove("scrolled");
      if (navLinks) {
        navLinks.classList.remove("scrolled");
      }
    }
  });
}

// Script para el menú móvil
const mobileMenuButton = document.querySelector(".mobile-menu-button");
const navLinks = document.querySelector(".nav-links");

mobileMenuButton.addEventListener("click", () => {
  const isExpanded = mobileMenuButton.getAttribute("aria-expanded") === "true";
  mobileMenuButton.setAttribute("aria-expanded", !isExpanded);
  navLinks.classList.toggle("active");
});

// Script para actualizar el aria-current en la navegación
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-link");

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

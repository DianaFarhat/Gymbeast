
/* =============================== */
/*          Shared Layout          */
/* =============================== */

const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");

if (bar) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}

if (close) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}

function loadNavbarAndFooter() {
  document.addEventListener("DOMContentLoaded", function() {
    fetch("shared_layout.html")
      .then(response => response.text())
      .then(data => {
        // Create a temporary DOM parser
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");

        // Extract and insert navbar and footer content
        const navbar = doc.querySelector("nav").outerHTML;
        const footer = doc.querySelector("footer").outerHTML;

        // Inject into respective sections
        document.getElementById("header").innerHTML = navbar;
        document.getElementById("footer").innerHTML = footer;
      })
      .catch(error => {
        console.error('Error loading shared_layout.html:', error);
      });
  });
}

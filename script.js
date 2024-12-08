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

function loadNavbar(){
  document.addEventListener("DOMContentLoaded", function() {
    var header = document.getElementById("header");
    fetch("nav.html")
    .then(response => response.text())
    .then(data => {
        header.innerHTML = data;
    })
    .catch(error => {
        console.error('Error loading nav.html:', error);
    });
});
}

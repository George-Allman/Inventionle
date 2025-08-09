
const template = document.getElementById("settings-modal-template");
const clone = template.content.cloneNode(true);

const modalContainer = document.getElementById("modal-content");
modalContainer.innerHTML = '';
modalContainer.appendChild(clone);

// NOW safe to query it
const toggle = modalContainer.querySelector("#light-theme-toggle");

toggle.addEventListener("change", () => {

    log("Hello")

    // Optional: Save preference to localStorage
    //localStorage.setItem("theme", toggle.checked ? "light" : "dark");
});

// // On load, restore theme
// window.addEventListener("DOMContentLoaded", () => {
//   const savedTheme = localStorage.getItem("theme");
//   if (savedTheme === "light") {
//     document.body.classList.add("light-theme");
//     toggle.checked = true;
//   }
// });

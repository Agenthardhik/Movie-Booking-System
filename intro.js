// =========================
// BookNbite Intro Animation
// =========================

// Logo
const logo = document.querySelector(".logo");

// Icons
const icons = document.querySelectorAll(".icon");

// Light
const light = document.querySelector(".light");

// Loading Bar
const loading = document.querySelector(".loading");

// Animate Icons

icons.forEach((icon,index)=>{

icon.style.opacity="0";

setTimeout(()=>{

icon.style.transition="1s";

icon.style.opacity="1";

icon.style.transform="scale(1.2)";

setTimeout(()=>{

icon.style.transform="scale(1)";

},400);

},index*300);

});

// Light Flash

setTimeout(()=>{

light.style.transition="1s";
light.style.transform="scale(1.6)";
light.style.opacity=".9";

},1500);

// Logo Zoom

setTimeout(()=>{

logo.style.transform="scale(1.1)";

setTimeout(()=>{

logo.style.transform="scale(1)";

},500);

},2200);

// Fade Everything

setTimeout(()=>{

document.body.style.transition="1s";
document.body.style.opacity="0";

},3700);

// Go to Homepage

setTimeout(()=>{

window.location.href="index.html";

},4700);
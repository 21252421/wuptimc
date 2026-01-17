function copyIP() {
  navigator.clipboard.writeText("play.wuptimc.dk");
  alert("IP kopieret!");
}

// Server status
fetch("https://api.mcsrvstat.us/2/play.wuptimc.dk")
  .then(r => r.json())
  .then(d => {
    const el = document.getElementById("server-status");
    if (!el) return;
    el.innerText = d.online ? "Online" : "Offline";
    el.style.color = d.online ? "#3aa9ff" : "red";
  });

// Fade-in on scroll
function fadeIn() {
  document.querySelectorAll(".fade").forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add("show");
    }
  });
}

window.addEventListener("scroll", fadeIn);
fadeIn();


// Fake online counter animation
let online = 18;
const el = document.getElementById("online-big");
const topEl = document.getElementById("online-count");

setInterval(() => {
  online += Math.random() > 0.5 ? 1 : -1;
  if (online < 10) online = 10;
  if (online > 40) online = 40;

  el.innerText = online;
  topEl.innerText = online + " online";
}, 5000);

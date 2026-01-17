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

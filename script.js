// Backend URL (Render)
const API = "https://wuptimc-backend.onrender.com";

function copyIP(){
  navigator.clipboard.writeText("play.wuptimc.dk");
  alert("IP kopieret!");
}

// Minecraft server status
fetch("https://api.mcsrvstat.us/2/play.wuptimc.dk")
  .then(r => r.json())
  .then(d => {
    const el = document.getElementById("server-status");
    if (!el) return;
    el.innerText = d.online ? "Online" : "Offline";
  });

// 🔥 TEST BACKEND (VIGTIGT)
fetch(API)
  .then(r => r.text())
  .then(txt => {
    console.log("Backend svar:", txt);
  })
  .catch(err => {
    console.error("Backend fejl:", err);
  });

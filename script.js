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

const API = "https://wuptimc-backend.onrender.com";
let currentUser = null;

function openLogin() {
  document.getElementById("loginModal").style.display = "flex";
}

async function discordLogin() {
  const discordName = document.getElementById("discordName").value;

  const res = await fetch(API + "/login/discord", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ discordName })
  });

  currentUser = await res.json();
  document.getElementById("loginModal").style.display = "none";

  document.getElementById("userLabel").innerText =
    `Logget ind som ${currentUser.discordName}`;

  if (currentUser.role === "admin") {
    document.getElementById("adminLink").style.display = "inline";
  }
}

async function saveProfile() {
  const minecraftName = document.getElementById("mcName").value;
  const email = document.getElementById("email").value;

  const res = await fetch(API + "/profile/update", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      discordName: currentUser.discordName,
      minecraftName,
      email
    })
  });

  currentUser = await res.json();
  alert("Profil gemt!");
}

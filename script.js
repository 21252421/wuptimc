function copyIP(){
  navigator.clipboard.writeText("play.wuptimc.dk");
  alert("IP kopieret!");
}

fetch("https://api.mcsrvstat.us/2/play.wuptimc.dk")
  .then(r=>r.json())
  .then(d=>{
    document.getElementById("server-status").innerText =
      d.online ? "Online" : "Offline";
  });

const API = "https://DIT_BACKEND_URL";

function login(){
  location.href = API + "/auth/discord";
}

const id = new URLSearchParams(location.search).get("user");
if(id){
  fetch(API+"/me/"+id)
    .then(r=>r.json())
    .then(u=>{
      localStorage.setItem("user",JSON.stringify(u));
      document.getElementById("me").innerText =
        `Logget ind som ${u.discord_name} (${u.role})`;
    });
}

import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { db } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* ===== CONFIG ===== */
const OWNER_ID = "DIT_DISCORD_ID";
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = process.env.DISCORD_REDIRECT;

/* ===== HELPERS ===== */
function perms(role){
  return {
    owner:{admin:true,ban:true,appeal:true},
    admin:{admin:true,ban:true,appeal:true},
    mod:{admin:true,ban:true,appeal:true},
    helper:{admin:true},
    spiller:{}
  }[role]||{};
}

async function log(actor,action,target){
  await db.query(
    "INSERT INTO logs(actor,action,target) VALUES($1,$2,$3)",
    [actor,action,target]
  );
}

function auth(req,res,next){
  const id = req.headers.userid;
  if(!id) return res.sendStatus(401);
  req.uid = id;
  next();
}

async function isAdmin(req,res,next){
  const r = await db.query("SELECT role FROM users WHERE id=$1",[req.uid]);
  if(["owner","admin","mod"].includes(r.rows[0]?.role)) next();
  else res.sendStatus(403);
}

/* ===== DISCORD LOGIN ===== */
app.get("/auth/discord",(req,res)=>{
  res.redirect(
    `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`
  );
});

app.get("/auth/discord/callback", async (req,res)=>{
  const tokenRes = await fetch("https://discord.com/api/oauth2/token",{
    method:"POST",
    headers:{ "Content-Type":"application/x-www-form-urlencoded" },
    body:new URLSearchParams({
      client_id:CLIENT_ID,
      client_secret:CLIENT_SECRET,
      grant_type:"authorization_code",
      code:req.query.code,
      redirect_uri:REDIRECT_URI
    })
  });

  const token = await tokenRes.json();
  const userRes = await fetch("https://discord.com/api/users/@me",{
    headers:{ Authorization:`Bearer ${token.access_token}` }
  });

  const d = await userRes.json();
  const role = d.id===OWNER_ID?"owner":"spiller";

  await db.query(`
    INSERT INTO users(id,discord_name,role,permissions,first_login,last_login)
    VALUES($1,$2,$3,$4,NOW(),NOW())
    ON CONFLICT(id) DO UPDATE SET last_login=NOW()
  `,[d.id,d.username,role,perms(role)]);

  res.redirect(`${process.env.FRONTEND_URL}?user=${d.id}`);
});

/* ===== USER ===== */
app.get("/me/:id", async (req,res)=>{
  const r = await db.query("SELECT * FROM users WHERE id=$1",[req.params.id]);
  res.json(r.rows[0]);
});

/* ===== BANS ===== */
app.post("/admin/ban", auth, isAdmin, async (req,res)=>{
  const { userId, reason } = req.body;
  await db.query(
    "INSERT INTO bans(user_id,reason,banned_by) VALUES($1,$2,$3)",
    [userId,reason,req.uid]
  );
  await log(req.uid,"BAN",userId);
  res.json({ok:true});
});

app.get("/admin/bans", auth, isAdmin, async (req,res)=>{
  const r = await db.query("SELECT * FROM bans ORDER BY banned_at DESC");
  res.json(r.rows);
});

/* ===== APPEALS ===== */
app.post("/appeal", auth, async (req,res)=>{
  const { banId, message } = req.body;
  await db.query(
    "INSERT INTO ban_appeals(ban_id,user_id,message) VALUES($1,$2,$3)",
    [banId,req.uid,message]
  );
  res.json({ok:true});
});

app.get("/me/appeals", auth, async (req,res)=>{
  const r = await db.query(
    "SELECT * FROM ban_appeals WHERE user_id=$1 ORDER BY created_at DESC",
    [req.uid]
  );
  res.json(r.rows);
});

/* ===== LOGS ===== */
app.get("/admin/logs", auth, isAdmin, async (req,res)=>{
  const r = await db.query(
    "SELECT * FROM logs ORDER BY created_at DESC LIMIT 200"
  );
  res.json(r.rows);
});

app.listen(PORT,()=>console.log("WuptiMC backend kører"));

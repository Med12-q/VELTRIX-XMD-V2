"use strict";

const STATUS_LABELS = {
  disconnected: "Déconnecté",
  connecting: "Connexion en cours…",
  connected: "Connecté",
  pairing: "En attente de couplage…",
  qr_ready: "QR Code prêt",
  logged_out: "Session expirée",
  error: "Erreur",
};

let currentTab = "pairing";
let pollInterval = null;

function switchTab(tab) {
  currentTab = tab;
  document.getElementById("tabPairing").classList.toggle("active", tab === "pairing");
  document.getElementById("tabQr").classList.toggle("active", tab === "qr");
  document.getElementById("pairingPanel").style.display = tab === "pairing" ? "block" : "none";
  document.getElementById("qrPanel").style.display = tab === "qr" ? "block" : "none";
  if (tab === "qr") loadQr();
}

function updateStatusUI(data) {
  const dot = document.getElementById("statusDot");
  const text = document.getElementById("statusText");
  const sub = document.getElementById("statusSub");
  const badge = document.getElementById("statusBadge");

  const status = data.status || "disconnected";
  dot.className = "status-dot " + status;
  text.textContent = STATUS_LABELS[status] || status;
  badge.textContent = STATUS_LABELS[status] || status;
  badge.className = "status-badge badge-" + status;

  if (status === "connected") {
    sub.textContent = data.connectedName
      ? `+${data.connectedNumber} — ${data.connectedName}`
      : `+${data.connectedNumber || "inconnu"}`;
  } else if (status === "pairing") {
    sub.textContent = `Code envoyé pour +${data.pairingNumber || "—"}`;
  } else {
    sub.textContent = "En attente de connexion…";
  }

  document.getElementById("statNumber").textContent = data.connectedNumber ? `+${data.connectedNumber}` : "—";
  document.getElementById("statUptime").textContent = data.uptime || "—";
  document.getElementById("statCmds").textContent = data.commandCount ? `${data.commandCount} cmds` : "—";
  document.getElementById("statVersion").textContent = data.botVersion ? `v${data.botVersion}` : "—";

  const pairBtn = document.getElementById("pairBtn");
  if (status === "connected") {
    pairBtn.disabled = true;
    pairBtn.querySelector(".btn-text").textContent = "✅ Bot déjà connecté";
  } else {
    pairBtn.disabled = false;
    pairBtn.querySelector(".btn-text").textContent = "⚡ Obtenir le code de couplage";
  }
}

async function loadStatus() {
  try {
    const res = await fetch("/api/status");
    if (!res.ok) throw new Error("Erreur serveur");
    const data = await res.json();
    updateStatusUI(data);
  } catch (e) {
    document.getElementById("statusText").textContent = "Erreur de connexion";
    document.getElementById("statusSub").textContent = e.message;
  }
}

async function requestPair() {
  const phoneInput = document.getElementById("phoneInput");
  const pairBtn = document.getElementById("pairBtn");
  const alertBox = document.getElementById("pairAlert");
  const codeBox = document.getElementById("pairingCodeBox");
  const codeValue = document.getElementById("pairingCodeValue");

  const number = phoneInput.value.replace(/[^0-9]/g, "");
  if (number.length < 7) {
    showAlert(alertBox, "error", "❌ Numéro invalide. Format international sans +, ex: 224669288332");
    return;
  }

  pairBtn.classList.add("loading");
  pairBtn.disabled = true;
  alertBox.classList.remove("show");

  try {
    const res = await fetch("/api/pair", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number }),
    });
    const data = await res.json();

    if (!res.ok) {
      showAlert(alertBox, "error", "❌ " + (data.error || "Erreur inconnue"));
    } else {
      codeValue.textContent = data.code || "—";
      codeBox.classList.add("show");
      showAlert(alertBox, "success", "✅ Code généré ! Entre-le dans WhatsApp → Appareils liés.");
    }
  } catch (e) {
    showAlert(alertBox, "error", "❌ Impossible de joindre le serveur : " + e.message);
  } finally {
    pairBtn.classList.remove("loading");
    pairBtn.disabled = false;
  }
}

async function loadQr() {
  const img = document.getElementById("qrImage");
  const msgEl = document.getElementById("qrMsg");
  try {
    const res = await fetch("/api/qr");
    const data = await res.json();
    if (data.qr) {
      img.src = data.qr;
      img.style.display = "block";
      msgEl.textContent = "Scanne ce QR avec WhatsApp → Appareils liés → Lier un appareil";
    } else {
      img.style.display = "none";
      msgEl.textContent = data.message || "Pas de QR disponible. Utilise le code de couplage.";
    }
  } catch (e) {
    img.style.display = "none";
    msgEl.textContent = "Erreur lors du chargement du QR : " + e.message;
  }
}

async function disconnectBot() {
  if (!confirm("Déconnecter le bot de WhatsApp ?")) return;
  try {
    const res = await fetch("/api/disconnect", { method: "POST" });
    const data = await res.json();
    alert(data.message || "Déconnexion envoyée.");
    setTimeout(loadStatus, 2000);
  } catch (e) {
    alert("Erreur : " + e.message);
  }
}

function showAlert(el, type, msg) {
  el.className = "alert alert-" + type + " show";
  el.textContent = msg;
  if (type !== "error") {
    setTimeout(() => el.classList.remove("show"), 8000);
  }
}

phoneInput && phoneInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") requestPair();
});

document.addEventListener("DOMContentLoaded", () => {
  loadStatus();
  pollInterval = setInterval(loadStatus, 5000);
});

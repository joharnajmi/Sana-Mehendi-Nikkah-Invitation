// ---------- Side-only natural rose petals ----------
const masterPetalColors=["white","pink","purple","red"];
function createMasterPetals(id,count){
  const lane=document.getElementById(id); if(!lane) return;
  for(let i=0;i<count;i++){
    const p=document.createElement("span");
    p.className=`rose-petal ${masterPetalColors[Math.floor(Math.random()*masterPetalColors.length)]}`;
    const s=7+Math.random()*13;
    p.style.width=`${s}px`; p.style.height=`${s*1.35}px`;
    p.style.left=`${Math.random()*90}%`;
    p.style.animationDuration=`${7+Math.random()*9}s`;
    p.style.animationDelay=`${-Math.random()*15}s`;
    p.style.setProperty("--drift",`${-22+Math.random()*44}px`);
    p.style.opacity=`${.35+Math.random()*.5}`; lane.appendChild(p);
  }
}
const petalMobile=window.matchMedia("(max-width:560px)").matches;
createMasterPetals("homePetalsLeft",petalMobile?10:26);
createMasterPetals("homePetalsRight",petalMobile?10:26);
createMasterPetals("schedulePetalsLeft",petalMobile?8:22);
createMasterPetals("schedulePetalsRight",petalMobile?8:22);
createMasterPetals("eventPetalsLeft",petalMobile?8:22);
createMasterPetals("eventPetalsRight",petalMobile?8:22);

// ============================================================
// Johar & Sana Wedding Website
// Main celebration: Friday, 9 October 2026, 7:00 PM PKT
// Pakistan Standard Time = UTC+05:00
// ============================================================

const MAIN_EVENT = new Date("2026-10-09T19:00:00+05:00");


// ---------------- Sealed envelope entrance ----------------
const envelopeGate = document.getElementById("envelopeGate");
const envelopeStage = document.getElementById("envelopeStage");
const waxSeal = document.getElementById("waxSeal");

function revealInvitation() {
  if (!envelopeGate || !envelopeStage || document.body.classList.contains("invitation-open")) return;

  envelopeStage.classList.add("is-opening");
  waxSeal?.setAttribute("disabled", "disabled");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealDelay = reducedMotion ? 250 : 2350;
  const gateDelay = reducedMotion ? 350 : 3150;

  window.setTimeout(() => {
    document.body.classList.remove("invitation-locked");
    document.body.classList.add("invitation-open");
    envelopeStage.classList.add("finish-opening");
  }, revealDelay);

  window.setTimeout(() => {
    envelopeGate.classList.add("opened");
    document.getElementById("home")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }, gateDelay);
}

if (waxSeal) {
  waxSeal.addEventListener("click", revealInvitation);
}



function pad(value) {
  return String(value).padStart(2, "0");
}

function getRemaining(target) {
  const diff = target.getTime() - Date.now();

  if (diff <= 0) {
    return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    done: false,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000)
  };
}

// ---------------- Main countdown ----------------
function updateMainCountdown() {
  const container = document.getElementById("mainCountdown");
  const completeMessage = document.getElementById("mainCountdownDone");

  if (!container || !completeMessage) return;

  const t = getRemaining(MAIN_EVENT);

  if (t.done) {
    container.hidden = true;
    completeMessage.hidden = false;
    return;
  }

  container.hidden = false;
  completeMessage.hidden = true;

  container.querySelector('[data-unit="days"]').textContent = pad(t.days);
  container.querySelector('[data-unit="hours"]').textContent = pad(t.hours);
  container.querySelector('[data-unit="minutes"]').textContent = pad(t.minutes);
  container.querySelector('[data-unit="seconds"]').textContent = pad(t.seconds);
}

// ---------------- Individual countdowns ----------------
function updateMiniCountdowns() {
  document.querySelectorAll(".mini-countdown").forEach((box) => {
    const target = new Date(box.dataset.countdown);
    const output = box.querySelector("strong");
    const t = getRemaining(target);

    if (t.done) {
      output.textContent = "Celebration time!";
      return;
    }

    output.textContent =
      `${t.days} Days • ${pad(t.hours)} Hours • ${pad(t.minutes)} Minutes • ${pad(t.seconds)} Seconds`;
  });
}

// ---------------- Mobile navigation ----------------
const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

// ---------------- Scroll reveal ----------------
const revealTargets = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("visible"));
}

// ---------------- Direct MP3 wedding music ----------------
// Native HTML5 audio is more reliable on mobile browsers and in-app browsers.
// Playback begins only after a guest taps the music button.
const musicButton = document.getElementById("musicButton");
const weddingAudio = document.getElementById("weddingAudio");

if (musicButton && weddingAudio) {
  weddingAudio.volume = 0.85;

  const setMusicButton = (playing) => {
    musicButton.textContent = playing ? "♫ Music Playing" : "♫ Play Music";
    musicButton.classList.toggle("playing", playing);
    musicButton.setAttribute("aria-pressed", playing ? "true" : "false");
  };

  musicButton.addEventListener("click", async () => {
    try {
      if (weddingAudio.paused) {
        await weddingAudio.play();
        setMusicButton(true);
      } else {
        weddingAudio.pause();
        setMusicButton(false);
      }
    } catch (error) {
      setMusicButton(false);
      console.warn("Music playback was blocked by the browser:", error);
    }
  });

  weddingAudio.addEventListener("pause", () => setMusicButton(false));
  weddingAudio.addEventListener("play", () => setMusicButton(true));
  weddingAudio.addEventListener("ended", () => setMusicButton(false));
}

// ---------------- RSVP placeholders ----------------
// EDIT the href values in index.html when phone numbers are available.
document.querySelectorAll(".placeholder-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.getAttribute("href") === "#") {
      event.preventDefault();
      alert(`Contact details for ${link.dataset.person} can be added here.`);
    }
  });
});

// ---------------- Add to calendar (.ics) ----------------
function escapeICS(text = "") {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function downloadICS(button) {
  const nowStamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Johar & Sana Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${Date.now()}-${Math.random().toString(36).slice(2)}@johar-sana`,
    `DTSTAMP:${nowStamp}`,
    `DTSTART:${button.dataset.start}`,
    `DTEND:${button.dataset.end}`,
    `SUMMARY:${escapeICS(button.dataset.title)}`,
    `LOCATION:${escapeICS(button.dataset.location)}`,
    `DESCRIPTION:${escapeICS(button.dataset.description || "")}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ];

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${button.dataset.title.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

document.querySelectorAll(".calendar-btn").forEach((button) => {
  button.addEventListener("click", () => downloadICS(button));
});

// ---------------- Initial render ----------------
updateMainCountdown();
updateMiniCountdowns();

setInterval(updateMainCountdown, 1000);
setInterval(updateMiniCountdowns, 1000);

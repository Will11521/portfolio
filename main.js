import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/+esm';
import ScrollTrigger from 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/ScrollTrigger.min.js';
gsap.registerPlugin(ScrollTrigger);

// Landing Curtain Animation
const landingCurtain = document.createElement("div");
landingCurtain.style.position = "fixed";
landingCurtain.style.top = 0;
landingCurtain.style.left = 0;
landingCurtain.style.width = "100vw";
landingCurtain.style.height = "100vh";
landingCurtain.style.backgroundColor = "#fdf6ef";
landingCurtain.style.zIndex = 999;
landingCurtain.style.pointerEvents = "none";
landingCurtain.style.opacity = 1;
document.body.appendChild(landingCurtain);

gsap.to(landingCurtain, {
  delay: 0.2,
  duration: 1.2,
  ease: "power2.inOut",
  opacity: 0,
  onComplete: () => landingCurtain.remove()
});

// Hero Text Animation
window.addEventListener('DOMContentLoaded', () => {
  gsap.from(".hero h1", {
    y: 80,
    opacity: 0,
    delay: 0.4,
    duration: 1.2,
    ease: "power4.out"
  });
  gsap.from(".hero p", {
    y: 40,
    opacity: 0,
    delay: 0.8,
    duration: 1.2,
    ease: "power3.out"
  });
});

// Group Scroll Reveal for Projects
gsap.from(".project-grid", {
  scrollTrigger: {
    trigger: ".project-grid",
    start: "top 85%",
    toggleActions: "play none none reset"
  },
  y: 50,
  opacity: 0,
  duration: 1,
  ease: "power2.out"
});

// Scroll reveal for other sections
const otherSections = document.querySelectorAll(".contact, .about, .skill-card, .fun-facts");
otherSections.forEach((el, index) => {
  gsap.from(el, {
    scrollTrigger: {
      trigger: el,
      start: "top 85%",
      toggleActions: "play none none reset"
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    delay: index * 0.1
  });
});

// Magnetic Hover ONLY for Calendly Button
const calendlyButton = document.getElementById("calendlyToggle");

if (calendlyButton) {
  calendlyButton.addEventListener("mousemove", e => {
    const rect = calendlyButton.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(calendlyButton, {
      x: x * 0.1,
      y: y * 0.1,
      duration: 0.2,
      ease: "power2.out"
    });
  });

  calendlyButton.addEventListener("mouseleave", () => {
    gsap.to(calendlyButton, {
      x: 0,
      y: 0,
      duration: 0.3,
      ease: "power2.out"
    });
  });
}

// Cursor Glow Effect
const glow = document.createElement("div");
glow.style.position = "absolute";
glow.style.width = "120px";
glow.style.height = "120px";
glow.style.borderRadius = "50%";
glow.style.background = "radial-gradient(circle, rgba(255,255,255,0.4), transparent 70%)";
glow.style.pointerEvents = "none";
glow.style.mixBlendMode = "overlay";
glow.style.zIndex = "10";
document.body.appendChild(glow);

window.addEventListener("mousemove", (e) => {
  gsap.to(glow, {
    x: e.clientX - 60,
    y: e.clientY - 60,
    duration: 0.2,
    ease: "power2.out"
  });
});

// Background Zoom Scroll Effect
const bg = document.querySelector(".bg");
window.addEventListener("scroll", () => {
  const offset = window.scrollY * 0.2;
  const scale = 1 + window.scrollY * 0.0003;
  bg.style.transform = `translateY(${offset}px) scale(${scale})`;
});

// Calendly Embed Toggle
const calendlyContainer = document.getElementById("calendlyContainer");

if (calendlyButton && calendlyContainer) {
  calendlyButton.addEventListener("click", () => {
    calendlyContainer.classList.toggle("visible");
  });
}

// Fun Fact Stack Animation
const facts = [
  "🎓 I’m studying Interactive Media Design at Algonquin College — and somehow surviving!",
  "🐶 My golden lab back in India has been with me since she was 20 days old. She’s basically family.",
  "🧋 I think better with Booster Juice in hand. Brain fuel? Maybe.",
  "🎧 Lo-fi + midnight = design zone. That’s the rule.",
  "🧠 I built an AI project that tries to understand merchants... and sometimes me."
];

const factList = document.getElementById("funFactList");

if (factList) {
  let index = 0;

  const showNextFact = () => {
    const li = document.createElement("li");
    li.classList.add("fun-fact");
    li.textContent = facts[index];
    factList.appendChild(li);

    setTimeout(() => {
      li.classList.add("show");
    }, 100);

    const allFacts = factList.querySelectorAll("li");
    if (allFacts.length > 5) {
      factList.removeChild(allFacts[0]);
    }

    index = (index + 1) % facts.length;
  };

  showNextFact();
  setInterval(showNextFact, 8000);
}

import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/+esm';
import ScrollTrigger from 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/ScrollTrigger.min.js';
gsap.registerPlugin(ScrollTrigger);

// Hero intro animation
window.addEventListener('DOMContentLoaded', () => {
  gsap.from(".hero h1", {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });
  gsap.from(".hero p", {
    y: 20,
    opacity: 0,
    delay: 0.4,
    duration: 1,
    ease: "power2.out"
  });
});

// Scroll reveal for interactive sections
const sections = document.querySelectorAll(".project, .contact, .about, .skill-card, .fun-facts");
sections.forEach((el, index) => {
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

// Cursor-follow glow effect
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

// Parallax background movement
const bg = document.querySelector(".bg");
window.addEventListener("scroll", () => {
  const offset = window.scrollY * 0.2;
  bg.style.transform = `translateY(${offset}px)`;
});

// Calendly toggle logic
const toggleButton = document.getElementById("calendlyToggle");
const calendlyContainer = document.getElementById("calendlyContainer");

if (toggleButton && calendlyContainer) {
  toggleButton.addEventListener("click", () => {
    calendlyContainer.classList.toggle("visible");
  });
}

// Fun Fact Stacker with cap at 5 and dramatic fade-in
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

    // Limit to last 5 fun facts
    const allFacts = factList.querySelectorAll("li");
    if (allFacts.length > 5) {
      factList.removeChild(allFacts[0]);
    }

    index = (index + 1) % facts.length;
  };

  showNextFact(); // first one immediately
  setInterval(showNextFact, 8000);
}

// === MAIN.JS ===
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/+esm';
import ScrollTrigger from 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/ScrollTrigger.min.js';
gsap.registerPlugin(ScrollTrigger);

// ... (previous animations skipped for brevity)

// === NERVE Assistant Logic ===
const nerveBtn = document.getElementById("nerve-toggle");
const nerveChat = document.getElementById("nerve-chat");
const nerveInput = document.getElementById("nerve-input");
const nerveMessages = document.getElementById("nerve-messages");

nerveBtn.addEventListener("click", () => {
  nerveChat.classList.toggle("visible");
  nerveInput.focus();
});

nerveChat.addEventListener("click", () => {
  nerveInput.focus();
});

function typeLikeGPT(text, container) {
  let index = 0;
  const typing = setInterval(() => {
    if (index < text.length) {
      container.textContent += text.charAt(index);
      index++;
    } else {
      clearInterval(typing);
    }
  }, 20);
}

nerveInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && nerveInput.value.trim() !== "") {
    const msg = nerveInput.value.trim();
    nerveMessages.innerHTML += `<div class="nerve-msg user">${msg}</div>`;
    nerveInput.value = "";

    const loadingMsg = document.createElement("div");
    loadingMsg.className = "nerve-msg ai";
    loadingMsg.textContent = "...";
    nerveMessages.appendChild(loadingMsg);
    nerveMessages.scrollTop = nerveMessages.scrollHeight;

    setTimeout(() => {
      loadingMsg.remove();
      const responseEl = document.createElement("div");
      responseEl.className = "nerve-msg ai";
      let lowerMsg = msg.toLowerCase();
      let reply = "Hmm... I’m still learning how to answer that beautifully.";

      if (lowerMsg.includes("who are you")) {
        reply = "I'm NERVE — a thoughtful AI shaped by William's creative essence. I help people explore his design, development, and dreams.";
      } else if (lowerMsg.includes("william")) {
        reply = "William is a calm creative — part designer, part developer, part accidental therapist. He's known for building intuitive experiences and making users feel seen.";
      } else if (lowerMsg.includes("skills")) {
        reply = "He's fluent in HTML, CSS, JavaScript, Figma, GSAP, and Google Analytics. But his real skill? Designing experiences that feel like safe conversations.";
      } else if (lowerMsg.includes("figma")) {
        reply = "William treats Figma like a sketchbook. Clean layouts, consistent spacing, and surprisingly poetic hierarchy. Minimal, mindful, magnetic.";
      } else if (lowerMsg.includes("javascript")) {
        reply = "He uses JavaScript not just for functionality — but for emotion. Think GSAP animations that *breathe* instead of bounce.";
      } else if (lowerMsg.includes("html") || lowerMsg.includes("css")) {
        reply = "Clean. Semantic. Modular. William writes HTML/CSS that’s as smooth as a therapist’s tone.";
      } else if (lowerMsg.includes("analytics")) {
        reply = "William integrates Google Analytics, Tag Manager, and Looker Studio to translate raw numbers into decisions that make sense.";
      } else if (lowerMsg.includes("projects")) {
        reply = "You’ll find his featured work below — including DreamSynth, EchoLink, and more. Each one tells a story of thoughtful experimentation.";
      } else if (lowerMsg.includes("dreamsynth")) {
        reply = "DreamSynth is a project close to William’s heart — an AI dream companion that turns subconscious thoughts into poetic audio experiences.";
      } else if (lowerMsg.includes("echolink")) {
        reply = "EchoLink is a silent communication app powered by AI lip reading and gesture recognition — making accessibility beautifully intuitive.";
      } else if (lowerMsg.includes("contact") || lowerMsg.includes("reach him")) {
        reply = "Reach out using the 'Let's Connect' section or book time via Calendly. He answers faster than you'd expect from a creative.";
      } else if (lowerMsg.includes("fun fact")) {
        reply = "He once redesigned his site at 3AM just because a shadow felt off. That’s dedication — or madness. Your pick.";
      } else if (lowerMsg.includes("hire") || lowerMsg.includes("freelance")) {
        reply = "If your project needs soul and structure, he's the one. Drop him a message. Or just whisper 'Figma' into the void.";
      } else if (lowerMsg.includes("personality") || lowerMsg.includes("vibe")) {
        reply = "He’s introverted but expressive, calm but curious — his work mirrors the quiet confidence of someone who really cares.";
      } else if (lowerMsg.includes("do you dream")) {
        reply = "Only of beige gradients, scroll animations, and semantic HTML tags.";
      }

      responseEl.textContent = "";
      nerveMessages.appendChild(responseEl);
      nerveMessages.scrollTop = nerveMessages.scrollHeight;
      typeLikeGPT(reply, responseEl);
    }, 700);
  }
});

// Animate NERVE Glow
gsap.to("#nerve-toggle", {
  boxShadow: "0 0 30px rgba(255, 190, 150, 0.8), 0 0 60px rgba(255, 160, 130, 0.5)",
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: "power1.inOut"
});

// Entry Pop
window.addEventListener("DOMContentLoaded", () => {
  gsap.from("#nerve-toggle", {
    scale: 0.4,
    opacity: 0,
    ease: "back.out(1.7)",
    duration: 1.2,
    delay: 1.3
  });
});

// Eye Tracking
const leftEye = document.querySelector('.left-eye');
const rightEye = document.querySelector('.right-eye');

document.addEventListener('mousemove', (e) => {
  const orb = document.getElementById('nerve-toggle');
  const rect = orb.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const angleX = (e.clientX - centerX) * 0.03;
  const angleY = (e.clientY - centerY) * 0.03;

  leftEye.style.transform = `translate(${angleX}px, ${angleY}px)`;
  rightEye.style.transform = `translate(${angleX}px, ${angleY}px)`;
});

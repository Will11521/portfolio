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
    const userMsg = document.createElement("div");
    userMsg.className = "nerve-msg user";
    userMsg.textContent = msg;
    nerveMessages.appendChild(userMsg);
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
      let lowerMsg = msg.toLowerCase().trim();
      
      // Intent parsing rules
      let intent = "unknown";
      let projectName = "";
      
      if (lowerMsg.includes("about") || lowerMsg.includes("who") || lowerMsg.includes("william")) {
        intent = "about";
      } else if (lowerMsg.includes("skills") || lowerMsg.includes("tools") || lowerMsg.includes("tech")) {
        intent = "skills";
      } else if (lowerMsg.includes("projects") && !lowerMsg.includes("project:")) {
        intent = "projects";
      } else if (lowerMsg.startsWith("project:")) {
        intent = "project";
        projectName = lowerMsg.replace("project:", "").trim();
      } else if (lowerMsg.includes("contact") || lowerMsg.includes("reach") || lowerMsg.includes("email") || lowerMsg.includes("phone")) {
        intent = "contact";
      } else if (lowerMsg.includes("recruiter") || lowerMsg.includes("hire") || lowerMsg.includes("job") || lowerMsg.includes("resume")) {
        intent = "recruiter";
      } else if (lowerMsg.includes("fun") || lowerMsg.includes("fact") || lowerMsg.includes("interesting")) {
        intent = "funfacts";
      } else if (lowerMsg.includes("help") || lowerMsg.includes("what") || lowerMsg.includes("can you")) {
        intent = "help";
      } else if (lowerMsg.includes("analytics") || lowerMsg.includes("dreamsynth") || lowerMsg.includes("echolink") || lowerMsg.includes("therapy") || lowerMsg.includes("system")) {
        intent = "project";
        projectName = lowerMsg;
      }

      let reply = "";
      let showQuickReplies = false;
      let quickReplies = [];

      switch (intent) {
        case "about":
          reply = "William is a designer and developer studying Interactive Media Design at Algonquin College. He builds user-centered digital experiences with clean code and thoughtful design.";
          break;
          
        case "skills":
          reply = "Technical skills: HTML5, CSS3, JavaScript, Figma, GSAP, Google Analytics, UX Strategy, GitHub. Focuses on creating accessible, performant interfaces.";
          break;
          
        case "projects":
          reply = "Featured projects:\n• Analytics Dashboard — Real-time merchant insights\n• EchoLink — Silent communication with AI\n• Online Therapy Website — Mental health support\n• The System — CSS-based space exploration\n• DreamSynth — AI dream journaling & sleep stories";
          showQuickReplies = true;
          quickReplies = ["Analytics Dashboard", "EchoLink", "Online Therapy", "The System", "DreamSynth"];
          break;
          
        case "project":
          if (projectName.includes("analytics")) {
            reply = "Analytics Dashboard:\n• Real-time merchant insights\n• Data visualization for decision-making\n• Built with modern web technologies\n\nOpen: https://will11521.github.io/analytics-by-william/";
          } else if (projectName.includes("echolink")) {
            reply = "EchoLink:\n• Silent communication with AI lip reading\n• Gesture recognition for accessibility\n• Intuitive interface design\n\nExplore: https://www.figma.com/proto/qtE2hczc0tLQzhd4pDeMxG/Untitled?node-id=2-37&starting-point-node-id=2%3A37";
          } else if (projectName.includes("therapy")) {
            reply = "Online Therapy Website:\n• Mental health support platform\n• Built with HTML + CSS\n• Accessible, calming design\n\nVisit: https://will11521.github.io/mtm6201_final/";
          } else if (projectName.includes("system")) {
            reply = "The System:\n• CSS-based space exploration\n• Interactive planet navigation\n• Pure CSS animations and effects\n\nOrbit: https://will11521.github.io/MidT/";
          } else if (projectName.includes("dreamsynth")) {
            reply = "DreamSynth:\n• AI-powered dream journaling\n• Emotion tracking & sleep stories\n• Audio experience platform\n\nExperience: https://will11521.github.io/dreamsynth-frontend/";
          } else {
            reply = "I can tell you about: Analytics Dashboard, EchoLink, Online Therapy, The System, or DreamSynth. Which one interests you?";
          }
          break;
          
        case "contact":
          reply = "Contact William:\n📧 Email: williamjeetsingh2004@gmail.com\n📞 Phone: +1 (437) 872-1500\n\nI'll reveal the booking calendar for you...";
          // Reveal Calendly container
          const calendlyContainer = document.getElementById("calendlyContainer");
          if (calendlyContainer) {
            calendlyContainer.classList.add("visible");
          }
          break;
          
        case "recruiter":
          reply = "William — Designer & Developer\n\nCore Skills: HTML5, CSS3, JavaScript, Figma, GSAP, Google Analytics, UX Strategy\n\nFeatured Projects:\n• DreamSynth — AI dream journaling platform\n• Analytics Dashboard — Real-time merchant insights\n• EchoLink — Silent communication with AI lip reading\n\nContact:\n📧 Email: williamjeetsingh2004@gmail.com\n📅 Book Call: https://calendly.com/williamjeetsingh2004\n📄 Resume: Click to view my resume";
          break;
          
        case "funfacts":
          reply = "About William:\n• Studying Interactive Media Design at Algonquin College\n• Has a golden lab back in India since she was 20 days old\n• Thinks better with Booster Juice in hand\n• Best ideas come when trying to sleep\n• Built DreamSynth from a lucid dream";
          break;
          
        case "help":
          reply = "I can help with:\n• about — Learn about William\n• skills — See his technical skills\n• projects — Browse featured work\n• project:[name] — Get details on specific projects\n• contact — Get contact information\n• recruiter — Recruiter-focused summary\n• funfacts — Interesting tidbits\n• help — Show this menu";
          break;
          
        default:
          reply = "I'm not sure how to help with that. Try: about, skills, projects, contact, recruiter, funfacts, or help.";
          showQuickReplies = true;
          quickReplies = ["about", "skills", "projects", "contact", "help"];
      }

      responseEl.textContent = "";
      nerveMessages.appendChild(responseEl);
      nerveMessages.scrollTop = nerveMessages.scrollHeight;
      typeLikeGPT(reply, responseEl);
      
      // Add resume click handler for recruiter intent
      if (intent === "recruiter") {
        setTimeout(() => {
          const resumeText = responseEl.textContent;
          if (resumeText.includes("Click to view my resume")) {
            responseEl.innerHTML = resumeText.replace(
              "Click to view my resume", 
              '<span style="color: #d4a373; cursor: pointer; text-decoration: underline;" id="resume-link">Click to view my resume</span>'
            );
            
            // Add click event listener
            const resumeLink = document.getElementById("resume-link");
            if (resumeLink) {
              resumeLink.addEventListener("click", () => {
                window.open("Williamjeet Singh.pdf", "_blank");
              });
            }
          }
        }, reply.length * 20 + 500);
      }
      
      // Add quick reply chips if needed
      if (showQuickReplies && quickReplies.length > 0) {
        setTimeout(() => {
          const quickReplyContainer = document.createElement("div");
          quickReplyContainer.className = "quick-replies";
          quickReplyContainer.style.marginTop = "10px";
          quickReplyContainer.style.display = "flex";
          quickReplyContainer.style.flexWrap = "wrap";
          quickReplyContainer.style.gap = "8px";
          
          quickReplies.forEach(replyText => {
            const chip = document.createElement("button");
            chip.textContent = replyText;
            chip.className = "quick-reply-chip";
            chip.style.cssText = `
              background: #fce8dc;
              border: 1px solid #d4a373;
              border-radius: 16px;
              padding: 4px 12px;
              font-size: 12px;
              cursor: pointer;
              color: #5b4134;
              transition: all 0.2s ease;
            `;
            
            chip.addEventListener("mouseenter", () => {
              chip.style.background = "#d4a373";
              chip.style.color = "white";
            });
            
            chip.addEventListener("mouseleave", () => {
              chip.style.background = "#fce8dc";
              chip.style.color = "#5b4134";
            });
            
            chip.addEventListener("click", () => {
              if (intent === "projects") {
                // Smooth scroll to projects section
                const projectsSection = document.querySelector(".projects");
                if (projectsSection) {
                  projectsSection.scrollIntoView({ behavior: "smooth" });
                }
              } else {
                // Simulate typing the quick reply
                nerveInput.value = replyText;
                nerveInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
              }
              // Return focus to input after click
              nerveInput.focus();
            });
            
            // Handle keyboard navigation for chips
            chip.addEventListener("keydown", (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                chip.click();
              }
            });
            
            quickReplyContainer.appendChild(chip);
          });
          
          responseEl.appendChild(quickReplyContainer);
        }, reply.length * 20 + 500);
      }
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
// === Fun Facts Logic ===
window.addEventListener("DOMContentLoaded", () => {
  const facts = [
    "🎓 I’m studying Interactive Media Design at Algonquin College — and somehow surviving!",
    "🐶 My golden lab back in India has been with me since she was 20 days old. She’s basically family.",
    "🧋 I think better with Booster Juice in hand. Brain fuel? Maybe.",
    "🎧 Lo-fi + midnight = design zone. That’s the rule.",
    "🧠 I built an AI project that tries to understand merchants... and sometimes me.",
    "🛠 I once refactored a site just because a border-radius looked ‘too sharp’.",
    "💡 My best ideas come when I’m trying to sleep — naturally.",
    "🔮 DreamSynth was born out of a lucid dream. Seriously.",
    "🌙 I believe in emotionally intelligent design — interfaces should feel like safe spaces."
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
    setInterval(showNextFact, 3000); // 5 seconds
  }
});

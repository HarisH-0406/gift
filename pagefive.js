/* =====================================================
   PAGE 5 — CELEBRATION LOGIC
===================================================== */
let bubbleInterval = null;
let waveIntensity = 1;
let celebrationStarted = false;

function startCelebrationSequence() {
  const blackScreen = document.getElementById("blackScreen");
  const blackText = document.getElementById("blackText");
  const content = document.getElementById("celebrationContent");

  const lines = [
    "Wait...",
    "Today isn't just another day...",
    "It's the day my favorite person was born.",
  ];

  let index = 0;

  function showNextLine() {
    if (index < lines.length) {
      blackText.style.opacity = "0";

      setTimeout(() => {
        blackText.innerText = lines[index];
        blackText.style.opacity = "1";

        // Stay visible longer
        setTimeout(() => {
          blackText.style.opacity = "0";
          index++;

          setTimeout(showNextLine, 1000);
        }, 2600); // longer hold
      }, 300);
    } else {
      revealCelebration();
    }
  }

  showNextLine();

  function revealCelebration() {
    blackScreen.classList.add("hide");

    setTimeout(() => {
      content.classList.add("show");

      // Strong Confetti Burst
      confetti({
        particleCount: 1000,
        spread: 130,
        origin: { y: 0.6 },
      });

      spawnEmoji("❤️");

      // Continuous Soft Confetti
      let confettiCount = 0;

      const interval = setInterval(() => {
        confetti({
          particleCount: 90,
          spread: 90,
          origin: { y: 0.6 },
        });

        confettiCount++;

        if (confettiCount >= 5) {
          // 7 bursts = 14 seconds
          clearInterval(interval);
        }
      }, 1500);
    }, 1500);
  }
}

/* Trigger when entering slide 5 */
const originalNextSlide = nextSlide;

nextSlide = function () {
  originalNextSlide();

  if (currentSlide === 4 && !celebrationStarted) {
    celebrationStarted = true;
    startCelebrationSequence();
  }
};

function launchFinalBurst() {
  confetti({
    particleCount: 300,
    spread: 150,
    origin: { y: 0.6 },
  });
}

function startLoveLoader() {
  // =========================================
  // BASIC ELEMENT REFERENCES
  // =========================================
  const loader = document.getElementById("loveLoader");
  const waveGroup = document.getElementById("waveGroup");
  const bar = document.getElementById("loveBarFill");

  loader.style.display = "flex";

  // =========================================
  // START STRIPED LOADING BAR
  // =========================================
  setTimeout(() => {
    bar.style.width = "100%";
  }, 100);

  // =========================================
  // 🌊 SOFT FLAG-LIKE WAVE
  // =========================================
  let waveOffset = 0;

  function animateWave() {
    const wave = document.getElementById("wavePath");
    const shine = document.getElementById("waveShine");

    waveOffset += 0.4; // slower horizontal speed

    const amplitude = 25 * waveIntensity; // smaller height (less aggressive)

    const waveY = 25 - amplitude * Math.sin(waveOffset / 30);

    const waveData = `
  M0 25
  Q50 ${waveY} 100 25
  T200 25
  V180 H0 Z
`;

    const shineData = `
  M0 25
  Q50 ${waveY} 100 25
  T200 25
`;

    wave.setAttribute("d", waveData);
    shine.setAttribute("d", shineData);

    requestAnimationFrame(animateWave);
  }
  // Start wave movement immediately
  animateWave();

  // =========================================
  // 🫧 BUBBLE SYSTEM
  // =========================================

  const bubbleLayer = document.getElementById("bubbleLayer");

  function createBubble() {
    const bubble = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );

    const startX = 30 + Math.random() * 140;
    const startY = 175;
    const size = 3 + Math.random() * 3;

    bubble.setAttribute("cx", startX);
    bubble.setAttribute("cy", startY);
    bubble.setAttribute("r", size);
    //bubble inner color
    bubble.setAttribute("fill", "rgba(255,255,255,0.6)");
    bubble.setAttribute("stroke", "rgba(255,255,255,0.8)");
    bubble.setAttribute("stroke-width", "0.8");

    bubble.setAttribute("stroke", "#ff4fa3");
    bubble.setAttribute("stroke-width", "0.5");

    bubbleLayer.appendChild(bubble);
    //bubble speed
    let riseSpeed = 1.2 + Math.random() * 0.5;
    let currentY = startY;

    let drift = (Math.random() - 0.5) * 0.4;
    let currentX = startX;

    function animateBubble() {
      const waveTransform = waveGroup.getAttribute("transform");
      const translateY = parseFloat(
        waveTransform.split(",")[1].replace(")", ""),
      );

      const surfaceY = translateY + 25; // wave surface level

      currentY -= riseSpeed;
      currentX += drift;
      bubble.setAttribute("cy", currentY);
      bubble.setAttribute("cx", currentX); //s-wave bubbke motion

      let currentR = parseFloat(bubble.getAttribute("r"));
      bubble.setAttribute("r", currentR + 0.02);

      // Burst exactly when reaching surface
      if (currentY <= surfaceY) {
        burstBubble(bubble);
        return;
      }

      requestAnimationFrame(animateBubble);
    }
    requestAnimationFrame(animateBubble);
  }

  function burstBubble(bubble) {
    const burst = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );

    burst.setAttribute("cx", bubble.getAttribute("cx"));
    burst.setAttribute("cy", bubble.getAttribute("cy"));
    burst.setAttribute("r", 2);
    burst.setAttribute("fill", "none");
    burst.setAttribute("stroke", "rgba(255,255,255,0.8)");
    burst.setAttribute("stroke-width", "1");

    bubbleLayer.removeChild(bubble);
    bubbleLayer.appendChild(burst);

    let burstSize = 2;

    function animateBurst() {
      burstSize += 0.5;
      burst.setAttribute("r", burstSize);
      burst.setAttribute("opacity", 1 - burstSize / 10);

      if (burstSize < 10) {
        requestAnimationFrame(animateBurst);
      } else {
        bubbleLayer.removeChild(burst);
      }
    }

    requestAnimationFrame(animateBurst);
  }
  document.getElementById("bubbleLayer");

  // Spawn bubbles repeatedly
  bubbleInterval = setInterval(() => {
    if (bubbleLayer.childNodes.length < 10) {
      createBubble();
    }
  }, 200); //speed and no of bubbles
  // =========================================
  // 💧 WATER RISING (5 SECONDS)
  // =========================================
  let start = null;
  const duration = 7000;

  function animateWater(timestamp) {
    if (!start) start = timestamp;

    const progress = timestamp - start;
    const percent = Math.min(progress / duration, 1);

    // Move entire wave upward
    waveGroup.setAttribute(
      "transform",
      "translate(0," + (180 - 180 * percent) + ")",
    );

    if (progress < duration) {
      requestAnimationFrame(animateWater);
    } else {
      finishLoader();
    }
  }

  requestAnimationFrame(animateWater);

  // =========================================
  // 💗 FINISH LOADER (BLINK + FADE OUT)
  // =========================================
  function finishLoader() {
    // 🌊 Calm the wave gradually
    let calmInterval = setInterval(() => {
      waveIntensity -= 0.05;

      if (waveIntensity <= 0) {
        waveIntensity = 0;
        clearInterval(calmInterval);
      }
    }, 40);

    const heart = document.querySelector(".heart-container");
    const caption = document.querySelector(".love-caption");
    const barWrap = document.querySelector(".love-bar");
    const wash = document.getElementById("softWash");

    // 🌊 Phase 1 — Pause (breath moment)
    setTimeout(() => {
      // 💎 Phase 2 — Subtle glow pulse
      heart.classList.add("heart-soft-glow");

      setTimeout(() => {
        // 🌫 Phase 3 — Soft pink-white wash
        wash.style.opacity = "1";

        setTimeout(() => {
          // Fade everything under wash
          heart.style.opacity = "0";
          caption.style.opacity = "0";
          barWrap.style.opacity = "0";

          setTimeout(() => {
            document.getElementById("loveLoader").style.display = "none";

            // 🎬 Phase 4 — Start cinematic story
            startCelebrationSequence();
          }, 800);
        }, 600);
      }, 500);
    }, 500);
  }
}

/* =====================================================
   page 5 buttons
   
===================================================== */

function spawnEmoji(symbol) {
  const emitter = document.getElementById("p5Emitter");

  for (let i = 0; i < 4; i++) {
    setTimeout(() => {
      const e = document.createElement("div");

      e.classList.add("p5-floating");

      e.innerText = symbol;

      emitter.appendChild(e);

      setTimeout(() => {
        e.remove();
      }, 1800);
    }, i * 300);
  }
}

function emitHearts() {
  const couple = document.querySelector(".p5-couple");

  couple.classList.add("couple-pulse");

  setTimeout(() => {
    couple.classList.remove("couple-pulse");
  }, 400);

  spawnEmoji("❤️");

  confetti({
    particleCount: 200,
    spread: 110,
    origin: { y: 0.6 },
  });
}

function emitHugs() {
  const cupid = document.querySelector(".p5-Rcupid");

  cupid.classList.remove("cupid-float");
  cupid.classList.add("cupid-bounce");

  setTimeout(() => {
    cupid.classList.remove("cupid-bounce");
    cupid.classList.add("cupid-float");
  }, 350);

  spawnEmoji("🫂");
}

function emitKisses() {
  const cupid = document.querySelector(".p5-Lcupid");

  cupid.classList.remove("cupid-float");
  cupid.classList.add("cupid-bounce");

  setTimeout(() => {
    cupid.classList.remove("cupid-bounce");
    cupid.classList.add("cupid-float");
  }, 350);

  spawnEmoji("😘");
}

document.addEventListener("DOMContentLoaded", () => {
  const couple = document.querySelector(".p5-couple");
  const cupid1 = document.querySelector(".p5-Rcupid");
  const cupid2 = document.querySelector(".p5-Lcupid");
  const balloon1 = document.querySelector(".p5-balloon-left");
  const balloon2 = document.querySelector(".p5-balloon-right");

  if (couple) {
    couple.classList.add("couple-breath");

    setTimeout(() => {
      couple.classList.remove("couple-breath");
    }, 8000);
  }

  if (cupid1) cupid1.classList.add("cupid-float");
  if (cupid2) cupid2.classList.add("cupid-float");

  if (balloon1) balloon1.classList.add("balloon-sway");
  if (balloon2) balloon2.classList.add("balloon-sway");
});

document.addEventListener("DOMContentLoaded", () => {
  const cupid1 = document.querySelector(".p5-Rcupid");
  const cupid2 = document.querySelector(".p5-Lcupid");

  if (cupid1) cupid1.classList.add("cupid-float");
  if (cupid2) cupid2.classList.add("cupid-float");
});

function openReview() {
  window.location.href = "pink.html";
}

/*===========last page back button*/
function goBackToLetter() {
  currentSlide = 3;

  document.getElementById("slider").style.transform = "translateX(-300vw)";

  // Reset celebration system
  celebrationStarted = false;

  // Reset celebration loader
  resetLoveLoader();

  // Restart letter animation
  setTimeout(() => {
    showLetterAnimation();
  }, 200);
}

function resetLoveLoader() {
  const loader = document.getElementById("loveLoader");
  const waveGroup = document.getElementById("waveGroup");
  const bar = document.getElementById("loveBarFill");
  const bubbleLayer = document.getElementById("bubbleLayer");

  loader.style.display = "none";
  loader.style.opacity = "1";

  // Reset wave position
  waveGroup.setAttribute("transform", "translate(0,180)");

  // Reset loading bar
  bar.style.width = "0%";

  // Clear bubbles
  while (bubbleLayer.firstChild) {
    bubbleLayer.removeChild(bubbleLayer.firstChild);
  }

  document.querySelector(".love-caption").style.opacity = "1";
}

function openReview() {
  window.location.href = "fromhp.html";
}

/* =====================================================
   GLOBAL STATE
   - Controls current slide position
   - Controls current quiz question
   - Controls current story image index
===================================================== */
let currentSlide = 0;
let isSliding = false;
let currentQuiz = 1;
let storyIndex = 0;
let storyEndingTriggered = false; //Guard for inner nav-btn
let identityConfirmed = false; //ur gf gaurd

/* =====================================================
   STORY DATA (PAGE 3)
   - Image list for gallery
   - Caption list for gallery
===================================================== */
const storyPhotos = [
  "images/ori1.jpg",
  "images/ori2.png",
  "images/ori3.png",
  "images/ori4.jpg",
  "images/ori5.png",
];

const storyCaptions = [
  "Our first photo <strong>together</strong>💗",
  "A <strong>short ride</strong>,the beginning of our <strong>endless journey</strong>",
  "The moment <strong>my two worlds</strong> met 🥰",
  "<strong >Your birthday</strong>, but your smile was<strong> my gift</strong>✨",
  "Just us,with the <strong>endless</strong> sea —<strong>like our love</strong>.💞",
];

/* =====================================================
   SLIDER SYSTEM (ALL PAGES)
   - Handles horizontal movement between pages
===================================================== */
function nextSlide() {
  if (isSliding) return;

  isSliding = true;

  if (currentSlide < 4) {
    currentSlide++;
    document.getElementById("slider").style.transform =
      "translateX(-" + currentSlide * 100 + "vw)";
  }

  if (currentSlide === 3) {
    showLetterAnimation();
  }

  setTimeout(() => {
    isSliding = false;
  }, 600); // same as CSS transition time
}

function prevSlide() {
  if (isSliding) return;

  isSliding = true;

  if (currentSlide > 0) {
    currentSlide--;

    document.getElementById("slider").style.transform =
      "translateX(-" + currentSlide * 100 + "vw)";
  }

  identityConfirmed = false;

  // 🔥 Reset logic based on destination
  if (currentSlide === 1) {
    resetQuiz();
    showQuizIntro();
  }

  if (currentSlide === 2) {
    resetStory();
  }

  setTimeout(() => {
    isSliding = false;
  }, 600);
}

/* =====================================================
   PAGE 1 — ENTRY CONFIRMATION
   - Shows confirmation overlay
   - Launches confetti
   - Moves to Page 2
===================================================== */
function confirmYes() {
  if (identityConfirmed) return;
  identityConfirmed = true;

  const emitter = document.getElementById("loveEmitter");
  const overlay = document.getElementById("confirmOverlay");
  const confirmBox = overlay.querySelector(".confirm-box");

  emitter.innerHTML = "";

  const drifts = ["-20px", "15px", "-10px", "25px"];

  for (let i = 0; i < 4; i++) {
    setTimeout(() => {
      const heart = document.createElement("div");
      heart.classList.add("floating-heart");
      heart.innerText = "💕";
      heart.style.setProperty("--drift", drifts[i]);

      if (i === 0) {
        heart.style.fontSize = "30px"; // first heart slightly bigger
      }

      emitter.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 1800);
    }, i * 400);
  }

  // Show confirmation AFTER hearts finish
  setTimeout(() => {
    overlay.classList.add("show");

    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
    });

    confirmBox.classList.add("magic-pulse");

    setTimeout(() => {
      overlay.classList.remove("show");
      confirmBox.classList.remove("magic-pulse");

      currentSlide = 1;
      document.getElementById("slider").style.transform = "translateX(-100vw)";

      resetQuiz();
      showQuizIntro();
    }, 1800);
  }, 1900);
}

/* =====================================================
   GLOBAL POPUP (WRONG ANSWER BUTTON)
===================================================== */
function showPopup() {
  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

/* =====================================================
   PAGE 2 — QUIZ INTRO OVERLAY
   - Shows blur intro before quiz begins
===================================================== */
function showQuizIntro() {
  document.getElementById("quizIntro").style.display = "flex";
  document.querySelector(".quiz-content").classList.add("blur");
}

function startQuiz() {
  document.getElementById("quizIntro").style.display = "none";
  document.querySelector(".quiz-content").classList.remove("blur");
}

/* =====================================================
   PAGE 2 — QUIZ SYSTEM
   - Handles answer checking
   - Moves through questions
   - Shows pass screen
===================================================== */
function checkAnswer(correct, btn) {
  if (btn.querySelector(".option-popup")) return;

  const popup = document.createElement("div");
  popup.classList.add("option-popup");
  popup.innerText = correct ? "very good 👍😌" : "Maranthutala 🥺😢";

  btn.appendChild(popup);

  if (correct) {
    btn.style.background = "#d94f8a";
    btn.style.color = "white";
  }

  setTimeout(() => popup.classList.add("show"), 10);

  setTimeout(() => {
    popup.remove();

    if (correct) {
      if (currentQuiz < 3) {
        currentQuiz++;
        showQuestion(currentQuiz);
      } else {
        showPass();
      }
    }
  }, 1200);
}

/* Shows specific quiz question */
function showQuestion(num) {
  ["q1", "q2", "q3", "passMessage"].forEach(
    (id) => (document.getElementById(id).style.display = "none"),
  );

  document.getElementById("q" + num).style.display = "block";
  updateDots();
}

/* =====================================================
   PAGE 2 — PASS SCREEN + LOADER
   - Displays "You passed"
   - Shows loader below
   - Automatically moves to Page 3
===================================================== */
function showPass() {
  ["q1", "q2", "q3"].forEach(
    (id) => (document.getElementById(id).style.display = "none"),
  );

  document.querySelector(".quiz-progress").style.display = "none";

  const pass = document.getElementById("passMessage");
  const loader = document.getElementById("quizLoader");
  const fill = loader.querySelector(".loader-fill");
  const heart = document.getElementById("quizLoaderHeart");

  pass.style.display = "flex";

  confetti({
    particleCount: 120,
    spread: 90,
    origin: { y: 0.6 },
  });

  // Show loader after short delay
  setTimeout(() => (loader.style.display = "flex"), 800);

  // Animate loader
  setTimeout(() => {
    fill.style.width = "100%";
    heart.style.left = "95%";
  }, 900);

  // Move to Page 3
  setTimeout(() => nextSlide(), 3900);
}

/* =====================================================
   QUIZ RESET (WHEN GOING BACK)
===================================================== */
function resetQuiz() {
  currentQuiz = 1;
  showQuestion(1);

  document.querySelectorAll(".quiz-option").forEach((btn) => {
    btn.style.background = "white";
    btn.style.color = "black";
  });

  document.getElementById("quizIntro").style.display = "none";
  document.querySelector(".quiz-content").classList.remove("blur");
  document.querySelector(".quiz-progress").style.display = "flex";

  const loader = document.getElementById("quizLoader");
  if (loader) {
    loader.style.display = "none";
    loader.querySelector(".loader-fill").style.width = "0%";
    document.getElementById("quizLoaderHeart").style.left = "0";
  }
}

/* Updates quiz progress dots */
function updateDots() {
  for (let i = 1; i <= 3; i++) {
    document.getElementById("dot" + i).classList.remove("active");
  }
  document.getElementById("dot" + currentQuiz).classList.add("active");
}

/* =====================================================
   PAGE 3 — STORY SLIDESHOW
   - Controls image switching
   - Updates gallery dots
   - Final caption before Page 4
===================================================== */
function updateStory() {
  const img = document.getElementById("storyImage");

  img.classList.add("fade-out");

  setTimeout(() => {
    img.src = storyPhotos[storyIndex];
    document.getElementById("storyCaption").innerHTML =
      storyCaptions[storyIndex];

    if (storyIndex === 0) img.style.objectPosition = "30% 20%"; //hor, ver
    if (storyIndex === 1) img.style.objectPosition = "50% 30%";
    if (storyIndex === 2) img.style.objectPosition = "50% 10%";
    if (storyIndex === 3) img.style.objectPosition = "50% 25%";
    if (storyIndex === 4) img.style.objectPosition = "50% 45%";

    img.classList.remove("fade-out");
  }, 100);

  for (let i = 1; i <= 5; i++) {
    document.getElementById("sDot" + i).classList.remove("active");
  }

  document.getElementById("sDot" + (storyIndex + 1)).classList.add("active");
}

function nextStoryPhoto() {
  if (storyIndex < storyPhotos.length - 1) {
    storyIndex++;
    updateStory();
  } else {
    if (storyEndingTriggered) return;

    storyEndingTriggered = true;

    document.getElementById("storyCaption").innerText =
      "That's all, my dear 💗";

    setTimeout(() => {
      nextSlide();
      storyEndingTriggered = false;
    }, 100);
  }
}

function prevStoryPhoto() {
  if (storyIndex > 0) {
    storyIndex--;
    updateStory();
  }
}

/*=============PAGE 3 RESET===========*/

function resetStory() {
  storyIndex = 0;
  updateStory();
}

document.addEventListener("DOMContentLoaded", () => {
  updateStory();
});

/* =====================================================
   PAGE 4 — LETTER ANIMATION
   - Fades in letter card when entering page
===================================================== */
function showLetterAnimation() {
  const letter = document.getElementById("letterCard");

  letter.classList.remove("show");

  if (letter) {
    setTimeout(() => {
      letter.classList.add("show");
    }, 200);
  }
}

function goToCelebration() {
  document.getElementById("celebrationContent").classList.remove("show");
  document.getElementById("blackScreen").classList.remove("hide");
  if (currentSlide < 4) {
    currentSlide = 4;

    document.getElementById("slider").style.transform = "translateX(-400vw)";

    resetLoveLoader(); // reset previous animation state
    celebrationStarted = false;

    setTimeout(() => {
      startLoveLoader();
    }, 400);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("returnToCelebration") === "true") {
    currentSlide = 4;
    document.getElementById("slider").style.transform = "translateX(-400vw)";
    sessionStorage.removeItem("returnToCelebration");
  }
});

window.addEventListener("load", () => {
  const params = new URLSearchParams(window.location.search);

  if (params.get("review") === "back") {
    currentSlide = 4;

    document.getElementById("slider").style.transform = "translateX(-400vw)";

    document.getElementById("blackScreen").classList.add("hide");

    document.getElementById("celebrationContent").classList.add("show");

    // remove ?review=back from URL
    window.history.replaceState({}, document.title, "ownbig.html");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // ✅ LOGIN FORM
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", (e) => {
      const usernameInput = document.getElementById("username");
      const username = usernameInput.value.trim();
      const password = form.querySelector("input[type='password']").value.trim();

      if (!username || !password) {
        alert("Please fill in both username and password.");
        e.preventDefault();
        return;
      }

      localStorage.setItem("username", username);
      e.preventDefault();
      window.location.href = "../html/dashboard.html";
    });
  }

  // ✅ EXAM PAGE: This block now runs safely AFTER the page is loaded
  if (window.location.pathname.includes("exam.html")) {
    nextQuestion();
    const username = localStorage.getItem("username") || "Student";
    const greet = document.getElementById("exam-greeting");
    if (greet) {
      greet.textContent = `Good luck, ${username}! 🍀`;
    }
  }

  // ✅ DARK MODE
  const toggleBtn = document.getElementById("toggle-dark-mode");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });
  }

  // ✅ LOGOUT
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("username");
      window.location.href = "../html/login.html";
    });
  }

  // ✅ DASHBOARD
  if (window.location.pathname.includes("dashboard.html")) {
    const username = localStorage.getItem("username") || "Student";
    const greeting = document.getElementById("greeting");
    if (greeting) {
      greeting.textContent = `Welcome, ${username}! 🎉`;
    }

const tip = document.getElementById("tip-message");
if (tip) {
  tip.textContent = "Today’s tip: Stay focused and trust your process 💡";
tip.classList.add("fade-in");
}
  }
});


// === Quiz Logic ===
const questions = [
  {
    text: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Rome"],
    correct: "Paris"
  },
  {
    text: "Solve: 2 + 2 × 2",
    options: ["6", "8", "4", "2"],
    correct: "6"
  },
  {
    text: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "Hot Mail", "How To Make Lasagna", "High Tech Machine Language"],
    correct: "Hyper Text Markup Language"
  }
];

let current = 0;
let score = 0;
let timer;
let timeLeft = 10;

function nextQuestion() {
  const qEl = document.getElementById("question");
  const aEl = document.getElementById("answers");
  const timerEl = document.getElementById("timer");

  aEl.innerHTML = ""; // Clear previous answers
  clearInterval(timer); // Stop previous timer
const progress = document.getElementById("progress-bar");
if (progress) {
  const percent = Math.round((current / questions.length) * 100);
  progress.style.width = `${percent}%`;
}
  if (qEl && current < questions.length) {
    const currentQ = questions[current];
    qEl.textContent = currentQ.text;
    qEl.classList.remove("fade-in");
    void qEl.offsetWidth;
    qEl.classList.add("fade-in");

    // Reset and start timer
    timeLeft = 10;
    timerEl.textContent = `Time Left: ${timeLeft}s`;
    timer = setInterval(() => {
      timeLeft--;
      timerEl.textContent = `Time Left: ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timer);
        document.querySelector("#next").click(); // trigger "Next"
      }
    }, 1000);

    currentQ.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.style.display = "block";
      btn.style.margin = "8px 0";

      btn.onclick = () => {
        if (option === currentQ.correct) {
          alert("✅ Correct!");
          score++;
        } else {
          alert("❌ Incorrect!");
        }
        // Stop timer + disable all buttons
        clearInterval(timer);
        const allButtons = document.querySelectorAll("#answers button");
        allButtons.forEach(btn => btn.disabled = true);
      };

      aEl.appendChild(btn);
    });

    current++;
  } else if (qEl) {
    let message = `You scored ${score} out of ${questions.length}. `;

if (score === questions.length) {
  message += "🌟 Perfect score! You're a genius!";
} else if (score >= questions.length * 0.7) {
  message += "👏 Great job! Almost there!";
} else if (score >= questions.length * 0.4) {
  message += "🙂 Not bad — keep practicing!";
} else {
  message += "💪 Keep going — you're learning!";
}

qEl.textContent = `Exam complete! 🎉\n${message}`;
aEl.innerHTML = "";
document.getElementById("restart").style.display = "inline-block";
document.querySelector("button").disabled = true;
timerEl.textContent = "";
clearInterval(timer);
  }//
// ✅ Show "Download Certificate" button
document.getElementById("download-certificate").style.display = "inline-block";

const certBtn = document.getElementById("download-certificate");
certBtn.onclick = () => {
const doc = new jsPDF(); // no window.jspdf needed


  const username = localStorage.getItem("username") || "Student";
  const date = new Date().toLocaleDateString();

  // Border
  doc.setDrawColor(120);
  doc.setLineWidth(0.5);
  doc.rect(10, 10, 190, 270);

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(40, 90, 180);
  doc.text("QuizProInstitute", 105, 25, { align: "center" });

  doc.setFontSize(18);
  doc.text("Certificate of Completion", 105, 40, { align: "center" });

  // Body
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text("This certifies that", 105, 60, { align: "center" });

  doc.setFont("times", "bolditalic");
  doc.setFontSize(20);
  doc.text(username, 105, 75, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text("has successfully completed the quiz on", 105, 90, { align: "center" });
  doc.setFontSize(12);
  doc.text(date, 105, 100, { align: "center" });

  doc.setFontSize(14);
  doc.text(`Final Score: ${score} out of ${questions.length}`, 105, 120, { align: "center" });

  // Signature
  // Signature line
doc.setDrawColor(0);
doc.line(40, 250, 140, 250); // horizontal line

// Signature label
doc.setFont("helvetica", "italic");
doc.setFontSize(12);
doc.setTextColor(60, 60, 60);
doc.text("Teacher Signature", 40, 255);

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Generated by QuizPro", 105, 280, { align: "center" });

  doc.save(`${username}_Certificate.pdf`);
};
}


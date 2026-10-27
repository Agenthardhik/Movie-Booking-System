// ---------------------------
// Banner Slider
// ---------------------------

const slider = document.getElementById("slider");

if (slider) {
  const images = [
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1400",
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1400",
    "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1400",
    "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?w=1400"
  ];

  let index = 0;

  function changeBanner() {
    index++;
    if (index >= images.length) {
      index = 0;
    }
    slider.style.opacity = "0";
    setTimeout(() => {
      slider.src = images[index];
      slider.style.opacity = "1";
    }, 400);
  }

  slider.style.transition = "opacity 0.4s ease";
  setInterval(changeBanner, 4000);
}

// ---------------------------
// Search Movies
// ---------------------------

const search = document.querySelector(".search-box input");

if (search) {
  search.addEventListener("keyup", function () {
    let value = this.value.toLowerCase();
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
      const title = card.querySelector("h3");
      if (!title) return;
      const movie = title.innerText.toLowerCase();

      if (movie.includes(value)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
}

// ---------------------------
// Sign In / Auth Button
// ---------------------------

const signinBtn = document.querySelector(".signin");

if (signinBtn) {
  signinBtn.id = "navAuthBtn";
  signinBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
    if (isLoggedIn) {
      handleLogout();
    } else {
      openLoginModal();
    }
  });
}

// ---------------------------
// Mobile Menu
// ---------------------------

const menuBtn = document.querySelector(".menu");
if (menuBtn) {
  menuBtn.addEventListener("click", function () {
    const nav = document.querySelector("nav");
    if (nav) {
      nav.classList.toggle("nav-open");
    }
  });
}

// ---------------------------
// Snack Cart (Homepage)
// ---------------------------

let total = 0;

const snackButtons = document.querySelectorAll(".snack-content button, .snack button");

snackButtons.forEach(button => {
  button.addEventListener("click", function () {
    const parent = this.closest(".snack-content") || this.closest(".snack");
    if (!parent) return;

    const snackEl = parent.querySelector("h3");
    const priceEl = parent.querySelector("p");
    if (!snackEl || !priceEl) return;

    const snack = snackEl.innerText;
    const price = priceEl.innerText;
    const amount = parseInt(price.replace("₹", ""));

    total += amount;

    // Show a toast instead of alert
    showToast(`${snack} added! Cart: ₹${total}`);
  });
});

// ---------------------------
// Toast Notification System
// ---------------------------

function showToast(message, duration = 2500) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.style.cssText = `
    background: linear-gradient(135deg, #1e1e2e, #2a2a3e);
    color: #fff;
    padding: 14px 24px;
    border-radius: 12px;
    font-size: 15px;
    font-family: 'Segoe UI', Arial, sans-serif;
    box-shadow: 0 8px 30px rgba(0,0,0,0.3);
    border-left: 4px solid #d81f26;
    transform: translateX(120%);
    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
    opacity: 0;
    pointer-events: auto;
  `;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = "translateX(0)";
    toast.style.opacity = "1";
  });

  setTimeout(() => {
    toast.style.transform = "translateX(120%)";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// ---------------------------
// Chatbot Reply
// ---------------------------

function reply() {
  const msgInput = document.getElementById("userMsg");
  const botReply = document.getElementById("botReply");
  if (!msgInput || !botReply) return;

  let msg = msgInput.value.toLowerCase().trim();
  if (!msg) {
    botReply.innerText = "Please type a question first!";
    return;
  }

  let answer = "I'm here to help with your movie tickets and snacks! You can ask about movies, showtimes, or snacks.";

  if (msg.includes("movie") || msg.includes("film") || msg.includes("showing")) {
    answer = "🎬 You can browse currently running movies right from the 'Now Showing' section on the homepage.";
  } else if (msg.includes("ticket") || msg.includes("seat") || msg.includes("book")) {
    answer = "🎟️ Select any movie card and click 'Book Now' to choose your theater, showtime, and seats.";
  } else if (msg.includes("snack") || msg.includes("food") || msg.includes("popcorn")) {
    answer = "🍿 You can order snacks along with your movie booking or browse popular snacks on our home page.";
  } else if (msg.includes("theatre") || msg.includes("cinema") || msg.includes("location")) {
    answer = "📍 Select your city from the dropdown at the top to view local theaters near you!";
  } else if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey")) {
    answer = "👋 Hello! Welcome to BookNbite. How can I help you today?";
  } else if (msg.includes("price") || msg.includes("cost") || msg.includes("how much")) {
    answer = "💰 Ticket prices start at ₹250 per seat. Snack prices vary from ₹120 to ₹350.";
  }

  botReply.innerText = answer;
  msgInput.value = "";
}

// ---------------------------
// Login Modal
// ---------------------------

function openLoginModal() {
  const modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "flex";
}

function closeLoginModal() {
  const modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "none";
}

window.addEventListener("click", function (event) {
  const modal = document.getElementById("loginModal");
  if (event.target === modal) {
    closeLoginModal();
  }
});

// ---------------------------
// Handle Authentication
// ---------------------------

function handleAuth(event) {
  event.preventDefault();

  const emailEl = document.getElementById("userEmail");
  if (!emailEl) return;

  const email = emailEl.value.trim();
  const userName = email.split("@")[0];

  localStorage.setItem("userLoggedIn", "true");
  localStorage.setItem("userName", userName);

  showToast(`Welcome back, ${userName}! 👋`);
  closeLoginModal();
  checkAuthStatus();
}

// ---------------------------
// Auth Status Check
// ---------------------------

function checkAuthStatus() {
  const authBtn = document.getElementById("navAuthBtn");
  const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
  const userName = localStorage.getItem("userName");

  if (authBtn) {
    if (isLoggedIn && userName) {
      authBtn.innerText = `Hi, ${userName} ▾`;
      authBtn.title = "Click to logout";
    } else {
      authBtn.innerText = "Sign In";
      authBtn.title = "Click to sign in";
    }
  }
}

// ---------------------------
// Handle Logout
// ---------------------------

function handleLogout() {
  if (confirm("Are you sure you want to log out?")) {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userName");
    showToast("Logged out successfully.");
    checkAuthStatus();
  }
}

// ---------------------------
// Book Movie (from movie cards)
// ---------------------------

function bookMovie(movieTitle) {
  const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
  if (!isLoggedIn) {
    showToast("Please Sign In first to book tickets!");
    openLoginModal();
    return;
  }

  // Save the selected movie to localStorage so booking.html can use it
  localStorage.setItem("selectedMovie", movieTitle);

  // Navigate to booking page
  window.location.href = "booking.html";
}

// ---------------------------
// Run on Page Load
// ---------------------------

document.addEventListener("DOMContentLoaded", function () {
  checkAuthStatus();
});

// ---------------------------
// Chatbot Toggle
// ---------------------------

function toggleChat() {
  const chatBody = document.getElementById("chatBody");
  const icon = document.getElementById("chatToggleIcon");
  if (!chatBody) return;

  chatBody.classList.toggle("collapsed");

  if (icon) {
    icon.className = chatBody.classList.contains("collapsed")
      ? "fa fa-chevron-up"
      : "fa fa-chevron-down";
  }
} 
// ================= GLOBAL API CONFIG =================
const IS_LOCAL = window.location.hostname === "127.0.0.1" ||
                 window.location.hostname === "localhost";

const CONFIG = {
  BASE_URL: IS_LOCAL
    ? "http://127.0.0.1:5000"
    : "https://pandabackend-zd6n.onrender.com",

  API: IS_LOCAL
    ? "http://127.0.0.1:5000/api"
    : "https://pandabackend-zd6n.onrender.com/api"
};

const USER_ID = localStorage.getItem("user_id");
// ---------------------------------------------
// MOBILE NAV TOGGLE
// ---------------------------------------------
function toggleNav() {
  document.body.classList.toggle("nav-open");
}

// ---------------------------------------------
// TOAST
// ---------------------------------------------
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.style.background = type === "error" ? "#e74c3c" : "#27ae60";
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 2200);
}

// ---------------------------------------------
// ADD TO CART (NO AUTH)
// ---------------------------------------------
async function addToCart(product_id) {
  try {
    const res = await fetch(`${CONFIG.API}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-USER-ID": USER_ID
      },
      body: JSON.stringify({ product_id })
    });

    const text = await res.text(); // 🔥 READ RAW RESPONSE
    console.log("RAW RESPONSE:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      showToast("Backend returned invalid response", "error");
      return;
    }

    if (!res.ok) {
      showToast(data.error || "Failed to add to cart", "error");
      return;
    }

    showToast("Added to cart");

  } catch (err) {
    console.error("ADD TO CART ERROR:", err);
    showToast("Network / server error", "error");
  }
}

// ---------------------------------------------
// NAVBAR (STATIC FOR NOW)
// ---------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const loggedIn = localStorage.getItem("loggedIn") === "1";
  updateNavbar(loggedIn);
});

// ---------------------------------------------
// NAVBAR STATE CONTROL (FINAL, CLEAN)
// ---------------------------------------------
function updateNavbar(loggedIn) {
  const loginLink   = document.getElementById("loginLink");
  const productsLink = document.getElementById("productsLink");
  const cartLink    = document.getElementById("cartLink");
  const ordersLink  = document.getElementById("ordersLink");
  const profileLink = document.getElementById("profileLink");
  const logoutLink  = document.getElementById("logoutLink");

  if (!loggedIn) {
    // 🔓 Logged OUT state
    if (loginLink)   loginLink.style.display = "block";
    if (productsLink) productsLink.style.display = "none";
    if (cartLink)    cartLink.style.display = "none";
    if (ordersLink)  ordersLink.style.display = "none";
    if (profileLink) profileLink.style.display = "none";
    if (logoutLink)  logoutLink.style.display = "none";
  } else {
    // 🔐 Logged IN state
    if (loginLink)   loginLink.style.display = "none";
    if (productsLink) productsLink.style.display = "block";
    if (cartLink)    cartLink.style.display = "block";
    if (ordersLink)  ordersLink.style.display = "block";
    if (profileLink) profileLink.style.display = "block";
    if (logoutLink)  logoutLink.style.display = "block";
  }
}
// ---------------------------------------------
// LOGOUT
// ---------------------------------------------
function logoutUser() {
  // clear auth state
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("token");
  localStorage.removeItem("user_id");

  // 🔥 history-safe redirect to PUBLIC products page
  window.location.replace("index.html");
}




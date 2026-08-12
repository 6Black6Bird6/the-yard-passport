// =====================================
// THE YARD EXPERIENCE – SECURE CLIENT
// =====================================

// 🔁 Replace this with your actual deployed Apps Script URL
const API_URL = "https://script.google.com/macros/s/AKfycbwLDR0Tku_ljziXqGpjg5LXVbfAqt-N8yqeKgPe0_19_BTybtfRwQZRTpyXCFfp4BUw/exec";

let member = {
  name: "Welcome",
  memberId: "",
  xp: 0,
  visits: 0,
  events: 0,
  level: "🍊 NEW EXPLORER"
};

// ================================
// Helper: sanitize input
// ================================
function sanitize(str) {
  return str.trim().replace(/<[^>]*>/g, '');
}

// ================================
// Load member data into UI
// ================================
function loadMember() {
  document.getElementById("memberName").textContent = member.name;
  document.getElementById("memberId").textContent = "Member ID: " + member.memberId;
  document.getElementById("levelBadge").textContent = member.level;
  document.getElementById("xpValue").textContent = member.xp + " XP";
  document.getElementById("visitCount").textContent = member.visits;
  document.getElementById("eventCount").textContent = member.events;

  let progress = Math.min((member.xp / 250) * 100, 100);
  document.getElementById("xpProgress").style.width = progress + "%";

  if (member.memberId) {
    document.getElementById("drinkSection").style.display = "block";
    document.getElementById("passportDetails").classList.add("show");
  }
}

// ================================
// Register new member
// ================================
async function registerMember() {
  const name = sanitize(document.getElementById("nameInput").value);
  const email = sanitize(document.getElementById("emailInput").value);
  const phone = sanitize(document.getElementById("phoneInput").value);
  const pin = document.getElementById("pinInput").value;
  const referral = sanitize(document.getElementById("referralInput").value);

  const message = document.getElementById("loginMessage");

  if (!name || !phone || !pin) {
    message.textContent = "Please fill in Name, Phone, and PIN.";
    return;
  }
  if (!/^\d{4}$/.test(pin)) {
    message.textContent = "PIN must be exactly 4 digits.";
    return;
  }
  if (phone.length < 7) {
    message.textContent = "Please enter a valid phone number.";
    return;
  }

  message.textContent = "Joining The Yard Tribe 🍊";

  const formData = new URLSearchParams();
  formData.append("action", "register");
  formData.append("name", name);
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("pin", pin);
  formData.append("referral", referral);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    });

    const data = await response.json();

    if (data.success) {
      member = data;
      loadMember();
      let msg = "Welcome to The Yard 🍸";
      if (data.referralBonus) {
        msg += " You earned " + data.referralBonus + " bonus XP!";
      }
      message.textContent = msg;
    } else {
      message.textContent = data.error || "Registration failed.";
    }
  } catch (error) {
    console.error(error);
    message.textContent = "Connection failed. Please try again.";
  }
}

// ================================
// Find existing member
// ================================
async function findPassport() {
  const phone = sanitize(document.getElementById("loginPhoneInput").value);
  const pin = document.getElementById("loginPinInput").value;

  const message = document.getElementById("loginMessage");

  if (!phone || !pin) {
    message.textContent = "Please enter your phone and PIN.";
    return;
  }
  if (!/^\d{4}$/.test(pin)) {
    message.textContent = "PIN must be exactly 4 digits.";
    return;
  }

  message.textContent = "Searching Yard Tribe 🍊";

  const formData = new URLSearchParams();
  formData.append("action", "lookup");
  formData.append("phone", phone);
  formData.append("pin", pin);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    });

    const data = await response.json();

    if (data.success) {
      member = data;
      loadMember();
      message.textContent = "Passport found 🍸";
    } else {
      message.textContent = data.error || "Member not found or PIN incorrect.";
    }
  } catch (error) {
    console.error(error);
    message.textContent = "Connection error. Please try again.";
  }
}

// ================================
// Submit a drink
// ================================
async function submitDrink() {
  const name = sanitize(document.getElementById("drinkNameInput").value);
  const phone = sanitize(document.getElementById("drinkPhoneInput").value);
  const drinkName = sanitize(document.getElementById("drinkNameInput").value);
  const syrup = sanitize(document.getElementById("syrupInput").value);
  const baseJuice = sanitize(document.getElementById("baseJuiceInput").value);
  const alcohol = sanitize(document.getElementById("alcoholInput").value);
  const mixers = sanitize(document.getElementById("mixersInput").value);
  const garnish = sanitize(document.getElementById("garnishInput").value);
  const specialReq = sanitize(document.getElementById("specialReqInput").value);

  const message = document.getElementById("drinkMessage");

  if (!name || !phone || !drinkName) {
    message.textContent = "Please fill in your name, phone, and drink name.";
    return;
  }

  message.textContent = "Submitting your drink... 🍹";

  const formData = new URLSearchParams();
  formData.append("action", "submitDrink");
  formData.append("name", name);
  formData.append("phone", phone);
  formData.append("drinkName", drinkName);
  formData.append("syrup", syrup);
  formData.append("baseJuice", baseJuice);
  formData.append("alcohol", alcohol);
  formData.append("mixers", mixers);
  formData.append("garnish", garnish);
  formData.append("specialReq", specialReq);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    });

    const data = await response.json();

    if (data.success) {
      if (data.member) {
        member = data.member;
        loadMember();
      }
      message.textContent = data.message || "Drink submitted! +25 XP 🎉";
      document.getElementById("drinkNameInput").value = "";
      document.getElementById("syrupInput").value = "";
      document.getElementById("baseJuiceInput").value = "";
      document.getElementById("alcoholInput").value = "";
      document.getElementById("mixersInput").value = "";
      document.getElementById("garnishInput").value = "";
      document.getElementById("specialReqInput").value = "";
    } else {
      message.textContent = data.error || "Failed to submit drink.";
    }
  } catch (error) {
    console.error(error);
    message.textContent = "Connection error. Please try again.";
  }
}

// ================================
// Event listeners
// ================================
document.getElementById("joinButton").addEventListener("click", registerMember);
document.getElementById("findPassport").addEventListener("click", findPassport);
document.getElementById("submitDrinkButton").addEventListener("click", submitDrink);

loadMember();
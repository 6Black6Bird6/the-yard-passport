// ============================================================
// THE YARD EXPERIENCE – CLIENT (FINAL)
// ============================================================

// 🔁 Replace with your deployed Apps Script URL
const API_URL = "https://script.google.com/macros/s/AKfycbwLDR0Tku_ljziXqGpjg5LXVbfAqt-N8yqeKgPe0_19_BTybtfRwQZRTpyXCFfp4BUw/execE";

let member = {
  name: "Welcome",
  memberId: "",
  phone: "",
  xp: 0,
  visits: 0,
  events: 0,
  level: "🍊 NEW EXPLORER"
};

let isAdmin = false;
const ADMIN_KEY = "YARD-ADMIN-2025";

function sanitize(str) {
  return str ? str.trim().replace(/<[^>]*>/g, '') : '';
}

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
  } else {
    document.getElementById("drinkSection").style.display = "none";
    document.getElementById("passportDetails").classList.remove("show");
  }
}

// ---- REGISTER ----
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
      member = { ...data, phone: phone };
      loadMember();
      let msg = "Welcome to The Yard 🍸";
      if (data.referralBonus) {
        msg += ` You referred ${data.referrerName || 'a friend'} and earned ${data.referralBonus} XP!`;
      }
      message.textContent = msg;
      // Clear registration form
      document.getElementById("nameInput").value = "";
      document.getElementById("emailInput").value = "";
      document.getElementById("phoneInput").value = "";
      document.getElementById("pinInput").value = "";
      document.getElementById("referralInput").value = "";
    } else {
      message.textContent = data.error || "Registration failed.";
    }
  } catch (error) {
    console.error(error);
    message.textContent = "Connection failed. Please try again.";
  }
}

// ---- LOGIN ----
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
      member = { ...data, phone: phone };
      loadMember();
      message.textContent = "Passport found 🍸";
      document.getElementById("loginPhoneInput").value = "";
      document.getElementById("loginPinInput").value = "";
    } else {
      message.textContent = data.error || "Member not found or PIN incorrect.";
    }
  } catch (error) {
    console.error(error);
    message.textContent = "Connection error. Please try again.";
  }
}

// ---- SUBMIT DRINK ----
async function submitDrink() {
  const name = member.name || "Yard Member";
  const phone = member.phone || "";
  const drinkName = sanitize(document.getElementById("drinkNameInput").value);
  const syrup = sanitize(document.getElementById("syrupInput").value);
  const baseJuice = sanitize(document.getElementById("baseJuiceInput").value);
  const alcohol = sanitize(document.getElementById("alcoholInput").value);
  const mixers = sanitize(document.getElementById("mixersInput").value);
  const garnish = sanitize(document.getElementById("garnishInput").value);
  const specialReq = sanitize(document.getElementById("specialReqInput").value);
  const message = document.getElementById("drinkMessage");

  if (!drinkName) {
    message.textContent = "Please give your drink a name.";
    return;
  }
  if (!phone) {
    message.textContent = "You must be logged in to submit a drink.";
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
        member = { ...member, ...data.member, phone: phone };
        loadMember();
      }
      message.textContent = data.message || "Drink submitted! +25 XP 🎉";
      // Clear form
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

// ---- PHOTO UPLOAD ----
async function uploadPhoto() {
  const clientName = sanitize(document.getElementById("photoName").value);
  const caption = sanitize(document.getElementById("photoCaption").value);
  const fileInput = document.getElementById("photoFile");
  const message = document.getElementById("photoUploadMessage");

  if (!clientName) {
    message.textContent = "Please enter your name.";
    return;
  }
  if (!fileInput.files || fileInput.files.length === 0) {
    message.textContent = "Please select an image.";
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = async function (e) {
    const imageData = e.target.result;
    message.textContent = "Uploading... 📤";

    const formData = new URLSearchParams();
    formData.append("action", "uploadPhoto");
    formData.append("clientName", clientName);
    formData.append("caption", caption);
    formData.append("phone", member.phone || "");
    formData.append("imageData", imageData);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString()
      });
      const data = await response.json();
      if (data.success) {
        message.textContent = "✅ Photo uploaded! It will appear after moderation.";
        document.getElementById("photoName").value = "";
        document.getElementById("photoCaption").value = "";
        document.getElementById("photoFile").value = "";
        loadGallery();
      } else {
        message.textContent = "❌ " + (data.error || "Upload failed.");
      }
    } catch (error) {
      console.error(error);
      message.textContent = "Connection error. Please try again.";
    }
  };
  reader.readAsDataURL(file);
}

// ---- GALLERY ----
async function loadGallery() {
  try {
    const response = await fetch(API_URL + "?action=getPhotos");
    const data = await response.json();
    const gallery = document.getElementById("photoGallery");
    if (data.success && data.photos && data.photos.length) {
      gallery.innerHTML = "";
      data.photos.forEach(photo => {
        const div = document.createElement("div");
        div.className = "photo-item";
        div.innerHTML = `
          <img src="${photo.imageUrl}" alt="${photo.caption || 'Photo'}">
          <div class="photo-info">
            <strong>${photo.clientName}</strong>
            <span>${photo.caption || ''}</span>
            <span class="timestamp">${new Date(photo.timestamp).toLocaleString()}</span>
          </div>
        `;
        gallery.appendChild(div);
      });
    } else {
      gallery.innerHTML = "<p>No approved photos yet. Check back later!</p>";
    }
  } catch (error) {
    console.error("Error loading gallery:", error);
  }
}

// ---- ADMIN ----
function adminLogin() {
  const key = document.getElementById("adminKeyInput").value;
  if (key === ADMIN_KEY) {
    isAdmin = true;
    document.getElementById("adminControls").style.display = "block";
    document.getElementById("adminKeyInput").style.display = "none";
    document.getElementById("adminLoginButton").style.display = "none";
    loadPendingPhotos();
    document.getElementById("adminMessage").textContent = "✅ Logged in.";
  } else {
    document.getElementById("adminMessage").textContent = "❌ Invalid admin key.";
  }
}

function adminLogout() {
  isAdmin = false;
  document.getElementById("adminControls").style.display = "none";
  document.getElementById("adminKeyInput").style.display = "block";
  document.getElementById("adminLoginButton").style.display = "block";
  document.getElementById("adminMessage").textContent = "";
}

async function loadPendingPhotos() {
  if (!isAdmin) return;
  try {
    const response = await fetch(API_URL + "?action=adminGetPhotos&key=" + ADMIN_KEY);
    const data = await response.json();
    const container = document.getElementById("pendingPhotosList");
    if (data.success && data.photos) {
      const pending = data.photos.filter(p => p.status === "PENDING");
      if (pending.length === 0) {
        container.innerHTML = "<p>No pending photos.</p>";
        return;
      }
      container.innerHTML = "";
      pending.forEach(photo => {
        const div = document.createElement("div");
        div.className = "pending-item";
        div.innerHTML = `
          <img src="${photo.imageUrl}" alt="${photo.caption}">
          <div class="info">
            <strong>${photo.clientName}</strong> - ${photo.caption || ''}<br>
            <small>${new Date(photo.timestamp).toLocaleString()}</small>
          </div>
          <button class="approve-btn" data-id="${photo.id}">✅ Approve</button>
          <button class="delete-btn" data-id="${photo.id}">🗑️ Delete</button>
        `;
        container.appendChild(div);
      });
      container.querySelectorAll(".approve-btn").forEach(btn => {
        btn.addEventListener("click", function () { approvePhoto(this.dataset.id); });
      });
      container.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", function () { deletePhoto(this.dataset.id); });
      });
    } else {
      container.innerHTML = "<p>Error loading pending photos.</p>";
    }
  } catch (error) {
    console.error(error);
  }
}

async function approvePhoto(photoId) {
  if (!isAdmin) return;
  const formData = new URLSearchParams();
  formData.append("action", "adminApprovePhoto");
  formData.append("key", ADMIN_KEY);
  formData.append("photoId", photoId);
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    });
    const data = await response.json();
    document.getElementById("adminMessage").textContent = data.message || data.error;
    if (data.success) {
      loadPendingPhotos();
      loadGallery();
    }
  } catch (error) { console.error(error); }
}

async function deletePhoto(photoId) {
  if (!isAdmin) return;
  if (!confirm("Delete this photo permanently?")) return;
  const formData = new URLSearchParams();
  formData.append("action", "adminDeletePhoto");
  formData.append("key", ADMIN_KEY);
  formData.append("photoId", photoId);
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    });
    const data = await response.json();
    document.getElementById("adminMessage").textContent = data.message || data.error;
    if (data.success) {
      loadPendingPhotos();
      loadGallery();
    }
  } catch (error) { console.error(error); }
}

// ---- INIT ----
document.addEventListener("DOMContentLoaded", function () {
  loadGallery();
  setInterval(loadGallery, 10000);

  document.getElementById("joinButton").addEventListener("click", registerMember);
  document.getElementById("findPassport").addEventListener("click", findPassport);
  document.getElementById("submitDrinkButton").addEventListener("click", submitDrink);
  document.getElementById("uploadPhotoButton").addEventListener("click", uploadPhoto);
  document.getElementById("adminLoginButton").addEventListener("click", adminLogin);
  document.getElementById("adminLogoutButton").addEventListener("click", adminLogout);
});

loadMember();

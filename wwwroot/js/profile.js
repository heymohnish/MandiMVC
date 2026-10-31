/* ---------- Dark mode (same key as the homepage) ---------- */
    const themeToggle = document.getElementById("themeToggle");
    let savedTheme = null;
    try { savedTheme = localStorage.getItem("grocery-theme"); } catch (e) {}

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme ? savedTheme === "dark" : prefersDark) document.body.classList.add("dark-mode");

    function updateThemeIcon() {
      themeToggle.innerHTML = document.body.classList.contains("dark-mode")
        ? '<i class="bi bi-sun"></i>'
        : '<i class="bi bi-moon-stars"></i>';
    }

    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      try {
        localStorage.setItem("grocery-theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
      } catch (e) {}
      updateThemeIcon();
    });
    updateThemeIcon();

    /* ---------- Profile data ---------- */
    const $ = (id) => document.getElementById(id);
    const defaults = { name: "Alex Johnson", email: "alex.johnson@example.com", phone: "+1 555 123 4567" };

    let profile = { ...defaults };
    try {
      const stored = JSON.parse(localStorage.getItem("grocery-profile"));
      if (stored) profile = { ...defaults, ...stored };
    } catch (e) {}

    function initialsOf(name) {
      const parts = name.trim().split(/\s+/).filter(Boolean);
      return ((parts[0]?.[0] || "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() || "?";
    }

    function renderProfile() {
      $("profileName").textContent = profile.name;
      $("profileEmail").textContent = profile.email;
      $("infoEmail").textContent = profile.email;
      $("infoPhone").textContent = profile.phone;
      $("avatarInitials").textContent = initialsOf(profile.name);
    }
    renderProfile();

    /* ---------- Edit modal ---------- */
    const modalEl = $("editProfileModal");
    const formMsg = $("formMsg");

    modalEl.addEventListener("show.bs.modal", () => {
      $("fName").value = profile.name;
      $("fEmail").value = profile.email;
      $("fPhone").value = profile.phone;
      formMsg.textContent = "";
      modalEl.querySelectorAll(".pf-input").forEach((i) => i.classList.remove("invalid"));
    });

    $("profileForm").addEventListener("submit", (e) => {
      e.preventDefault();

      const name = $("fName").value.trim();
      const email = $("fEmail").value.trim();
      const phone = $("fPhone").value.trim();

      const checks = [
        [$("fName"), name.length > 1, "Please enter your full name."],
        [$("fEmail"), $("fEmail").checkValidity() && email.length > 0, "Please enter a valid email address."],
        [$("fPhone"), phone.replace(/\D/g, "").length >= 7, "Please enter a valid phone number."]
      ];

      modalEl.querySelectorAll(".pf-input").forEach((i) => i.classList.remove("invalid"));
      const failed = checks.find(([, ok]) => !ok);
      if (failed) {
        failed[0].classList.add("invalid");
        failed[0].focus();
        formMsg.textContent = failed[2];
        return;
      }

      profile = { name, email, phone };
      try { localStorage.setItem("grocery-profile", JSON.stringify(profile)); } catch (e) {}
      renderProfile();

      bootstrap.Modal.getInstance(modalEl).hide();
      showToast("Profile updated");
    });

    function showToast(message) {
      const toast = $("toast");
      toast.querySelector("span").textContent = message;
      toast.classList.add("show");
      clearTimeout(window.toastTimer);
      window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
    }

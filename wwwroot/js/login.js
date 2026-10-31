// Theme toggle
  const htmlEl = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  function isDarkActive(){
    const attr = htmlEl.getAttribute("data-theme");
    if (attr === "dark") return true;
    if (attr === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function refreshToggleIcon(){ themeToggle.textContent = isDarkActive() ? "☀️" : "🌙"; }
  let savedTheme = null;
  try{ savedTheme = localStorage.getItem("cartTheme"); }catch(e){}
  if (savedTheme) htmlEl.setAttribute("data-theme", savedTheme);
  refreshToggleIcon();
  themeToggle.addEventListener("click", () => {
    const next = isDarkActive() ? "light" : "dark";
    htmlEl.setAttribute("data-theme", next);
    refreshToggleIcon();
    try{ localStorage.setItem("cartTheme", next); }catch(e){}
  });

  // Screens
  const emailScreen = document.getElementById("emailScreen");
  const otpScreen = document.getElementById("otpScreen");
  const profileScreen = document.getElementById("profileScreen");
  const emailForm = document.getElementById("emailForm");
  const otpForm = document.getElementById("otpForm");
  const emailInput = document.getElementById("email");
  const emailPreview = document.getElementById("emailPreview");
  const emailMessage = document.getElementById("emailMessage");
  const otpMessage = document.getElementById("otpMessage");
  const verifyButton = document.getElementById("verifyButton");
  const resendButton = document.getElementById("resendButton");
  const timer = document.getElementById("timer");
  const backButton = document.getElementById("backButton");
  const otpInputs = [...document.querySelectorAll(".otp")];

  let countdown;
  let seconds = 45;

  function showScreen(screenToShow){
    [emailScreen, otpScreen, profileScreen].forEach(s => s.classList.toggle("hidden", s !== screenToShow));
    const content = screenToShow.querySelector(".content");
    content.style.animation = "none";
    void content.offsetWidth;
    content.style.animation = "";
  }

  emailForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!emailInput.checkValidity()){
      emailMessage.textContent = "Please enter a valid email address.";
      emailInput.focus();
      return;
    }
    emailMessage.textContent = "";
    emailPreview.textContent = emailInput.value;
    otpInputs.forEach(input => input.value = "");
    verifyButton.disabled = true;
    showScreen(otpScreen);
    startTimer();
    setTimeout(() => otpInputs[0].focus(), 280);
    console.log("Send OTP to:", emailInput.value);
  });

  otpInputs.forEach((input, index) => {
    input.addEventListener("input", (event) => {
      event.target.value = event.target.value.replace(/\D/g, "").slice(0, 1);
      if (event.target.value && index < otpInputs.length - 1) otpInputs[index + 1].focus();
      updateVerifyState();
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && !input.value && index > 0) otpInputs[index - 1].focus();
      if (event.key === "ArrowLeft" && index > 0) otpInputs[index - 1].focus();
      if (event.key === "ArrowRight" && index < otpInputs.length - 1) otpInputs[index + 1].focus();
    });
    input.addEventListener("paste", (event) => {
      event.preventDefault();
      const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
      pasted.split("").forEach((digit, i) => { if (otpInputs[i]) otpInputs[i].value = digit; });
      const next = Math.min(pasted.length, 3);
      otpInputs[next].focus();
      updateVerifyState();
    });
  });

  function updateVerifyState(){
    const otp = otpInputs.map(input => input.value).join("");
    verifyButton.disabled = otp.length !== 4;
  }

  otpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const otp = otpInputs.map(input => input.value).join("");
    if (otp.length !== 4) return;

    clearInterval(countdown);
    otpMessage.style.color = "var(--forest)";
    otpMessage.textContent = "Verified. Setting up your profile...";
    console.log("Verify:", { email: emailInput.value, otp });

    setTimeout(() => {
      otpMessage.textContent = "";
      showScreen(profileScreen);
      setTimeout(() => document.getElementById("fullName").focus(), 280);
    }, 700);
  });

  backButton.addEventListener("click", () => {
    clearInterval(countdown);
    otpMessage.textContent = "";
    showScreen(emailScreen);
    setTimeout(() => emailInput.focus(), 280);
  });

  resendButton.addEventListener("click", () => {
    console.log("Resend OTP to:", emailInput.value);
    seconds = 45;
    startTimer();
    otpInputs.forEach(input => input.value = "");
    verifyButton.disabled = true;
    otpInputs[0].focus();
  });

  function startTimer(){
    clearInterval(countdown);
    seconds = 45;
    resendButton.disabled = true;
    updateTimer();
    countdown = setInterval(() => {
      seconds--;
      updateTimer();
      if (seconds <= 0){
        clearInterval(countdown);
        resendButton.disabled = false;
        timer.textContent = "";
      }
    }, 1000);
  }
  function updateTimer(){ timer.textContent = ` in 00:${String(seconds).padStart(2, "0")}`; }

  // STEP 3: Profile setup
  const profileFormEl = document.getElementById("profileFormEl");
  const fullNameInput = document.getElementById("fullName");
  const phoneInput = document.getElementById("phone");
  const addressInput = document.getElementById("address");
  const pincodeInput = document.getElementById("pincode");
  const saveProfileButton = document.getElementById("saveProfileButton");
  const profileMessage = document.getElementById("profileMessage");
  const profileForm = document.getElementById("profileForm");
  const profileSuccess = document.getElementById("profileSuccess");

  pincodeInput.addEventListener("input", () => {
    pincodeInput.value = pincodeInput.value.replace(/\D/g, "").slice(0, 6);
    updateProfileState();
  });
  phoneInput.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/[^\d\s]/g, "");
    updateProfileState();
  });
  [fullNameInput, addressInput].forEach(el => el.addEventListener("input", updateProfileState));

  function updateProfileState(){
    const nameOk = fullNameInput.value.trim().length > 1;
    const phoneOk = phoneInput.value.replace(/\D/g, "").length >= 10;
    const addressOk = addressInput.value.trim().length > 4;
    const pincodeOk = /^\d{6}$/.test(pincodeInput.value);
    saveProfileButton.disabled = !(nameOk && phoneOk && addressOk && pincodeOk);
  }

  profileFormEl.addEventListener("submit", (event) => {
    event.preventDefault();
    updateProfileState();
    if (saveProfileButton.disabled) return;

    profileMessage.textContent = "";

    // Replace this with your API call to save the profile.
    console.log("Save profile:", {
      name: fullNameInput.value.trim(),
      phone: phoneInput.value.trim(),
      address: addressInput.value.trim(),
      pincode: pincodeInput.value.trim()
    });
    documents.window.location.href = "index.html";
    
    profileForm.classList.add("hidden");
    profileSuccess.classList.remove("hidden");
  });

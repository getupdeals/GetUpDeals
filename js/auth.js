// ✅ Firebase references
const auth = firebase.auth();
const db = firebase.database();

let confirmationResult = null;

// ✅ Setup reCAPTCHA
function initRecaptcha() {
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    size: 'invisible',
    callback: () => console.log("reCAPTCHA verified"),
  });
  recaptchaVerifier.render();
}

// ✅ Send OTP
function sendOTP() {
  const phone = document.getElementById("signupPhone").value.trim();
  if (!phone) return alert("Please enter a valid phone number");

  initRecaptcha();

  const appVerifier = window.recaptchaVerifier;
  auth.signInWithPhoneNumber(phone, appVerifier)
    .then((result) => {
      confirmationResult = result;
      alert("OTP sent to your phone");
    })
    .catch((error) => {
      console.error(error);
      alert("Failed to send OTP: " + error.message);
    });
}

// ✅ Handle SignUp
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const phone = document.getElementById("signupPhone").value.trim();
    const otpCode = document.getElementById("otpCode").value.trim();
    const referral = document.getElementById("signupRef").value.trim();

    if (!confirmationResult) {
      alert("Please send OTP first");
      return;
    }

    try {
      await confirmationResult.confirm(otpCode);
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await user.updateProfile({ displayName: name });

      const uid = user.uid;
      const referralId = "REF" + uid.slice(0, 6).toUpperCase();

      await db.ref("users/" + uid).set({
        name,
        email,
        phone,
        referralUsed: referral || null,
        referralId,
        createdAt: Date.now()
      });

      alert("Signup successful!");
      window.location.href = "account.html";
    } catch (error) {
      alert("Signup error: " + error.message);
    }
  });
}
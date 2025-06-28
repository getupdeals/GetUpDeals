const auth = firebase.auth();
const db = firebase.database();
const form = document.getElementById("editProfileForm");

auth.onAuthStateChanged(async (user) => {
  if (!user) return location.href = "login.html";
  const uid = user.uid;

  const snap = await db.ref("users/" + uid).once("value");
  const data = snap.val();

  document.getElementById("editName").value = data.name || "";
  document.getElementById("editDOB").value = data.dob || "";
  document.getElementById("editCity").value = data.city || "";
  document.getElementById("editState").value = data.state || "";
  document.getElementById("editGender").value = data.gender || "";
  document.getElementById("editNotifications").checked = data.notifications || false;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const uid = auth.currentUser.uid;

  const updatedData = {
    name: document.getElementById("editName").value.trim(),
    dob: document.getElementById("editDOB").value,
    city: document.getElementById("editCity").value.trim(),
    state: document.getElementById("editState").value.trim(),
    gender: document.getElementById("editGender").value,
    notifications: document.getElementById("editNotifications").checked,
  };

  await db.ref("users/" + uid).update(updatedData);
  alert("Profile updated");
  location.href = "account.html";
});

function changePassword() {
  const email = auth.currentUser.email;
  auth.sendPasswordResetEmail(email).then(() => {
    alert("Password reset email sent");
  }).catch(err => alert(err.message));
}

function deleteAccount() {
  if (confirm("Are you sure you want to delete your account?")) {
    const uid = auth.currentUser.uid;
    db.ref("users/" + uid).remove();
    auth.currentUser.delete().then(() => {
      alert("Account deleted");
      location.href = "signup.html";
    }).catch(err => alert(err.message));
  }
}
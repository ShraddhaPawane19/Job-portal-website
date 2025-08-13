document.getElementById("joinForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("❌ Password and Confirm Password do not match!");
    return;
  }

  // client send the data into server//

  const response = await fetch("http://localhost:5000/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, confirm_password: confirmPassword })  
  });

  const data = await response.json();
  alert(data.message);
});

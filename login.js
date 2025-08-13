document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json(); 
    alert(data.message);

    if (data.success && data.redirectUrl) {
      window.location.href = data.redirectUrl;  // redirect here
    }

  } catch (error) {
    console.error("❌ Error:", error);
    alert("Something went wrong!");
  }
});

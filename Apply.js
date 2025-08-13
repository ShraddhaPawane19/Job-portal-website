document.getElementById("applyForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  try {
    const response = await fetch("http://localhost:5000/apply", {
      method: "POST",
      body: formData, 
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    alert(data.message);
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong: " + err.message);
  }
});

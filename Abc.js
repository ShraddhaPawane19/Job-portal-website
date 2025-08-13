const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechNova Solutions",
    location: "Pune",
    type: "Full-Time",
    description: "Build UI using HTML, CSS, JS. Must know React.",
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "CodeCrafters",
    location: "Mumbai",
    type: "Part-Time",
    description: "Develop APIs in Node.js and Express. Knowledge of SQL required.",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "DesignBox",
    location: "Remote",
    type: "Freelance",
    description: "Create modern UI/UX for web and mobile apps.",
  },
];
// Load jobs into the job list container
function loadJobs(jobList = jobs) {
  const jobContainer = document.getElementById("job-list");
  jobContainer.innerHTML = "";

  if (jobList.length === 0) {
    jobContainer.innerHTML = "<p>No jobs found.</p>";
    return;
  }

  jobList.forEach((job) => {
    const card = document.createElement("div");
    card.className = "job-card";
    card.innerHTML = `
      <h3>${job.title}</h3>
      <p><strong>Company:</strong> ${job.company}</p>
      <p><strong>Location:</strong> ${job.location}</p>
      <p><strong>Type:</strong> ${job.type}</p>
      <button class="view-btn" data-id="${job.id}">View Job</button>
    `;
    jobContainer.appendChild(card);
  });
}

// Run when page is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Load jobs if job-list container is present
  if (document.getElementById("job-list")) {
    loadJobs();
  }
});

// Active link logic
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.nav-link');
  const currentPage = location.pathname.split("/").pop();

  links.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
});
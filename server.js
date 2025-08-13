const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 5000;

//  Serve public folder
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));


//  Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//  Middleware for form parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Multer Storage Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // 'uploads' folder must already exist
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

//  MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sai1234',
  database: 'jobportal'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL Connection Error:',err.stack);
    return;
  }
  console.log('Connectes to MySQL');
});

 //  Login roote
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "All fields are required!" 
    });
  }

  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, result) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Server error" 
      });
    }

    if (result.length > 0) {
      
      // successfull login msg print
      console.log(`login user:
        ✅ Login success for user: ${email}`);

      return res.json({ 
        success: true, 
        message: " ✅ Congratulations You Have Login successful!",
        redirectUrl: "/dashboard"  // frontend redirect
      });
    } else {
      // wrong login attempt terminal nothing  print
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }
  });
});

//  GET JOB LISTINGS
app.get('/jobs', (req, res) => {
  const sql = 'SELECT * FROM jobs';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching jobs:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
    res.json({ success: true, jobs: results });
  });
});


//  SUBMIT JOB APPLICATION

app.post("/apply", upload.single("resume"), (req, res) => {
  console.log("Received /apply request");
  const { fullname, email, job_id } = req.body;
  const resumeFileName = req.file ? req.file.originalname : null;
  console.log(` Apply for job user:
    fullname: ${fullname}, email: ${email}, job_id: ${job_id}, resume: ${resumeFileName}`);

  if (!fullname || !email || !job_id || !resumeFileName) {
    console.log("Missing fields detected");
    return res.status(400).json({ success: false, message: "All fields are required!" });
  }

  const checkJobQuery = "SELECT * FROM jobs WHERE id = ?";
  db.query(checkJobQuery, [job_id], (err, jobResults) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (jobResults.length === 0) {
      //console.log("Invalid job_id:", job_id);
      return res.status(404).json({ success: false, message: "Invalid Job ID!" });
    }

    const insertQuery = "INSERT INTO applications (name, email, resume, job_id) VALUES (?, ?, ?, ?)";
    db.query(insertQuery, [fullname, email, resumeFileName, job_id], (err, result) => {
      if (err) {
        console.error("Insert Error:", err);
        return res.status(500).json({ success: false, message: "Database insert error" });
      }
      console.log(" ✅ Application inserted successfully for:", email);
      res.json({ success: true, message: " ✅ Application submitted successfully!" });
    });
  });
});


// join route
  app.use(express.json()); // Make sure this middleware is included to parse JSON bodies

app.post("/join", (req, res) => {
  try {
    console.log("joine user:", req.body );
    const {name, email, password, confirm_password } = req.body;

    // Validate required fields
    if (!name || !email || !password || !confirm_password) {
      return res.status(400).json({ success: false, message: "Please fill all the fields." });
    }

    // Insert query
    const query = "INSERT INTO join_users (name, email, password, confirm_password) VALUES (?, ?, ?, ?)";

    db.query(query, [name, email, password, confirm_password], (err, result) => {
      if (err) {
        console.error("Database Insert Error:", err);
        return res.status(500).json({ success: false, message: "Database error occurred." });
      }

      if (result.affectedRows === 1) {
        // Insert successful
        return res.json({ success: true, message: " ✅ Congratulation You Join Smart Job Portal." });
      } else {
        // Insert failed for some reason
        return res.status(400).json({ success: false, message: " Registration failed." });
      }
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// 🚀 START SERVER
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

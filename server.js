const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs"); // optional if you want templates

// File upload setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Serve index page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

// Serve admin panel
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "views/admin.html"));
});

// Get suggestions
app.get("/api/suggestions", (req, res) => {
  try {
    const filePath = "data/suggestions.json";

    if (!fs.existsSync(filePath)) {
      return res.json([]);
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.setHeader("Cache-Control", "no-store");
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// Add suggestion
app.post("/api/suggestions", upload.single("photo"), (req, res) => {
  try {
    const filePath = "data/suggestions.json";

    // Ensure file exists
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const newItem = {
      id: Date.now(),
      name: req.body.name,
      location: req.body.location,
      description: req.body.description,
      timings: req.body.timings,
      approxTime: req.body.approxTime,
      importantLink: req.body.importantLink,
      photo: req.file ? `/uploads/${req.file.filename}` : "",
      createdAt: new Date().toISOString(),
    };

    data.push(newItem);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    res.status(201).json(newItem);
  } catch (err) {
    console.error("Error saving suggestion:", err);
    res.status(500).json({ error: "Failed to save suggestion" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

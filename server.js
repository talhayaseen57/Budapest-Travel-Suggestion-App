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
  const data = fs.readFileSync("data/suggestions.json");
  res.json(JSON.parse(data));
});

// Add suggestion
app.post("/api/suggestions", upload.single("photo"), (req, res) => {
  const data = JSON.parse(fs.readFileSync("data/suggestions.json"));
  const newItem = {
    id: Date.now(),
    name: req.body.name,
    location: req.body.location,
    description: req.body.description,
    timings: req.body.timings,
    photo: req.file ? "/uploads/" + req.file.filename : "",
    approxTime: req.body.approxTime,
    importantLink: req.body.importantLink,
  };
  data.push(newItem);
  fs.writeFileSync("data/suggestions.json", JSON.stringify(data, null, 2));
  res.redirect("/");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

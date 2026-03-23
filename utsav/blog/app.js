const express = require("express");
const fs = require("fs");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "articles.json");

// --- Configuration ---
app.set("view engine", "ejs"); // Tell Express to use EJS
app.use(express.static("public")); // Serve CSS from the 'public' folder
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(
  session({
    secret: "my-super-secret-key", // In production, keep this hidden!
    resave: false,
    saveUninitialized: false,
  }),
);

// --- Helper Functions ---
// Read articles from the JSON file
const getArticles = () => {
  const data = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(data || "[]");
};

// Save articles to the JSON file
const saveArticles = (articles) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2));
};

// Middleware to protect Admin routes
const requireAuth = (req, res, next) => {
  if (req.session.isLoggedIn) {
    next(); // Let them through
  } else {
    res.redirect("/login");
  }
};

// ==========================================
//               GUEST ROUTES
// ==========================================

// Home Page
app.get(["/", "/home"], (req, res) => {
  const articles = getArticles();
  res.render("home", { articles });
});

// Single Article Page
app.get("/article/:id", (req, res) => {
  const articles = getArticles();
  const article = articles.find((a) => a.id === req.params.id);
  if (!article) return res.status(404).send("Article not found");
  res.render("article", { article });
});

// ==========================================
//               ADMIN ROUTES
// ==========================================

// Login Pages
app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Hardcoded credentials for this project scope
  if (username === "admin" && password === "password123") {
    req.session.isLoggedIn = true;
    res.redirect("/admin");
  } else {
    res.render("login", { error: "Invalid credentials" });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/home");
});

// Admin Dashboard
app.get("/admin", requireAuth, (req, res) => {
  const articles = getArticles();
  res.render("admin", { articles });
});

// Create New Article (Show Form)
app.get("/new", requireAuth, (req, res) => {
  res.render("new");
});

// Create New Article (Handle Submission)
app.post("/new", requireAuth, (req, res) => {
  const { title, date, content } = req.body;
  const articles = getArticles();

  const newArticle = {
    id: Date.now().toString(), // Simple unique ID
    title,
    date,
    content,
  };

  articles.push(newArticle);
  saveArticles(articles);
  res.redirect("/admin");
});

// Edit Article (Show Form)
app.get("/edit/:id", requireAuth, (req, res) => {
  const articles = getArticles();
  const article = articles.find((a) => a.id === req.params.id);
  if (!article) return res.status(404).send("Article not found");

  res.render("edit", { article });
});

// Edit Article (Handle Submission)
app.post("/edit/:id", requireAuth, (req, res) => {
  const { title, date, content } = req.body;
  const articles = getArticles();

  const index = articles.findIndex((a) => a.id === req.params.id);
  if (index !== -1) {
    articles[index] = { ...articles[index], title, date, content };
    saveArticles(articles);
  }
  res.redirect("/admin");
});

// Delete Article
app.post("/delete/:id", requireAuth, (req, res) => {
  let articles = getArticles();
  articles = articles.filter((a) => a.id !== req.params.id);
  saveArticles(articles);
  res.redirect("/admin");
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// app.js

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());

// -----------------------------
// Fake Database
// -----------------------------
let users = [];
let posts = [];

// -----------------------------
// Config
// -----------------------------
const SECRET = "supersecretkey";

// -----------------------------
// Middleware: Auth
// -----------------------------
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// -----------------------------
// Middleware: Logger
// -----------------------------
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

app.use(logger);

// -----------------------------
// Register
// -----------------------------
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
    };

    users.push(newUser);

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// Login
// -----------------------------
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = users.find((u) => u.username === username);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// Create Post
// -----------------------------
app.post("/posts", authMiddleware, (req, res) => {
  try {
    const { title, content } = req.body;

    const newPost = {
      id: posts.length + 1,
      userId: req.user.id,
      title,
      content,
      createdAt: new Date(),
    };

    posts.push(newPost);

    res.json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// Get All Posts
// -----------------------------
app.get("/posts", (req, res) => {
  res.json(posts);
});

// -----------------------------
// Get Single Post
// -----------------------------
app.get("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.json(post);
});

// -----------------------------
// Update Post
// -----------------------------
app.put("/posts/:id", authMiddleware, (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.userId !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const { title, content } = req.body;

  post.title = title || post.title;
  post.content = content || post.content;

  res.json(post);
});

// -----------------------------
// Delete Post
// -----------------------------
app.delete("/posts/:id", authMiddleware, (req, res) => {
  const index = posts.findIndex((p) => p.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (posts[index].userId !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  posts.splice(index, 1);

  res.json({ message: "Post deleted" });
});

// -----------------------------
// Error Handling Middleware
// -----------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// -----------------------------
// Server Start
// -----------------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

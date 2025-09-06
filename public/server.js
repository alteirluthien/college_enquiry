const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const path = require("path");

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// 👉 Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

// Root route serves the chatbot HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "chatbots.html"));
});

// Example API: get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Example API: health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Railway assigns the port automatically
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

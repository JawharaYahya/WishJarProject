const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const routeGuard = require("../middleware/verifyToken");
const pg = require('pg');
const {nanoid}=require('nanoid');

const pool = new pg.Pool({connectionString: process.env.DATABASE_URL});

//register

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
const publicLink= nanoid(8); // generate unique public ID per wish

    const result = await pool.query(
      `INSERT INTO users (username, email, password,public_link)
       VALUES ($1, $2, $3,$4)
       RETURNING id, username,public_link`,
      [username, email, hashedPassword,publicLink]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      res.status(409).json({ message: "Username or email already exists" });
    } else {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }
});

//login 

router.post("/login", async (req, res) => {
 const { email, password } = req.body;
try {
  
const userQuery = await pool.query(
  "SELECT * FROM users WHERE email = $1",
  [email]
);
    const user = userQuery.rows[0];

if (!user) return res.status(404).json({ message: "Email not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

   const token = jwt.sign(
  { id: user.id, username: user.username, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: "2h" }
);

    res.json({ message: "Login successful",
       token ,
       public_link: user.public_link
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/profile", routeGuard, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error getting profile", error: error.message });
  }
});

module.exports = router;

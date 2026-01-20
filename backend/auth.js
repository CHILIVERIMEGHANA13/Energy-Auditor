import { Router } from 'express';
const router = Router();
import User from '../models/user.js';
import jwt from 'jsonwebtoken';         // Destructure
import { login } from "../controllers/authController.js"; 
import bcrypt from 'bcryptjs';        // Import default
const { hash, compare } = bcrypt;

// Use environment variable for security
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "Email already exists" });

  const hashedPassword = await hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ message: "User created successfully" });
});

router.post("/login", login); 
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 2. Match password
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 3. JWT payload and sign
    const payload = {
      user: {
        id: user._id,
        role: user.role, // 👈 include role in payload
      },
    };

    const token = jwt.sign(
  { userId: user._id }, // 👈 make sure this matches what your middleware expects
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

    res.json({ token }); // 👈 frontend uses this
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log("Admin login attempt:", user); // Add this line

    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Not an admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
export default router;


import { Router } from 'express';
const router = Router();
import expressJwt from 'jsonwebtoken'; // Import default
const { sign } = expressJwt;          // Destructure

import bcrypt from 'bcryptjs';        // Import default
const { hash, compare } = bcrypt;

import Admin from '../models/Admin.js'; // your admin model


// @route   POST /api/auth/admin/login
// @desc    Admin login
// @access  Public

// @route   POST /api/auth/admin/signup
// @desc    Admin signup
// @access  Public (initially)
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 2. Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin already exists' });
    }

    // 3. Hash password
    const hashedPassword = await hash(password, 10);

    // 4. Create new admin
    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();

    // 5. Generate JWT
    const token = sign({ id: newAdmin._id, role: 'admin' }, 'secretkey', {
      expiresIn: '1d'
    });

    res.status(201).json({ token });
  } catch (err) {
    console.error('Admin signup error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check for required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 2. Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Compare password
    const isMatch = await compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 4. Sign JWT
    const token = sign({ id: admin._id, role: 'admin' }, 'secretkey', {
      expiresIn: '1d'
    });

    // 5. Send token
    res.json({ token });

  } catch (err) {
    console.error('Admin login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

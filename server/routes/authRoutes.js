const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const auth = require('../middleware/auth');

const JWT_SECRET = "secret123"; // you can later move this to .env

// =======================
// SIGNUP
// =======================
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json("User registered successfully");

  } catch (err) {
    res.status(500).json(err);
  }
});


// =======================
// LOGIN
// =======================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json("Invalid credentials");

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json(err);
  }
});


// =======================
// GET MY PROFILE
// =======================
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});


// =======================
// UPDATE PROFILE
// =======================
router.put('/profile', auth, async (req, res) => {
  try {
    const { department, bio, image } = req.body;

    const user = await User.findById(req.user.id);

    user.department = department;
    user.bio = bio;
    user.image = image;

    await user.save();

    res.json(user);

  } catch (err) {
    res.status(500).json(err);
  }
});


// =======================
// GET PUBLIC USER PROFILE
// =======================
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name department bio image');

    res.json(user);

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
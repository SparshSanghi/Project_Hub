const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// SIGNUP
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();
    res.json({ message: "User created" });

  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
});


// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json("Wrong password");

  const token = jwt.sign({ id: user._id }, "secret123");

  res.json({ token, user });
});
// =======================
// GET USER PROFILE
// =======================
const auth = require('../middleware/auth');

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
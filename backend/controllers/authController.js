const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'bidder', // Default to bidder if not specified
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // --- 1. HARDCODED ADMIN CHECK (Bypass DB) ---
    if (email === 'smrizvi.i29@gmail.com' && password === 'admin555@2026') {
        return res.json({
            _id: 'static_admin_id_999',
            name: 'Super Admin',
            email: 'smrizvi.i29@gmail.com',
            role: 'admin',
            token: generateToken('static_admin_id_999'),
        });
    }

    // --- 2. Standard User Login (Database Check) ---
    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  // If it's the static admin, return static data
  if (req.user.id === 'static_admin_id_999') {
     return res.status(200).json({
        _id: 'static_admin_id_999',
        name: 'Super Admin',
        email: 'smrizvi.i29@gmail.com',
        role: 'admin'
     });
  }

  const user = await User.findById(req.user.id);
  res.status(200).json(user);
};
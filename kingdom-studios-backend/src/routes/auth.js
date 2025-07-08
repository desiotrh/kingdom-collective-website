import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import { isMockMode, MockDB } from '../config/database.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('faithMode').optional().isBoolean()
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password, firstName, lastName, faithMode = false } = req.body;

    // Check if user already exists
    let existingUser;
    if (isMockMode()) {
      existingUser = MockDB.users.findOne({ email });
    } else {
      existingUser = await User.findOne({ email });
    }
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    let user;
    if (isMockMode()) {
      user = MockDB.users.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        profile: {
          faithMode,
          preferences: {
            contentFiltering: faithMode,
            emailNotifications: true,
            pushNotifications: true
          }
        }
      });
    } else {
      user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        profile: {
          faithMode,
          preferences: {
            contentFiltering: faithMode,
            emailNotifications: true,
            pushNotifications: true
          }
        }
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        faithMode: user.profile.faithMode 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log registration
    logger.info('User registered successfully', { 
      userId: user._id, 
      email: user.email,
      faithMode: user.profile.faithMode 
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        faithMode: user.profile.faithMode,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during registration'
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    let user;
    if (isMockMode()) {
      user = MockDB.users.findOne({ email });
    } else {
      user = await User.findOne({ email });
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Update last login
    if (isMockMode()) {
      user.lastLoginAt = new Date();
      MockDB.users.updateOne(user._id, user);
    } else {
      user.lastLoginAt = new Date();
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        faithMode: user.profile.faithMode 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log login
    logger.info('User logged in successfully', { 
      userId: user._id, 
      email: user.email 
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        faithMode: user.profile.faithMode,
        lastLoginAt: user.lastLoginAt
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during login'
    });
  }
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh JWT token
 * @access  Private
 */
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    let user;
    if (isMockMode()) {
      user = MockDB.users.findById(req.user.userId);
    } else {
      user = await User.findById(req.user.userId);
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Generate new JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        faithMode: user.profile.faithMode 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        faithMode: user.profile.faithMode
      }
    });

  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during token refresh'
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', authenticateToken, (req, res) => {
  try {
    // Log logout
    logger.info('User logged out', { 
      userId: req.user.userId, 
      email: req.user.email 
    });

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during logout'
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    let user;
    if (isMockMode()) {
      user = MockDB.users.findById(req.user.userId);
    } else {
      user = await User.findById(req.user.userId).select('-password');
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        faithMode: user.profile.faithMode,
        preferences: user.profile.preferences,
        subscription: user.subscription,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      }
    });

  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching profile'
    });
  }
});

/**
 * @route   PATCH /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.patch('/profile', [
  authenticateToken,
  body('firstName').optional().trim().isLength({ min: 1 }),
  body('lastName').optional().trim().isLength({ min: 1 }),
  body('faithMode').optional().isBoolean(),
  body('preferences').optional().isObject()
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    let user;
    if (isMockMode()) {
      user = MockDB.users.findById(req.user.userId);
    } else {
      user = await User.findById(req.user.userId);
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update allowed fields
    const { firstName, lastName, faithMode, preferences } = req.body;
    
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (faithMode !== undefined) user.profile.faithMode = faithMode;
    if (preferences !== undefined) {
      user.profile.preferences = { ...user.profile.preferences, ...preferences };
    }

    if (isMockMode()) {
      MockDB.users.updateOne(user._id, user);
    } else {
      await user.save();
    }

    logger.info('User profile updated', { userId: user._id });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        faithMode: user.profile.faithMode,
        preferences: user.profile.preferences
      }
    });

  } catch (error) {
    logger.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while updating profile'
    });
  }
});

export default router;

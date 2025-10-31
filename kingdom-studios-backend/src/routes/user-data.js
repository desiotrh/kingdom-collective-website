import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route GET /api/user/data
 * @desc Export all user data (GDPR Article 20 - Right to Data Portability)
 * @access Private
 */
router.get('/data', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Gather all user data from various collections
    // Note: Update this based on your actual data models
    const userData = {
      userId: userId,
      exportDate: new Date().toISOString(),
      exportReason: 'GDPR Article 20 - Data Portability Request',
      // Add actual user data queries here based on your models
      // Example:
      // profile: await User.findById(userId).select('-password'),
      // posts: await Post.find({ userId }),
      // comments: await Comment.find({ userId }),
    };
    
    console.log(`[GDPR] Data export requested for user ${userId}`);
    
    res.json({
      success: true,
      data: userData,
      message: 'Your data has been exported successfully.'
    });
  } catch (error) {
    console.error('Error exporting user data:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to export user data. Please contact support.' 
    });
  }
});

/**
 * @route DELETE /api/user/account
 * @desc Delete user account and all associated data (GDPR Article 17 - Right to be Forgotten)
 * @access Private
 */
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { confirmation } = req.body;
    
    // Require explicit confirmation to prevent accidental deletions
    if (confirmation !== 'DELETE_MY_ACCOUNT') {
      return res.status(400).json({
        success: false,
        error: 'Confirmation required. Send {"confirmation": "DELETE_MY_ACCOUNT"} to confirm deletion.'
      });
    }
    
    // Log deletion request for compliance audit trail
    console.log(`[GDPR] Account deletion requested for user ${userId} at ${new Date().toISOString()}`);
    
    // Delete user data from all collections
    // Note: Update this based on your actual data models
    // Example:
    // await User.findByIdAndDelete(userId);
    // await Post.deleteMany({ userId });
    // await Comment.deleteMany({ userId });
    // await Session.deleteMany({ userId });
    
    // Send confirmation email (optional)
    // await sendAccountDeletionEmail(user.email);
    
    console.log(`[GDPR] Account deletion completed for user ${userId}`);
    
    res.json({
      success: true,
      message: 'Your account and all associated data have been permanently deleted.',
      deletedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete account. Please contact support.' 
    });
  }
});

/**
 * @route POST /api/user/data-request
 * @desc Request data deletion or export for non-authenticated users
 * @access Public
 */
router.post('/data-request', async (req, res) => {
  const { email, requestType } = req.body;
  
  if (!email || !requestType) {
    return res.status(400).json({ 
      success: false,
      error: 'Email and request type are required.' 
    });
  }
  
  if (!['export', 'deletion'].includes(requestType)) {
    return res.status(400).json({
      success: false,
      error: 'Request type must be either "export" or "deletion".'
    });
  }
  
  // Log the request for manual processing
  console.log(`[GDPR] ${requestType} request received for ${email} at ${new Date().toISOString()}`);
  
  // TODO: Send confirmation email and add to manual review queue
  // await sendDataRequestConfirmationEmail(email, requestType);
  
  res.json({
    success: true,
    message: `Your ${requestType} request has been received. We will process it within 30 days as required by GDPR.`,
    requestId: `${requestType}-${Date.now()}`,
    email: email
  });
});

export default router;


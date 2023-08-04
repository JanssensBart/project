const express = require('express');
const { 
    authUser,
    registerUser,
    logoutUser,
    handleRefreshToken,
    getUserProfile,
    updateUserProfile } = require('../controllers/userController');

const router = express.Router()
const {protect} = require('../middleware/authMiddleware')

router.post('/register', registerUser)
router.post('/auth', authUser)
router.post('/logout', logoutUser)
router.get('/refresh', handleRefreshToken)
router.get('/profile', protect, getUserProfile)
router.put('/profile', protect, updateUserProfile)




module.exports = router;
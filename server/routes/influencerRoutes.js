const express = require('express')
const router = express.Router()
const {
    registerInfluencer,
    login,
    getMe
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
const { upload, cb } = require('../controller sas')

router.post('/', upload.single('profileImage'), cb, registerInfluencer)
router.post('/login', loginInfluencer)
router.get('/me', protect, getMe)


module.exports = router

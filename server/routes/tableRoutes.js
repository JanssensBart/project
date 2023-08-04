const express = require('express');
const {  } = require('../controllers/casinoController');

const router = express.Router()
const {protect} = require('../middleware/authMiddleware')

router.post('/newtable', createCasino)


module.exports = router;
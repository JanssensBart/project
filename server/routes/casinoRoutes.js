const express = require('express');
const { createCasino,deleteCasinoById,updateCasino,getCasinos } = require('../controllers/casinoController');
const { addUser } = require('../controllers/casinoActionsController');

const router = express.Router()
const {protect} = require('../middleware/authMiddleware')

/* ADMIN */
router.get('/getCasinos', getCasinos)
router.post('/newCasino', createCasino)
router.put('/updateCasino', updateCasino)
router.delete('/deleteCasinoById', deleteCasinoById)

/* CASINO ACTIONS */
router.put('/addUser',addUser)


module.exports = router;
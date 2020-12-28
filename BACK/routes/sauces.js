const express = require('express');
const router = express.Router();
const stuffCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

/** Routes - CRUD and Specific functions Sauces **/

router.get('/', auth, stuffCtrl.getAllSauces);
router.get('/:id', auth, stuffCtrl.getOneSauce);
router.post('/', auth, multer, stuffCtrl.createSauce);
router.put('/:id', auth, multer, stuffCtrl.modifySauce);
router.delete('/:id', auth, stuffCtrl.deleteSauce);
router.post('/:id/like', auth, stuffCtrl.likeSauce);

module.exports = router;
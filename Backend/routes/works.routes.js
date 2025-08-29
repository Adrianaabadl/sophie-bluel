const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer-config');
const auth = require('../middlewares/auth');
const checkWork = require('../middlewares/checkWork');
const workCtrl = require('../controllers/works.controller');

router.post('/', auth, multer, checkWork, workCtrl.create);
router.get('/', workCtrl.findAll); // We can actually get all the projects without auth
router.delete('/:id', auth, workCtrl.delete);

module.exports = router;

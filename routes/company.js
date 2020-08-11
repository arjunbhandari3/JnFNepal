const router = require('express').Router();
const companyController = require('../controllers/companyController');
const auth = require('../middlewares/auth');
const companyAuth = require('../middlewares/companyAuth');

router.get('/company/complete', auth, companyAuth, companyController.completeProfilePage);

router.post('/company/complete', auth, companyAuth, companyController.completeProfilePagePost);

router.get('/post', auth, companyAuth, companyController.postJobPage);

router.post('/post', auth, companyAuth, companyController.insertJob);

module.exports = router;
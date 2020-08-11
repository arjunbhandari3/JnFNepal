const router = require('express').Router();
const employeeController = require('../controllers/employeeController');
const auth = require('../middlewares/auth');
const employeeAuth = require('../middlewares/employeeAuth');

router.get('/profile', auth, employeeAuth, (req, res) => {
    res.redirect('/employee/profile/' + req.userData.id);
});

router.get('/employee/profile/:id', auth, employeeController.viewProfile);

router.get('/employee/complete', auth, employeeAuth, employeeController.completeProfilePage1);

router.post('/employee/complete', auth, employeeAuth, employeeController.completeProfilePage1Post);

router.get('/employee/complete2', auth, employeeAuth, employeeController.completeProfilePage2);

router.post('/employee/complete2', auth, employeeAuth, employeeController.completeProfilePage2Post);

router.get('/employee/complete3', auth, employeeAuth, employeeController.completeProfilePage3);

router.post('/employee/complete3', auth, employeeAuth, employeeController.completeProfilePage3Post);

module.exports = router;
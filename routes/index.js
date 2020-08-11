const router = require('express').Router();
const md5 = require('md5');
const jwt = require('jwt-then');
const moment = require('moment');
const userController = require('../controllers/userController');
const jobsController = require('../controllers/jobsController');
const auth = require('../middlewares/auth');

router.get('/',async (req, res) => {
    const cities = await poolQuery("SELECT * FROM cities", []);

    res.render('index', {
        cities
    });
});

router.get('/login', userController.loginPage);

router.post('/login', userController.login)

router.post('/register', userController.register);

router.get('/logout', userController.logout);

router.get('/jobs/category/:category', async(req, res)=>{
    const cities = await poolQuery("SELECT * FROM cities", []);
    const categories = await poolQuery("SELECT * FROM categories", []);
    res.render('findJobs', {
        category: req.params.category,
        cities,
        categories
    });
})

router.get('/jobs/city/:city', async (req, res) => {
    const cities = await poolQuery("SELECT * FROM cities", []);
    const categories = await poolQuery("SELECT * FROM categories", []);
    res.render('findJobs', {
        city: req.params.city,
        cities,
        categories
    });
})

router.get('/find', async (req, res) => {
    const cities = await poolQuery("SELECT * FROM cities", []);
    const categories = await poolQuery("SELECT * FROM categories", []);
    res.render('findJobs', {
        cities,
        categories
    });
});

router.post('/find', async (req, res) => {
    const cities = await poolQuery("SELECT * FROM cities", []);
    const categories = await poolQuery("SELECT * FROM categories", []);
    res.render('findJobs', {
        keywords: req.body.keywords,
        city: req.body.city,
        cities,
        categories
    });
});

router.post('/jobs/search', async (req, res) => {
    var values = [req.body.keywords, req.body.keywords];
    var sql = "SELECT jobs.*, companies.name FROM jobs, companies WHERE (INSTR(title, ?) OR INSTR(keywords, ?))";

    if (req.body.city !== 'any'){
        sql += " AND jobs.city=?";
        values.push(req.body.city);
    }

    if (req.body.category !== 'any'){
        sql += " AND category=?";
        values.push(req.body.category);
    }

    if (req.body.types.length > 0){
        sql += " AND INSTR(?, CONCAT('(',type,')'))";
        values.push(req.body.types);
    }

    sql += " AND jobs.company_id=companies.id AND expiry_date > ?";

    values.push(Date.now());

    sql += " LIMIT 50";

    var jobs = await poolQuery(sql, values);

    jobs = jobs.map(job => {
        job.posted_on = moment.unix(job.posted_on/1000).format("MM/DD/YYYY");
        return job;
    })

    res.render("jobSearchResults", {
        jobs: jobs
    });
})

router.get('/jobs/view/:id', jobsController.viewJob);

module.exports = router;
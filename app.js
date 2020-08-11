const express = require('express');
const app = express();
const helpers = require('./helpers');
const jwt = require('jwt-then');
const upload = require('express-fileupload');

app.engine('hbs', require('exphbs'));
app.set('view engine', 'hbs');

require('dotenv').config({
    path: './VARIABLES.env'
});

app.use(express.static('public'))
app.use(upload());

const session = require('express-session');
app.use(session({
    cookie: {
        maxAge: 3000
    },
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(require('flash')());

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

app.use((req, res, next) => {
    let token = req.cookies.token || "";
    res.locals.h = helpers;
    res.locals.url = req.originalUrl;

    jwt.verify(token, process.env.SECRET).then(payload => {
        req.userData = payload;
        if (payload.type === "company") {
            res.locals.company = true;
        } else if (payload.type === "employee") {
            res.locals.employee = true;
        }
        next();
    }).catch(err => {
        res.locals.company = false;
        res.locals.employee = false;

        next();
    });
});

app.use('/', require('./routes/index'));
app.use('/', require('./routes/employee'));
app.use('/', require('./routes/company'));
app.use('/', require('./routes/chat'));

module.exports = app;
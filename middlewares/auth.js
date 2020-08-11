const jwt = require('jwt-then');

module.exports = (req, res, next) => {
    var token = req.cookies.token || "";

    jwt.verify(token, process.env.SECRET).then(payload => {
        next();
    }).catch(err => {
        req.flash('error', "Authentication failed for the route you tried to access. Please login.");
        res.redirect('/login');
    })
}
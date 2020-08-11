module.exports = (req, res, next) => {
    if (req.userData.type !== 'employee') {
        req.flash('error', "Restricted access for that route.");
        res.redirect('/');
    } else {
        next();
    }
};
const md5 = require('md5');
const jwt = require('jwt-then');

exports.loginPage = (req, res) => {
    if (req.query.target === "register") {
        res.render('login', {
            register: true
        });
    } else {
        res.render('login', {
            register: false
        });
    }
};

exports.login = async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var type = req.body.type;

    var id = "";

    try {
        if (!(type === "company" || type === "employee")) throw "Select the type of account you're trying to create.";

        if (type === "company") {
            data = await poolQuery("SELECT id FROM companies WHERE email=? AND password=?", [email, md5(password)]);
            if (data.length < 1) throw "Email and password did not match.";
            id = data[0].id;
        } else {
            data = await poolQuery("SELECT id FROM employees WHERE email=? AND password=?", [email, md5(password)]);
            if (data.length < 1) throw "Email and password did not match.";
            id = data[0].id;
        }

        jwt.sign({
            id: id,
            type: type
        }, process.env.SECRET).then(token => {
            res.cookie('token', token, {
                maxAge: 2592000000
            });
            req.flash('success', "Logged in successfully.");
            res.redirect('/');
        });
    } catch (err) {
        req.flash('error', err)
        res.render('login', {
            register: false,
            logBody: req.body
        });
    }
}

exports.register = async (req, res) => {
    var type = req.body.type;
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;

    var emailRegEx = /@gmail.com|@yahoo.com|@hotmail.com|@ymail.com|@live.com|@microsoft.com|@googlemail.com|@rocketmail.com/;

    try {
        if (!(type === "company" || type === "employee")) throw "Select the type of account you're trying to create.";
        if (!emailRegEx.test(email)) throw "We do not support emails from the domain you've provied.";
        if (name.length < 3) throw "Insert a valid name";
        if (password.length < 5) throw "Enter password of atleast five characters.";
        if (password !== password2) throw "Confirmed password didn't match.";

        var insertId = "";

        if (type === "employee") {
            data = await poolQuery("SELECT COUNT(*) as num FROM employees WHERE email=?", [email]);
            if (data[0].num > 0) throw "Email already associated to another account.";
            result = await poolQuery("INSERT INTO employees (email, password, full_name) VALUES (?,?,?)", [email, md5(password), name]);
            insertId = result.insertId;
        } else {
            data = await poolQuery("SELECT COUNT(*) as num FROM companies WHERE email=?", [email]);
            if (data[0].num > 0) throw "Email already associated to another account.";
            result = await poolQuery("INSERT INTO companies (email, password, name) VALUES (?,?,?)", [email, md5(password), name]);
            insertId = result.insertId;
        }

        jwt.sign({
            id: insertId,
            type: type
        }, process.env.SECRET).then(token => {
            res.cookie('token', token, {
                maxAge: 2592000000
            });
            req.flash('success', "Registration was successful. Now complete the profile to get started.");
            res.redirect('/' + type + '/complete');
        });
    } catch (err) {
        req.flash('error', err)
        res.render('login', {
            register: true,
            regBody: req.body
        });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/')
};
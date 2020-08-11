const router = require('express').Router();
const auth = require('../middlewares/auth');

router.get('/messages', auth, async (req, res) => {
    if (req.userData.type === "employee") {
        data = await poolQuery("SELECT employee_id, company_id FROM messagelist WHERE employee_id=? ORDER BY id DESC LIMIT 1", [req.userData.id])
    } else {
        data = await poolQuery("SELECT employee_id, company_id FROM messagelist WHERE company_id=? ORDER BY id DESC LIMIT 1", [req.userData.id])
    }
    if (data.length > 0) {
        res.redirect('/chat/' + data[0].employee_id + '/' + data[0].company_id + '/page');
    } else {
        req.flash("error", "You have not started chat with anyone. You can visit this page after you start communicating.");
        res.redirect('/');
    }
})

router.get('/messageList', auth, async (req, res) => {
    var data;
    if (req.userData.type === "employee") {
        data = await poolQuery("SELECT messagelist.*, companies.name as full_name, companies.logo as picture FROM messagelist INNER JOIN companies ON companies.id=messagelist.company_id AND messagelist.employee_id=? ORDER BY id DESC", [req.userData.id]);
    } else {
        data = await poolQuery("SELECT messagelist.*, employees.full_name, employee_profiles.picture FROM messagelist INNER JOIN employees ON employees.id=messagelist.employee_id AND messagelist.company_id=? INNER JOIN employee_profiles ON employee_profiles.employee_id=messagelist.employee_id ORDER BY id DESC", [req.userData.id]);
    }
    res.render('messageList', {
        messages: data
    });
});

router.get('/chat/:employee_id/:company_id/page', auth, async (req, res) => {
    var name;
    if (req.userData.type === "company") {
        data = await poolQuery("SELECT full_name FROM employees WHERE id=?", [req.params.employee_id]);
        name = data[0].full_name;
    } else {
        data = await poolQuery("SELECT name FROM companies WHERE id=?", [req.params.company_id]);
        name = data[0].name;
    }

    res.render('chat/chat', {
        type: req.userData.type,
        name: name
    });
});

router.post('/chat/:employee_id/:company_id/send', auth, async (req, res) => {
    req.body.message = req.body.message.trim();

    try {
        if (req.body.message.length < 1) throw "Empty message";
        if (req.userData.type === "employee" && req.userData.id != req.params.employee_id) throw "Not authorized";
        if (req.userData.type === "company" && req.userData.id != req.params.company_id) throw "Not authorized";

        var result = await poolQuery("INSERT INTO messages (employee_id,company_id, sender, message) VALUES (?,?,?,?)", [req.params.employee_id, req.params.company_id, req.userData.type, req.body.message]);
        const data = await poolQuery("DELETE FROM messagelist WHERE employee_id=? AND company_id=?", [req.params.employee_id, req.params.company_id])
        const data2 = await poolQuery("INSERT INTO messagelist (employee_id,company_id, sender, message) VALUES (?,?,?,?)", [req.params.employee_id, req.params.company_id, req.userData.type, req.body.message]);

        res.send("Message sent");
    } catch (err) {
        res.status(403).send(err);
    }
});

router.get('/chat/:employee_id/:company_id/oldMessages', auth, async (req, res) => {
    try {
        if (req.userData.type === "employee" && req.userData.id != req.params.employee_id) throw "Not authorized";
        if (req.userData.type === "company" && req.userData.id != req.params.company_id) throw "Not authorized";

        var result = await poolQuery("SELECT messages.id, messages.sender, messages.message, companies.logo, employee_profiles.picture FROM messages INNER JOIN employee_profiles ON messages.employee_id=employee_profiles.employee_id INNER JOIN companies ON messages.company_id=companies.id WHERE messages.employee_id=? AND messages.company_id=? ORDER BY id DESC LIMIT 40", [req.params.employee_id, req.params.company_id]);
        result = result.reverse();
        res.json(result);
    } catch (err) {
        res.status(403).send(err);
    }
});

module.exports = router;
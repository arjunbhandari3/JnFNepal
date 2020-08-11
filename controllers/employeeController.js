exports.viewProfile = async (req, res) => {
    try {
        var data = await poolQuery("SELECT employee_profiles.*, employees.full_name FROM employee_profiles INNER JOIN employees ON employee_profiles.employee_id=employees.id AND employee_profiles.employee_id=?", [req.params.id]);
        if (data.length < 1) throw "Invalid link was followed.";

        res.render('employee/profile', {
            employee: data[0]
        });
    } catch (err) {
        req.flash('error', err);
        res.redirect('/');
    }
}

exports.completeProfilePage1 = async (req, res) => {
    const cities = await poolQuery("SELECT * FROM cities", []);
    const categories = await poolQuery("SELECT * FROM categories", []);
    const qualifications = await poolQuery("SELECT * FROM qualifications", []);
    res.render('employee/complete', {
        cities,
        categories,
        qualifications
    });
};

exports.completeProfilePage1Post = async (req, res) => {
    try {
        if (req.body.keywords.length < 1 || req.body.city.length < 1 || req.body.academic_qualification.length < 1 || req.body.preferred_category.length < 1) {
            throw "Please fill all the fields";
        } else {
            const data = await poolQuery("SELECT COUNT(*) as num FROM employee_profiles WHERE employee_id=?", [req.userData.id]);
            if (data[0].num < 1) {
                const result = await poolQuery("INSERT INTO employee_profiles (employee_id, city, keywords, preferred_category, academic_qualification) VALUES (?,?,?,?,?)", [req.userData.id, req.body.city, req.body.keywords, req.body.preferred_category, req.body.academic_qualification]);
            }
            res.redirect('/employee/complete2');
        }
    } catch (err) {
        req.flash('error', err);
        res.redirect('/employee/complete');
    }
};

exports.completeProfilePage2 = (req, res) => {
    res.render('employee/complete2');
};

exports.completeProfilePage2Post = async (req, res) => {
    try {
        if (!req.files) throw "File wasn't supplied.";

        var file = req.files.myFile;
        var fileName = file.name;
        var mimeType = file.mimetype;
        var size = file.data.length;
        var extension = path.extname(fileName);
        var allowedExtensions = /pdf/;

        var validExtension = allowedExtensions.test(extension.toLowerCase());
        var validMimeType = allowedExtensions.test(mimeType.toLowerCase());

        if (!(validExtension && validMimeType)) throw ("Only PDF is allowed!")

        if (size > 5000000) throw ("File size must be less than 5 MB")

        await moveFile(file, "./public/uploads/employees/resumes/" + req.userData.id + ".pdf");

        const result = await poolQuery("UPDATE employee_profiles SET resume=? WHERE employee_id=?", ["/uploads/employees/resumes/" + req.userData.id + ".pdf", req.userData.id]);
        res.redirect('/employee/complete3');

    } catch (err) {
        req.flash('error', err);
        res.redirect('/employee/complete2');
    }
};

exports.completeProfilePage3 = (req, res) => {
    res.render('employee/complete3');
};

exports.completeProfilePage3Post = async (req, res) => {
    try {
        if (!req.files) throw "File wasn't supplied.";

        var file = req.files.myFile;
        var fileName = file.name;
        var mimeType = file.mimetype;
        var size = file.data.length;
        var extension = path.extname(fileName);
        var allowedExtensions = /jpg|jpeg|png|gif/;

        var validExtension = allowedExtensions.test(extension.toLowerCase());
        var validMimeType = allowedExtensions.test(mimeType.toLowerCase());

        if (!(validExtension && validMimeType)) throw ("Only image files are allowed!")

        if (size > 5000000) throw ("File size must be less than 5 MB")

        await moveFile(file, "./public/uploads/employees/profile_pictures/" + req.userData.id + ".gif");

        const result = await poolQuery("UPDATE employee_profiles SET picture=? WHERE employee_id=?", ["/uploads/employees/profile_pictures/" + req.userData.id + ".gif", req.userData.id]);
        req.flash('success', "Profile was completed successfully.");
        res.redirect('/');

    } catch (err) {
        req.flash('error', err);
        res.redirect('/employee/complete3');
    }
};
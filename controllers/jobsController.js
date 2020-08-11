exports.viewJob = async (req, res) => {
    try {
        var data = await poolQuery("SELECT jobs.*, companies.website, companies.phone_number FROM jobs INNER JOIN companies ON companies.id=jobs.company_id AND jobs.id=?", [req.params.id]);
        
        if (data.length < 1) throw "Invalid link was followed.";

        res.render('job', {
            job: data[0]
        });
    } catch (err) {
        req.flash('error', err)
        res.redirect('/');
    }
};
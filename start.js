const app = require('./app');
path = require('path');

const mysql = require('mysql');
pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jnf',
    supportBigNumbers: true,
    bigNumberStrings: true
});

poolQuery = (query, fields) => {
    return new Promise((resolve, reject) => {
        pool.query(query, fields, (err, data) => {
            if (err) {
                console.log(err);
                reject("Database Error Occurred.");
            } else {
                resolve(data);
            }
        });
    });
}

moveFile = (file, dir) => {
    return new Promise((resolve, reject) => {
        file.mv(dir, function (err) {
            if (err) {
                reject("Couldn't move file.");
            } else {
                resolve();
            }
        });
    })
}

app.listen(process.env.PORT, () => {
    console.log("Server is listening on port " + process.env.PORT);
});
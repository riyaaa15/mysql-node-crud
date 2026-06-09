require('dotenv').config();
const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

// middleware setup
app.use(methodOverride("_method")); // enables PATCH/DELETE from HTML forms
app.use(express.urlencoded({ extended: true })); // parses form data
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: process.env.DB_PASSWORD, // loaded from .env
});

// generates a fake user array for bulk insert
let getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.username(),
        faker.internet.email(),
        faker.internet.password(),
    ];
};

// GET / → show total user count
app.get("/", (req, res) => {
    let q = `SELECT count(*) FROM user`;
    try {
        connection.query(q, (err, result) => {
            if(err) throw err;
            let count = result[0]["count(*)"];
            res.render("home.ejs", { count });
        });
    } catch(err) {
        console.log(err);
        res.send("some error in DB");
    }
});

// GET /user → show all users
app.get("/user", (req, res) => {
    let q = `SELECT * FROM user`;
    try {
        connection.query(q, (err, users) => {
            if(err) throw err;
            res.render("showusers.ejs", { users });
        });
    } catch(err) {
        console.log(err);
        res.send("some error in DB");
    }
});

// GET /user/new → show add user form
app.get("/user/new", (req, res) => {
    res.render("new.ejs");
});

// POST /user → insert new user into database
app.post("/user", (req, res) => {
    let { id, username, email, password } = req.body;
    let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}', '${username}', '${email}', '${password}')`;
    connection.query(q, (err, result) => {
        if(err) throw err;
        res.redirect("/user");
    });
});

// GET /user/:id/edit → show edit form for a specific user
app.get("/user/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if(err) throw err;
            let user = result[0];
            res.render("edit.ejs", { user });
        });
    } catch(err) {
        console.log(err);
        res.send("some error in DB");
    }
});

// PATCH /user/:id → verify password and update username
app.patch("/user/:id", (req, res) => {
    let { id } = req.params;
    let { password: formPass, username: newUsername } = req.body;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if(err) throw err;
            let user = result[0];
            if(formPass != user.password) {
                res.send("WRONG password");
            } else {
                let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
                connection.query(q2, (err, result) => {
                    if(err) throw err;
                    res.redirect("/user");
                });
            }
        });
    } catch(err) {
        console.log(err);
        res.send("some error in DB");
    }
});

// GET /user/:id/delete → show delete confirmation form
app.get("/user/:id/delete", (req, res) => {
    let { id } = req.params;
    res.render("delete.ejs", { user: { id } });
});

// DELETE /user/:id → verify email & password then delete user
app.delete("/user/:id", (req, res) => {
    let { id } = req.params;
    let { email: formEmail, password: formPass } = req.body;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if(err) throw err;
            let user = result[0];
            if(formEmail != user.email || formPass != user.password) {
                res.send("Wrong email or password");
            } else {
                let q2 = `DELETE FROM user WHERE id='${id}'`;
                connection.query(q2, (err, result) => {
                    if(err) throw err;
                    res.redirect("/user");
                });
            }
        });
    } catch(err) {
        console.log(err);
        res.send("some error in DB");
    }
});

// start server on port 8080
app.listen("8080", () => {
    console.log("server is listening to port 8080");
});
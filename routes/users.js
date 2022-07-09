const userRoute = require('express').Router();
const passport = require('passport');
const initPassport = require('../passport-config');
const bycrpyt = require('bcrypt');
const pg = require('../pgConfig');
const saltRounds = 10;

userRoute.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
}));

userRoute.get("/login", function (req, res) {
    res.render("login");
});

userRoute.get("/register", checkNotAuthenticated, (req, res) => {
    res.render("register");
});

userRoute.post("/register", async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    try {
        const hasedPassword = await bycrpyt.hash(password, saltRounds);
        const newUser = { name, email, password: hasedPassword };
        const users = await pg.query('select * from users where email = $1', [email]);
        if (users.rows.length > 0) { // if we found the email in database.
            res.redirect("/users/login"); // do nothing
        } else {
            const result = await pg.query('insert into users (username, email, password) values ($1, $2, $3) RETURNING *', [name, email, hasedPassword]);
            console.log(result.rows);
            res.redirect("/users/login");
        }
    } catch (err) {
        console.log(err);
        res.render("register");
    }
});

userRoute.get("/profile", checkAuthenticated, async (req, res) => {
    try {
        const posts = await pg.query('select * from posts where user_id = $1', [req.user.id]);
        res.render("profile", { user: req.user, posts: posts.rows });
    } catch (err) {
        console.log(err);
        res.redirect("/")
    }
});

userRoute.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err)
            return next(err);
        res.redirect('/users/login');
    });
    // res.redirect('/login')
})

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/users/login')
}
module.exports = userRoute;
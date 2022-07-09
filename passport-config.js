const LocalStrategy = require('passport-local').Strategy;
const pg = require('./pgConfig');
const bcrypt = require('bcrypt');


module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    passport.use(new LocalStrategy(
        async function (email, password, done) {
            try {
                // console.log(18, { email, password });
                const users = await pg.query('select * from users where email = $1', [email]);
                if (users.rows.length > 0) {
                    const user = users.rows[0];
                    // console.log(user);
                    const isMatch = await bcrypt.compare(password, user.password);
                    console.log(isMatch);
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                } else {
                    return done(null, false);
                }
            } catch (err) {
                console.log(err);
                return done(null, false);
            }
        }
    ));
}
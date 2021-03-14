const path = require('path');
const Buffer = require('buffer');
require('dotenv').config();

const axios = require('axios');
const forge = require('node-forge');

// Initialize express
const express = require('express');
const PORT = process.env.PORT || 6754;
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET }));

// Initializing MySQL
const mysql = require('mysql');
const sql = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE
});

// Initializing passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((token, done) => {
    done(null, token);
});
passport.deserializeUser((token, done) => {
    done(null, token);
});

// Local auth
passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'signature'
        },
        (username, signature, done) => {
            sql.query(
                'SELECT `id`,`key_decrypt` FROM `users` WHERE `username` = ?',
                username, (err, rows, fields) => {
                    if (err) throw err;

                    // Check if user is found
                    if (rows.length == 0)
                        return done(null, false);

                    const md = forge.md.sha1.create();
                    md.update(username, 'utf8');

                    const key_decrypt = forge.pki.publicKeyFromPem(
                        rows[0].key_decrypt);

                    const verified = key_decrypt.verify(
                        md.digest().bytes(), signature);

                    if (verified) {
                        return done(null, {
                            id: rows[0].id,
                            username
                        });
                    }
                    else {
                        return done(null, false);
                    }
                }
            );
        }
    )
);
app.post('/api/login',
    passport.authenticate('local', {
        successRedirect: '/id/me',
        failureRedirect: '/login',
        failureFlash: false
    })
);
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

function isAuth(req, res, next) {
    if (req.user)
        next();
    else
        res.redirect('/login');
}

// Facebook OAuth
passport.use(
    new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: 'https://repul.ink/auth/facebook/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        axios.get(`https://graph.facebook.com/v10.0/${profile.id}?access_token=${accessToken}&fields=link`)
        .then(res => {
            const user = {
                facebook: {
                    id: profile.id,
                    name: profile.displayName,
                    link: res.data.link
                }
            };
            done(null, user);
        })
        .catch(err => {
            console.log('error');
        });
    }
));
app.get('/auth/facebook',
    passport.authorize('facebook', { scope: 'user_link' }));
app.get('/auth/facebook/callback',
    passport.authorize('facebook', {
        failureRedirect: '/'
    }),
    (req, res) => {
        console.log(req.account);
        res.end('<html><body><script>window.location.href=\'/me\';</script></body></html>');
    }
);

// Handle static files
app.use(express.static(path.join(__dirname, 'build')));

// Public APIs
app.get('/api/id/:username', (req, res) => {
    var username = req.params.username

    if (username == 'me' && req.user)
        username = req.user.username;

    if (!username) return res.json({ code: 1, message: 'Missing user!' });

    sql.query(
        'SELECT `username`,`name`,`blurb`,`key_decrypt`,`key_encrypt` FROM `users` WHERE `username` = ?',
        username, (err, rows, fields) => {
            if (err) throw err;

            // Check if user is found
            if (rows.length == 0)
                return res.json({ code: 2, message: 'User not found!' });

            res.json({
                code: 0,
                username: rows[0].username,
                name: rows[0].name,
                blurb: rows[0].blurb,
                key_decrypt: rows[0].key_decrypt.toString()
            });
        }
    );
});

app.post('/api/register', (req, res) => {
    const { username, key_encrypt, key_decrypt } = req.body;

    if (!username) return res.json({ code: 1, message: 'Missing username!' });
    if (!key_encrypt) return res.json({ code: 2, message: 'Missing key_encrypt!' });
    if (!key_decrypt) return res.json({ code: 3, message: 'Missing key_decrypt!' });

    sql.query(
        'SELECT EXISTS(SELECT * FROM `users` WHERE `username` = ?)',
        username, (err, rows, fields) => {
            if (err) throw err;
            if (Object.values(rows[0])[0])
                return res.json({ code: 4, message: 'Username is already in use!' });

            sql.query(
                'INSERT INTO `users` (`username`,`name`,`key_encrypt`,`key_decrypt`) VALUES (?,?,?,?)',
                [ username, username, key_encrypt, key_decrypt ],
                (err, rows, fields) => {
                    if (err) throw err;
                    return res.json({ code: 0, message: 'Success' });
                }
            );
        }
    );
});

app.post('/api/prepareLogin', (req, res) => {
    const { username } = req.body;

    if (!username) return res.json({ code: 1, message: 'Missing username!' });

    sql.query(
        'SELECT EXISTS(SELECT * FROM `users` WHERE `username` = ?)',
        username, (err, rows, fields) => {
            if (err) throw err;
            if (!Object.values(rows[0])[0])
                return res.json({ code: 4, message: 'Invalid username!' });

            sql.query(
                'SELECT `key_encrypt` FROM `users` WHERE `username` = ?',
                username,
                (err, rows, fields) => {
                    if (err) throw err;
                    return res.json({
                        code: 0,
                        message: 'Success',
                        key_encryption: rows[0].key_encrypt.toString()
                    });
                }
            );
        }
    );
});

app.post('/api/edit', isAuth, (req, res) => {
    const { name, blurb } = req.body;

    if (!name) return res.json({ code: 1, message: 'Missing name!' });

    sql.query(
        'UPDATE `users` SET `name` = ?, `blurb` = ? WHERE `id` = ?',
        [ name, blurb, req.user.id ], (err, rows, fields) => {
            if (err) throw err;
            return res.json({
                code: 0,
                message: 'Success'
            });
        }
    );
});

// Wildcard router for React app
function wildcard(req, res) {
    res.sendFile(path.join(__dirname, 'build/index.html'));
}

app.get('/id/me', isAuth, wildcard);
app.get('/edit', isAuth, wildcard);
app.get('*', wildcard);

// Start server
sql.connect((err) => {
    if (err)
        console.log(`sql error while connecting: ${err.stack}`);
    else {
        console.log(`connected to sql server`);
        app.listen(PORT, () => console.log(`server running on port ${PORT}`));
    }
});

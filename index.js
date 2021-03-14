const path = require('path');
const Buffer = require('buffer');
require('dotenv').config();

const axios = require('axios');
const forge = require('node-forge');

// Initializing
const short = require('short-uuid');
const UUID = short(short.constants.flickrBase58);

// Initializing express
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
const TwitterStrategy = require('passport-twitter').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

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
            done(null, {
                id: profile.id,
                name: profile.displayName,
                link: res.data.link
            });
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
        failureRedirect: '/id/me'
    }),
    (req, res) => {
        sql.query(
            'UPDATE `users` SET `facebook_id` = ?, `facebook_name` = ?, `facebook_link` = ? WHERE (`id` = ?)',
            [ req.account.id, req.account.name, req.account.link, req.user.id ],
            (err, rows, fields) => {
                if (err) throw err;
            }
        );

        res.end('<html><body><script>window.location.href=\'/id/me\';</script></body></html>');
    }
);

// Twitter OAuth
passport.use(
    new TwitterStrategy({
        consumerKey: process.env.TWITTER_APP_KEY,
        consumerSecret: process.env.TWITTER_APP_SECRET,
        callbackURL: 'https://repul.ink/auth/twitter/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        done(null, {
            id: profile.id,
            name: `${profile.displayName} (@${profile.username})`,
            link: `https://twitter.com/${profile.username}`
        });
    }
));
app.get('/auth/twitter',
    passport.authorize('twitter'));
app.get('/auth/twitter/callback',
    passport.authorize('twitter', {
        failureRedirect: '/id/me'
    }),
    (req, res) => {
        sql.query(
            'UPDATE `users` SET `twitter_id` = ?, `twitter_name` = ?, `twitter_link` = ? WHERE (`id` = ?)',
            [ req.account.id, req.account.name, req.account.link, req.user.id ],
            (err, rows, fields) => {
                if (err) throw err;
            }
        );

        res.end('<html><body><script>window.location.href=\'/id/me\';</script></body></html>');
    }
);

// GitHub OAuth
passport.use(
    new GitHubStrategy({
        clientID: process.env.GITHUB_APP_ID,
        clientSecret: process.env.GITHUB_APP_SECRET,
        callbackURL: 'https://repul.ink/auth/github/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        done(null, {
            id: profile.id,
            name: `${profile.displayName} (@${profile.username})`,
            link: `https://github.com/${profile.username}`
        });
    }
));
app.get('/auth/github',
    passport.authorize('github'));
app.get('/auth/github/callback',
    passport.authorize('github', {
        failureRedirect: '/id/me'
    }),
    (req, res) => {
        sql.query(
            'UPDATE `users` SET `github_id` = ?, `github_name` = ?, `github_link` = ? WHERE (`id` = ?)',
            [ req.account.id, req.account.name, req.account.link, req.user.id ],
            (err, rows, fields) => {
                if (err) throw err;
            }
        );

        res.end('<html><body><script>window.location.href=\'/id/me\';</script></body></html>');
    }
);

// Handle static files
app.use(express.static(path.join(__dirname, 'build')));

// Public APIs
app.get('/api/id/:username', (req, res) => {
    var username = req.params.username

    if (username == 'me') {
        if (req.user)
            username = req.user.username;
        else
            return res.json({ code: 3, message: 'Not authenticated!' });
    }

    if (!username) return res.json({ code: 1, message: 'Missing user!' });

    sql.query(
        'SELECT `username`,`name`,`blurb`,`key_decrypt`,`key_encrypt`,`facebook_name`,`facebook_link`,`twitter_name`,`twitter_link`,`github_name`,`github_link` FROM `users` WHERE `username` = ?',
        username, (err, rows, fields) => {
            if (err) throw err;

            // Check if user is found
            if (rows.length == 0)
                return res.json({ code: 2, message: 'User not found!' });

            res.json({
                code: 0,
                message: 'Success',
                username: rows[0].username,
                name: rows[0].name,
                blurb: rows[0].blurb,
                key_decrypt: rows[0].key_decrypt.toString(),
                facebook_name: rows[0].facebook_name,
                facebook_link: rows[0].facebook_link,
                twitter_name: rows[0].twitter_name,
                twitter_link: rows[0].twitter_link,
                github_name: rows[0].github_name,
                github_link: rows[0].github_link
            });
        }
    );
});

app.get('/api/sig/:uuid', (req, res) => {
    const uuid = req.params.uuid;

    sql.query(
        'SELECT * FROM `signatures` WHERE `uuid` = ?',
        uuid, (err, rows, fields) => {
            if (err) throw err;

            // Check if user is found
            if (rows.length == 0)
                return res.json({ code: 1, message: 'Signature not found!' });

            res.json({
                code: 0,
                message: 'Success',
                uuid: rows[0].uuid,
                username: rows[0].username,
                signature: rows[0].signature.toString(),
                hash: rows[0].hash,
                text: rows[0].text
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

app.post('/api/prepareSign', isAuth, (req, res) => {
    sql.query(
        'SELECT EXISTS(SELECT * FROM `users` WHERE `username` = ?)',
        req.user.username, (err, rows, fields) => {
            if (err) throw err;
            if (!Object.values(rows[0])[0])
                return res.json({ code: 4, message: 'Invalid username!' });

            sql.query(
                'SELECT `key_encrypt` FROM `users` WHERE `username` = ?',
                req.user.username,
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

app.post('/api/sign', isAuth, (req, res) => {
    let { hash, payload, signature } = req.body;

    sql.query(
        'SELECT `id`,`key_decrypt` FROM `users` WHERE `username` = ?',
        req.user.username, (err, rows, fields) => {
            if (err) throw err;

            // Check if user is found
            if (rows.length == 0)
                return done(null, false);

            const md = forge.md.sha1.create().update(payload, 'utf8');

            const key_decrypt = forge.pki.publicKeyFromPem(
                rows[0].key_decrypt);

            hash = hash || md.digest().toHex();
            const verified = key_decrypt.verify(
                forge.util.hexToBytes(hash), signature);

            if (verified) {
                const uuid = UUID.new();
                sql.query(
                    'INSERT INTO `signatures` (`uuid`,`username`,`signature`,`hash`,`text`) VALUES (?,?,?,?,?)',
                    [ uuid, req.user.username, signature, hash, payload ],
                    (err, rows, fields) => {
                        if (err) throw err;

                        return res.json({
                            code: 0,
                            message: 'Success',
                            uuid
                        });
                    }
                );
            }
            else {
                return res.json({
                    code: 1,
                    message: 'Invalid signature!'
                });
            }
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

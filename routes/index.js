var express = require('express'),
    router = express.Router(),
    User = require('../modules/user'),
    passport = require('passport');

// root route
router.get('/', (req, res) => {
    res.render('landing');
});

// User Auth routes
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render('register');
        } 
        passport.authenticate('local')(req, res, () => {
            req.flash('success', 'Signed you up');
            res.redirect('/campgrounds');
        });
    });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login',
    }), (req, res) => { 
});

// logout route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out');
    res.redirect('/campgrounds');
});


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You must log in to do that');
    res.redirect('/login');
}

module.exports = router;
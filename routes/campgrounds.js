var express = require('express'),
    router = express.Router(),
    Campground = require('../modules/campground'),
    Comment = require('../modules/comment'),
    middleware = require('../middleware');

var isLoggedIn = middleware.isLoggedIn;
var checkUserCampground = middleware.checkUserCampground;

// INDEX route 
router.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, campground) => {
        if(err){
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: campground, currentUser: req.user});
        }
    });
});

// CREATE route
router.post('/campgrounds', isLoggedIn, (req, res) => { 
    Campground.create({name: req.body['name'], price: req.body['price'], image: req.body['image'], description: req.body['description']}, (err, newlyCreated) => {
        if(err){
            console.log(err);
        } else {
            newlyCreated.author.id = req.user._id;
            newlyCreated.author.username = req.user.username;
            newlyCreated.save();
            res.redirect('/campgrounds/' + newlyCreated._id);
        }
    });
});

// NEW route
router.get('/campgrounds/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// SHOW route
router.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if(err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });    
});

// EDIT
router.get('/campgrounds/:id/edit', isLoggedIn, checkUserCampground, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err) {
            res.redirect('/campgrounds');
        } else {
            res.render('campgrounds/edit', {campground: foundCampground});
        }
    });
});

// UPDATE
router.put('/campgrounds/:id', isLoggedIn, checkUserCampground, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err) {
            res.redirect('/campgrounds');
            console.log('ERROR! ****** ' + err );
        } else {
            req.flash('success', 'You successfully edited Campground');
            res.redirect('/campgrounds/' + updatedCampground._id);
        }
    });
});

// DELETE - removes campground and its comments from the database
router.delete("/campgrounds/:id", isLoggedIn, checkUserCampground, function(req, res) {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log('ERRORR ***** ' + err);
            res.redirect("/campgrounds");
        } else {
            Comment.remove({
                _id: {
                $in: campground.comments
                }
            }, function(err) {
                if(err) {
                    res.redirect('/campgrounds');
                } else {
                    campground.remove(function(err) {
                        if(err) {
                            //req.flash('error', err.message);
                            return res.redirect('/campgrounds');
                        } else {
                            req.flash('success', 'Campground deleted!');
                            res.redirect('/campgrounds');
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
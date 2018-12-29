var express = require('express'),
    router = express.Router(),
    Comment = require('../modules/comment'),
    Campground = require('../modules/campground'),
    middleware = require('../middleware');

var isLoggedIn = middleware.isLoggedIn;
var checkUserComment = middleware.checkUserComment;

/**** Comments Routes ****/

// NEW route
router.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground});
        }
    });
});

// CREATE route
router.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                campground.comments.push(comment);
                campground.save();
                res.redirect('/campgrounds/' + req.params.id);    
            });
        }
    });
});

// Edit
router.get('/campgrounds/:id/comments/:comment_id/edit', isLoggedIn, checkUserComment, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err){
            console.log("ERRORR ***** " + err);
            res.redirect('back');
        } else {
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
        }
    });
});
// Update
router.put('/campgrounds/:id/comments/:comment_id', isLoggedIn, checkUserComment, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, foundComment) => {
        if(err){
            console.log("ERRORR ***** " + err);
            res.redirect('back');
        } else {
            req.flash('success', 'Comment edited');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});
// Delete
router.delete('/campgrounds/:id/comments/:comment_id', isLoggedIn, checkUserComment, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
            console.log("ERRORR ***** " + err);
            res.redirect('/campgrounds/' + req.params.id);
        } else {
            req.flash('success', 'Comment deleted');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

module.exports = router;
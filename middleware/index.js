// all the middleware methods goes here

var Campground = require('../modules/campground'),
    Comment = require('../modules/comment');

var middlewareObj = {};

middlewareObj.checkUserCampground = function(req, res, next){
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            console.log('ERRORR ***** ' + err);
            res.redirect('back');
        } else {
            if(foundCampground.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash('error', 'You do not have permission to do that!');
                res.redirect('/campgrounds/' + req.params.id);
            }
        }
    });
};

middlewareObj.checkUserComment = function(req, res, next){
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err){
            console.log('ERRORR ***** ' + err);
            res.redirect('back');
        } else {
            if(foundComment.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash('error', 'You do not have permission to do that!');
                res.redirect('/campgrounds/' + req.params.id);
            }
        }
    });
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You must login first to do that.');
    res.redirect('/login');
};

module.exports = middlewareObj;
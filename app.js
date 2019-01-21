var dotenv = require('dotenv').config(),
    express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
    mongoose   =   require('mongoose'),
    Campground = require('./modules/campground'),
    seedDB = require('./seeds'),
    Comment = require('./modules/comment'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./modules/user'),
    campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes = require('./routes/commments'),
    indexRoutes = require('./routes/index'),
    methodOverride = require('method-override'),
    flash = require('connect-flash');

// seedDB(); // add some starter data (DELETES ALL THE EXISTING DATA AND ADDS NEW DATA!), does not work anymore, change it
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// Passport Configurations
app.use(require('express-session')({
    secret: 'Oink Oink motherfucker!',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// res.locals are avaible everywhere
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error'),
    res.locals.success = req.flash('success');
    next();
});

/****** ROUTES ******/
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

// start the server
app.listen(process.env.PORT, () => { 
    console.log('Server is running, enter CTRL + C to terminate.');
});
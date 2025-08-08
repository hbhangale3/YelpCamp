if(process.env.NODE_ENV!== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const helmet = require('helmet');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const { render } = require('ejs');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const {campgroundSchema, reviewSchema} = require('./schema');
const { reverse } = require('dns');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const sanitizeV5 = require('./utils/mongoSanitizeV5.js');
app.set('query parser', 'extended');
const MongoDBStore = require('connect-mongo')(session);

const userRoutes = require('./routes/users');
const campRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/review');


const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';

mongoose.connect(dbUrl)
.then(()=>{
    console.log("Mongo Connection Open");
})
.catch((err)=>{
    console.log("Oh No Mongo error");
    console.log(err);
})

app.use(flash());
app.use(express.static(path.join(__dirname,'public')))
app.use(sanitizeV5({ replaceWith: '_' }));

const secret = process.env.SECRET || 'thisshouldbeasecret';

const store = new MongoDBStore({
    url: dbUrl,
    secret: secret,
    touchAfter: 24*3600
})
store.on("error", function(e){
    console.log("Session Store Error", e);
})

app.use(session({
    store,
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, //prevent XSS attack
        expires: Date.now()+ 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}))
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.tiles.mapbox.com/",
    // "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.mapbox.com/",
    // "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const connectSrcUrls = [
     // "https://api.mapbox.com/",
    // "https://a.tiles.mapbox.com/",
    // "https://b.tiles.mapbox.com/",
    // "https://events.mapbox.com/",
    "https://api.maptiler.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dyr7igtpp/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://api.maptiler.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);




app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    // console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


//fake registration
app.get('/fakeUser', async (req,res)=>{
    const user = new User({
        username: 'hbhangale',
        email: 'demo@gmail.com'
    })
    const newUser = await User.register(user,'chicken');

})

app.use('/campground', campRoutes);
app.use('/campground/:id/review', reviewRoutes);
app.use('/', userRoutes);

app.get('/', (req,res)=>{
    res.render('homescreen');
})

//unknown url
app.all(/(.*)/, (req, res, next) => {
    return next(new ExpressError("Page Not Found!", 404));
})

//custom error handler

app.use((err,req,res,next)=>{
    const {status = 500, message="Something went wrong"} = err;
    res.status(status).render('error', {err});
})

const port = process.env.PORT || 3000
app.listen(3000, ()=>{
    console.log(`Server listening on ${port}`);
})
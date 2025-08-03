const express = require('express');
const app = express();
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

const userRoutes = require('./routes/users');
const campRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/review');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(()=>{
    console.log("Mongo Connection Open");
})
.catch((err)=>{
    console.log("Oh No Mongo error");
    console.log(err);
})

app.use(flash());
app.use(express.static(path.join(__dirname,'public')))
app.use(session({
    secret: 'thisshouldbeasecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, //prevent XSS attack
        expires: Date.now()+ 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}))


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



//unknown url
app.all(/(.*)/, (req, res, next) => {
    return next(new ExpressError("Page Not Found!", 404));
})

//custom error handler

app.use((err,req,res,next)=>{
    const {status = 500, message="Something went wrong"} = err;
    res.status(status).render('error', {err});
})

app.listen(3000, ()=>{
    console.log('Server listening on 3000');
})
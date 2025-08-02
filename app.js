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

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use('/campground', campRoutes);
app.use('/campground/:id/review', reviewRoutes);



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
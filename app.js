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
const Review = require('./models/reviews');

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

//validating campground data
const validateCampground = (req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body, { abortEarly: false });
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        return next(new ExpressError(msg,400));
    }else{
        next();
    }
}

//validating review data
const validateReview= (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body, { abortEarly: false });
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        return next(new ExpressError(msg,400));
    }else{
        next();
    }
}


//home page
app.get('/campground', async (req,res)=>{
    const camp = await Campground.find({});
    //console.log(camp);
    res.render('home', {camp});  
})

app.get('/campground/new', (req,res)=>{
    res.render('new');
})

//show details about a campground.

app.get('/campground/:id',catchAsync(async (req,res)=>{
    //const {id} = req.params;
    const campground = await Campground.findById(req.params.id).populate('review');
    res.render('show',{campground});
}))

//editing existing data

app.get('/campground/:id/edit', catchAsync(async (req,res)=>{
    //const {id} = req.params;
    const camp = await Campground.findById(req.params.id);
    res.render('edit', {camp});
}))

app.patch('/campground/:id', validateCampground ,catchAsync(async (req,res)=>{


    const camp = await Campground.findById(req.params.id);
    camp.title = req.body.title;
    camp.location= req.body.location;
    camp.price=req.body.price,
    camp.image=req.body.image,
    camp.description=req.body.description
    await camp.save();
    res.redirect(`/campground/${camp._id}`);
}))

//Handling new form data

app.post('/campground', validateCampground, catchAsync(async(req,res, next)=>{
    
    const campground = new Campground({
        title: req.body.title,
        location: req.body.location,
        price: req.body.price,
        image: req.body.image,
        description: req.body.description
    });
    await campground.save();
    res.redirect(`/campground/${campground._id}`);
}))


//deleting data
app.delete('/campground/:id', catchAsync(async(req,res)=>{
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campground');
}))

//creating reviews
app.post('/campground/:id/review', validateReview, catchAsync(async (req,res)=>{
    const camp = await Campground.findById(req.params.id);
    const rev = new Review({
        comment: req.body.review,
        rating: req.body.rating
    })
    camp.review.push(rev);
    await rev.save();
    await camp.save();
    res.redirect(`/campground/${camp._id}`);
}))



//unknown url
app.all(/(.*)/, (req, res, next) => {
    return next(new ExpressError("Page Not Found!", 404));
})

app.use((err,req,res,next)=>{
    const {status = 500, message="Something went wrong"} = err;
    res.status(status).render('error', {err});
})

// app.use((err,req,res,next)=>{
//     console.log("********************************");
//     console.log("*************Error************");
//     console.log("********************************");

// })

// app.get('/makecampground', async (req,res)=>{
//     const camp = new Campground({
//         title:'My Backyard',
//         price:'35.99',
//     })
//     await camp.save();
//     res.send(camp);
// })
app.listen(3000, ()=>{
    console.log('Server listening on 3000');
})
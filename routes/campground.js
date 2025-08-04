const express = require('express');
const app = express();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {campgroundSchema} = require('../schema');
const router = express.Router();
const {isLoggedIn, validateCampground, isAuthor} = require('../utils/middleware');
const flash = require('express-flash');

app.use(flash());



//home page
router.get('/', async (req,res)=>{
    const camp = await Campground.find({});
    //console.log(camp);
    res.render('home', {camp});  
})

router.get('/new', isLoggedIn, (req,res)=>{
    res.render('new');
})

//show details about a campground.

router.get('/:id',catchAsync(async (req,res)=>{
    //const {id} = req.params;
    const campground = await Campground.findById(req.params.id).populate({
        path: 'review',
        populate:{
            path: 'author'
        }      
    }).populate('author');
    if(!campground){
        req.flash('error','Cannot find the campground');
        return res.redirect('/campground');
    }
    res.render('show',{campground
        // messages: req.flash('success')
    });
}))

//editing existing data

router.get('/:id/edit',isLoggedIn, catchAsync(async (req,res)=>{
    //const {id} = req.params;
    const camp = await Campground.findById(req.params.id);

    if(!camp){
        req.flash('error','Cannot find the campground');
        return res.redirect('/campground');
    }
    if(!req.user._id.equals(camp.author)){
        req.flash('error','You do not have the permission to perform the operation!');
        return res.redirect(`/campground/${camp._id}`);
    }
    res.render('edit', {camp});
    
}))

router.patch('/:id', isAuthor, validateCampground ,catchAsync(async (req,res)=>{


    const camp = await Campground.findById(req.params.id);
    camp.title = req.body.title;
    camp.location= req.body.location;
    camp.price=req.body.price,
    camp.image=req.body.image,
    camp.description=req.body.description
    await camp.save();
    req.flash('success', 'Camp Information Updated Successfully')
    res.redirect(`/campground/${camp._id}`);
}))

//Handling new form data

router.post('/', validateCampground, catchAsync(async(req,res, next)=>{
    
    const campground = new Campground({
        title: req.body.title,
        location: req.body.location,
        price: req.body.price,
        image: req.body.image,
        description: req.body.description
    });
    campground.author = req.user._id;
    await campground.save();

    req.flash('success', 'New Camp Created Successfully')
    res.redirect(`/campground/${campground._id}`);
}))


//deleting data
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async(req,res)=>{
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Camp Deleted Successfully')
    res.redirect('/campground');
    
}))


module.exports = router;



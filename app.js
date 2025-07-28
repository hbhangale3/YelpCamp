const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const { render } = require('ejs');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');


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

app.get('/campground/:id', async (req,res)=>{
    //const {id} = req.params;
    const campground = await Campground.findById(req.params.id);
    res.render('show',{campground});
})

//editing existing data

app.get('/campground/:id/edit', async (req,res)=>{
    //const {id} = req.params;
    const camp = await Campground.findById(req.params.id);
    res.render('edit', {camp});
})

app.patch('/campground/:id', async (req,res)=>{
    const camp = await Campground.findById(req.params.id);
    camp.title = req.body.title;
    camp.location= req.body.location;
    await camp.save();
    res.redirect(`/campground/${camp._id}`);
})

//Handling new form data

app.post('/campground', async(req,res)=>{
    const campground = new Campground({
        title: req.body.title,
        location: req.body.location,
        price: req.body.price,
        image: req.body.image,
        description: req.body.description
    });
    await campground.save();
    res.redirect(`/campground/${campground._id}`);
})


//deleting data
app.delete('/campground/:id', async(req,res)=>{
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campground');
})

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
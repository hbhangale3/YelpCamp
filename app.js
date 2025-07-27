const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(()=>{
    console.log("Mongo Connection Open");
})
.catch((err)=>{
    console.log("Oh No Mongo error");
    console.log(err);
})


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}))

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

//Handling new form data

app.post('/campground', async(req,res)=>{
    const campground = new Campground({
        title: req.body.title,
        location: req.body.location
    });
    await campground.save();
    res.redirect(`/campground/${campground._id}`);
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